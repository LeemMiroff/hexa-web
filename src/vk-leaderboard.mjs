const dailyEndpoint = 'https://functions.yandexcloud.net/d4e23i3rco9j0o70u5t4';
const hexaAppId = 54919475;
const launch = new URLSearchParams(location.search);
const appId = Number(launch.get('vk_app_id'));
const vkReferrer = /^https:\/\/(?:[a-z\d-]+\.)?vk\.(?:ru|com)\//i.test(document.referrer);
const inVK = appId === hexaAppId || (!appId && (vkReferrer || launch.has('vk_platform') ||
  window.AndroidBridge || window.webkit?.messageHandlers?.VKWebAppInit));
let bridgePromise;
let launchPromise;
let profilePromise;
let tokenPromise;
let pendingScore;

async function withTimeout(promise, milliseconds) {
  let timer;
  try {
    return await Promise.race([promise, new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('VK Bridge request timed out')), milliseconds);
    })]);
  } finally {
    clearTimeout(timer);
  }
}

async function loadBridge() {
  const {default: bridge} = await import('../vendor/vk-bridge-2.15.0.mjs');
  await withTimeout(bridge.send('VKWebAppInit'), 8000);
  return bridge;
}

function getBridge() {
  bridgePromise ??= loadBridge().catch(error => {
    bridgePromise = undefined;
    throw error;
  });
  return bridgePromise;
}

function signedLaunch(fields) {
  const params = new URLSearchParams(fields.filter(([key, value]) =>
    value != null && (key === 'sign' || key.startsWith('vk_'))));
  const userId = Number(params.get('vk_user_id'));
  if (Number(params.get('vk_app_id')) !== hexaAppId ||
      !Number.isSafeInteger(userId) || userId <= 0 || !params.get('sign')) return null;
  return {userId, signature: params.toString()};
}

async function resolveLaunch() {
  const fromURL = signedLaunch([...launch]);
  if (fromURL) return fromURL;
  const bridge = await getBridge();
  const fromBridge = await withTimeout(bridge.send('VKWebAppGetLaunchParams'), 5000);
  return signedLaunch(Object.entries(fromBridge));
}

function getLaunch() {
  launchPromise ??= resolveLaunch().catch(() => null).then(session => {
    if (!session) launchPromise = undefined;
    return session;
  });
  return launchPromise;
}

function vkProfile(profile) {
  return {
    id: Number(profile.id),
    name: [profile.first_name, profile.last_name].filter(Boolean).join(' '),
    avatar: profile.photo_100 || profile.photo_50 || ''
  };
}

export function readLeaderboardProfile() {
  if (!inVK) return Promise.resolve(null);
  profilePromise ??= getBridge()
    .then(bridge => withTimeout(bridge.send('VKWebAppGetUserInfo'), 8000))
    .then(vkProfile)
    .catch(() => {
      profilePromise = undefined;
      return null;
    });
  return profilePromise;
}

// This also initializes VK Bridge before the game exits the platform splash screen.
if (inVK) void readLeaderboardProfile();

async function dailyRequest(action, fields = {}) {
  const session = await getLaunch();
  if (!session) throw new Error('VK_LAUNCH');
  const response = await fetch(dailyEndpoint, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({action, launch: session.signature, ...fields}),
    signal: AbortSignal.timeout(25000)
  });
  if (response.status === 401) throw new Error('VK_LAUNCH');
  if (!response.ok) throw new Error('DAILY_UNAVAILABLE');
  return response.json();
}

async function getToken(bridge) {
  tokenPromise ??= withTimeout(bridge.send('VKWebAppGetAuthToken', {app_id: hexaAppId, scope: ''}), 8000)
    .then(result => result.access_token)
    .catch(error => {
      tokenPromise = undefined;
      throw error;
    });
  return tokenPromise;
}

async function readVK() {
  const bridge = await getBridge();
  const accessToken = await getToken(bridge);
  const {response} = await withTimeout(bridge.send('VKWebAppCallAPIMethod', {
    method: 'apps.getLeaderboard',
    request_id: 'hex-leaderboard',
    params: {v: '5.199', access_token: accessToken, type: 'level', global: 1, extended: 1}
  }), 8000).catch(error => {
    tokenPromise = undefined;
    throw error;
  });
  const profiles = new Map((response.profiles ?? []).map(profile => [
    Number(profile.id), vkProfile(profile)
  ]));
  const rows = response.items.map(({user_id, score, level, points}) => ({
    id: Number(user_id), score: Number(level ?? score ?? points)
  })).filter(row => row.id > 0 && Number.isSafeInteger(row.score))
    .sort((first, second) => second.score - first.score);
  let lastScore;
  let rank;
  for (const [index, row] of rows.entries()) {
    if (row.score !== lastScore) rank = index + 1;
    lastScore = row.score;
    row.rank = rank;
    const profile = profiles.get(row.id);
    row.name = profile?.name || `Игрок VK ${row.id}`;
    row.avatar = profile?.avatar;
  }
  const userId = signedLaunch([...launch])?.userId || (await readLeaderboardProfile())?.id || (await getLaunch())?.userId;
  return {rows: rows.slice(0, 30), personal: rows.find(row => row.id === userId) ?? null};
}

export function submitLeaderboardScore(score) {
  if (!inVK || !Number.isSafeInteger(score) || score <= 0) return;
  const previous = pendingScore;
  const submission = (async () => {
    await previous;
    try {
      return await dailyRequest('submit', {score});
    } catch {
      return {dailySaved: false, vkSynced: false};
    }
  })();
  pendingScore = submission;
}

export async function readLeaderboard(mode) {
  if (!inVK) return {message: 'Рейтинг доступен в ВК'};
  try {
    const submission = await pendingScore;
    if (mode === 'all') {
      const data = await readVK();
      if (submission && !submission.vkSynced) data.notice = 'Последний результат не отправлен в ВК';
      return data;
    }
    const data = await dailyRequest('day');
    if (submission && !submission.dailySaved) data.notice = 'Последний результат не отправлен';
    return data;
  } catch (error) {
    if (error.message === 'VK_LAUNCH') return {message: 'Не удалось подтвердить вход через ВК'};
    return {message: mode === 'day' ? 'Дневной рейтинг временно недоступен' : 'ВК не вернул общий рейтинг'};
  }
}
