const dailyEndpoint = 'https://functions.yandexcloud.net/d4e23i3rco9j0o70u5t4';
const hexaAppId = 54919475;
const launch = new URLSearchParams(location.search);
const appId = Number(launch.get('vk_app_id'));
const userId = Number(launch.get('vk_user_id'));
const inVK = appId === hexaAppId && Number.isSafeInteger(userId) && userId > 0 && launch.has('sign');
const launchSignature = new URLSearchParams([...launch].filter(([key]) => key === 'sign' || key.startsWith('vk_'))).toString();
let bridgePromise;
let tokenPromise;
let pendingScore;

async function loadBridge() {
  const {default: bridge} = await import('https://cdn.jsdelivr.net/npm/@vkontakte/vk-bridge@2.15.0/+esm');
  await bridge.send('VKWebAppInit');
  return bridge;
}

function getBridge() {
  bridgePromise ??= loadBridge().catch(error => {
    bridgePromise = undefined;
    throw error;
  });
  return bridgePromise;
}

async function dailyRequest(action, fields = {}) {
  const response = await fetch(dailyEndpoint, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({action, launch: launchSignature, ...fields}),
    signal: AbortSignal.timeout(25000)
  });
  if (!response.ok) throw new Error('YDB leaderboard request failed');
  return response.json();
}

async function getToken(bridge) {
  tokenPromise ??= bridge.send('VKWebAppGetAuthToken', {app_id: appId, scope: ''})
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
  const {response} = await bridge.send('VKWebAppCallAPIMethod', {
    method: 'apps.getLeaderboard',
    request_id: 'hex-leaderboard',
    params: {v: '5.199', access_token: accessToken, type: 'level', global: 1, extended: 1}
  }).catch(error => {
    tokenPromise = undefined;
    throw error;
  });
  const names = new Map((response.profiles ?? []).map(profile => [
    Number(profile.id), [profile.first_name, profile.last_name].filter(Boolean).join(' ')
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
    row.name = names.get(row.id) || `Игрок VK ${row.id}`;
  }
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
      let timer;
      try {
        const data = await Promise.race([readVK(), new Promise((_, reject) => {
          timer = setTimeout(() => {
            tokenPromise = undefined;
            reject(new Error('VK leaderboard request timed out'));
          }, 15000);
        })]);
        if (submission && !submission.vkSynced) data.notice = 'Последний результат не отправлен в ВК';
        return data;
      } finally {
        clearTimeout(timer);
      }
    }
    const data = await dailyRequest('day');
    if (submission && !submission.dailySaved) data.notice = 'Последний результат не отправлен';
    return data;
  } catch {
    return {message: 'Не удалось загрузить рейтинг'};
  }
}
