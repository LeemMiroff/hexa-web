// Imported from the user-provided saved Scraps build (2026-10-20).
// The original gameplay, audio and animation functions below are retained.
// The standalone boot and Wavedash account/SDK integration are excluded.
// Regenerate using scripts/import-original.py; change the bridge separately.
export function createOriginalEngine(host = {}) {
const document = globalThis.document.implementation.createHTMLDocument('Isolated game core');
document.body.innerHTML = "\n  <canvas id=\"bg\" aria-hidden=\"true\" style=\"display: none;\"></canvas>\n  <canvas id=\"cv\" width=\"1072\" height=\"756\" style=\"width: 1071.98px; height: 756px;\"></canvas>\n  <button id=\"themeBtn\" type=\"button\" aria-label=\"Switch theme\" style=\"left: 146.01px; right: auto; top: 12px; color: rgb(246, 239, 224); background: transparent; border-color: currentcolor; display: none;\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"4.4\"></circle><path d=\"M12 1.7v3M12 19.3v3M22.3 12h-3M4.7 12h-3M19.3 4.7l-2.1 2.1M6.8 17.2l-2.1 2.1M19.3 19.3l-2.1-2.1M6.8 6.8L4.7 4.7\" stroke=\"currentColor\" stroke-width=\"1.9\" stroke-linecap=\"round\" fill=\"none\"></path></svg></button>\n  <button id=\"muteBtn\" type=\"button\" aria-label=\"Mute sound\" aria-pressed=\"false\" style=\"left: 146.01px; right: auto; top: 12px; color: rgb(246, 239, 224); background: transparent; border-color: currentcolor;\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 9.2h3.6L12.4 5v14l-4.8-4.2H4z\"></path><path d=\"M15.6 8.6a4.8 4.8 0 0 1 0 6.8M18.2 6a8.4 8.4 0 0 1 0 12\" stroke=\"currentColor\" stroke-width=\"1.9\" stroke-linecap=\"round\" fill=\"none\"></path></svg></button>\n\n  <div id=\"menu\" class=\"overlay open\">\n    <div class=\"plaque\" role=\"dialog\" aria-label=\"Scraps\" style=\"background: rgb(253, 247, 234); color: rgb(42, 45, 88); border: 3px solid rgb(20, 21, 58);\">\n      <h1>SCRAPS</h1>\n      <svg class=\"menuArt\" viewBox=\"0 0 146 78\" aria-hidden=\"true\">\n        <path class=\"a\" d=\"m20 18 17-10 17 10v20L37 48 20 38Z\"></path>\n        <path class=\"b\" d=\"m56 18 17-10 17 10v20L73 48 56 38Z\"></path>\n        <path class=\"c\" d=\"m92 18 17-10 17 10v20l-17 10-17-10Z\"></path>\n        <path class=\"a\" d=\"m38 49 17-10 17 10v20L55 79 38 69Z\"></path>\n        <path class=\"b\" d=\"m74 49 17-10 17 10v20L91 79 74 69Z\"></path>\n      </svg>\n      <button id=\"playBtn\" type=\"button\" class=\"btn\" aria-label=\"Play\" style=\"background: rgb(50, 129, 83); color: rgb(255, 248, 240);\">\n        <svg class=\"ico\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M8 5.2v13.6L19 12z\"></path></svg>\n      </button>\n      <div class=\"stat\">\n        <svg class=\"ico sm\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M3.4 7.6l4.3 3.6L12 4.4l4.3 6.8 4.3-3.6-1.7 10H5.1z\"></path></svg>\n        <span id=\"menuBest\">1051</span>\n      </div>\n    </div>\n  </div>\n\n  <div id=\"over\" class=\"overlay\">\n    <div class=\"plaque\" role=\"dialog\" aria-label=\"No room left\" style=\"background: rgb(253, 247, 234); color: rgb(42, 45, 88); border: 3px solid rgb(20, 21, 58);\">\n      <!-- \"no room\": the board hex, packed solid. The two hex paths sit in a group of their own so a look can restyle them as\n           the first and last path of that group; the sad face is a second group, hidden unless a look shows it. -->\n      <div class=\"bigTitle\" aria-label=\"No room left\">\n        <svg viewBox=\"0 0 24 24\" width=\"54\" height=\"54\" aria-hidden=\"true\">\n          <g>\n            <path d=\"M12 1.8l8.8 5.1v10.2L12 22.2 3.2 17.1V6.9z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"></path>\n            <path d=\"M12 6.1l4.6 2.7v5.4L12 16.9l-4.6-2.7V8.8z\" fill=\"currentColor\"></path>\n          </g>\n          <g class=\"sadFace\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n            <path class=\"brow\" d=\"M6 9.5L10.2 7.9M18 9.5L13.8 7.9\"></path>\n            <circle class=\"eye\" cx=\"8.6\" cy=\"11.7\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"></circle>\n            <circle class=\"eye\" cx=\"15.4\" cy=\"11.7\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"></circle>\n            <path class=\"frown\" d=\"M8 17.9Q12 14.1 16 17.9\"></path>\n            <path class=\"tear\" d=\"M8.5 13.4Q10 15.2 8.5 16.5Q7 15.2 8.5 13.4Z\" fill=\"#c4e4ff\" stroke=\"none\"></path>\n          </g>\n        </svg>\n      </div>\n      <div class=\"score\" id=\"overScore\">0</div>\n      <div class=\"stat\" id=\"overBestRow\">\n        <svg class=\"ico sm\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M3.4 7.6l4.3 3.6L12 4.4l4.3 6.8 4.3-3.6-1.7 10H5.1z\"></path></svg>\n        <span id=\"overBest\">0</span>\n      </div>\n      <!-- targets reached this run: a bullseye and a count, shown only once there is one -->\n      <div class=\"stat\" id=\"overGoalsRow\" hidden=\"\">\n        <svg class=\"ico sm\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"8.6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\"></circle><circle cx=\"12\" cy=\"12\" r=\"3.4\"></circle></svg>\n        <span id=\"overGoals\">0</span>\n      </div>\n      <!-- Wavedash build: the player's rank on the \"high-scores\" leaderboard and its top five, filled by the adapter -->\n      <div id=\"wdBoard\" hidden=\"\">\n        <div class=\"stat\" id=\"wdRankRow\" hidden=\"\">\n          <svg class=\"ico sm\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M9 7h6v14H9zM2.5 12h6v9h-6zM15.5 15h6v6h-6z\"></path></svg>\n          <span id=\"wdRank\"></span>\n        </div>\n        <ol class=\"wdTop\" id=\"wdTop\" aria-label=\"Leaderboard\" hidden=\"\"></ol>\n      </div>\n      <div class=\"resultActions\">\n      <button id=\"againBtn\" type=\"button\" class=\"btn\" aria-label=\"Restart\" title=\"Restart\" style=\"background: rgb(50, 129, 83); color: rgb(255, 248, 240);\">\n        <svg class=\"ico\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 4.5V1.6L7.3 6l4.7 4.4V7.5a4.5 4.5 0 1 1-4.5 4.5H4.5a7.5 7.5 0 1 0 7.5-7.5z\"></path></svg>\n      </button>\n      <button id=\"continueBtn\" type=\"button\" class=\"btn\" aria-label=\"Watch an ad to continue\" title=\"Watch an ad to continue\" hidden=\"\" style=\"background: rgb(50, 129, 83); color: rgb(255, 248, 240);\"></button>\n      </div>\n    </div>\n  </div>\n\n";
const localStorage = {
  getItem(key) { return globalThis.localStorage.getItem(key === 'scraps-mute' ? 'hex-towers-muted' : 'hex-original-v1:' + key); },
  setItem(key, value) { globalThis.localStorage.setItem(key === 'scraps-mute' ? 'hex-towers-muted' : 'hex-original-v1:' + key, value); }
};
'use strict';

// ---------- themes ----------
// Every visual decision lives here; adding a look is adding one block.
const THEMES = {
  paper: {
    /* The BASE paper: the v2 look, which garden, glass and honey copy and inherit below. The look a player gets as "paper" is
       this object after the upgrade that follows the painted blocks (a dark desk, outlined tiles, cut-paper particles). */
    label: 'paper',
    bg: '#efe6d6',
    tray: '#e5d9c4',
    well: 'rgba(120,100,70,0.13)',
    wellEdge: 'rgba(120,100,70,0.05)',
    ringTrack: 'rgba(120,100,70,0.26)',
    trayEdge: 'rgba(120,100,70,0.10)',
    ink: '#3f3628',
    inkSoft: 'rgba(92,81,64,0.78)',
    // v2 polish: the board sits on a raised paper card, the tray in a recessed well
    card: '#fbf7ee',
    cardEdge: 'rgba(120,100,70,0.10)',
    cardShadow: 'rgba(80,60,30,0.22)',
    cell: 'rgba(120,96,60,0.17)',
    cellEdge: 'rgba(120,96,60,0.10)',
    trayPanel: '#e6dac5',
    colors: ['#e0453c', '#2b7fd0', '#3da84e'],
    symbols: ['flame', 'drop', 'leaf'],
    goal: '#d7a332',          // the target bar: the crown's gold, achievement's colour here
    plaqueBg: '#fdf7ea',
    plaqueInk: '#5c5140',
    btnBg: '#328153',
    btnInk: '#fff8f0',
    style: 'card',          // matte card + drop shadow + slight rotation
    grain: true,
  },
  neon: {
    label: 'neon',
    bg: '#000000',
    tray: '#0e1724',
    // On black, anything under ~0.15 alpha simply is not there. The empty
    // states carry the layout — the board grid, the meter track, the tray
    // panel — so they are lifted well clear of the background.
    well: 'rgba(70,160,255,0.14)',
    wellEdge: 'rgba(105,190,255,0.42)',
    ringTrack: 'rgba(120,195,255,0.30)',
    trayEdge: 'rgba(120,195,255,0.22)',
    ink: '#7ff0ff',
    inkSoft: 'rgba(127,240,255,0.5)',
    card: '#06101c',
    cardEdge: 'rgba(105,190,255,0.30)',
    cardShadow: 'rgba(60,150,255,0.18)',
    cell: 'rgba(70,160,255,0.13)',
    cellEdge: 'rgba(105,190,255,0.40)',
    trayPanel: '#0b1523',
    colors: ['#6db8ff', '#ffd23f', '#e8f0ff'],
    symbols: ['moon', 'sun', 'star'],
    goal: '#7ff0ff',          // the HUD's own cyan, glowing like the score above it (gold is the sun meter here)
    plaqueBg: '#0a0f18',
    plaqueInk: '#7ff0ff',
    btnBg: '#65e6a3',
    btnInk: '#04121a',
    style: 'wire',          // glowing outline, dim fill, flood on match
    mono: true,
  },
};

/* v3: painted themes. A theme block may carry `skin`: paint hooks the renderer
   calls instead of its flat defaults (the contract is at "skins" further down).
   Each block is self-contained between its BEGIN and END markers, and a portal
   A/B build keeps exactly one look (scripts/build-poki.mjs). Colour order is the
   same in every theme — 0 red, 1 blue, 2 green — because the opening hand, the
   tutorial and the colour-blind argument all lean on it. */
// Wavedash build: a theme block that is not this build's look was removed here
// Wavedash build: a theme block that is not this build's look was removed here
// Wavedash build: a theme block that is not this build's look was removed here

/* v3.1 (2026-10-09): the default look, "paper", on a dark desk with outlined tiles, and the Halloween copy's reward moments
   dressed in cut paper. The user, after playing the Halloween copy: "i also liked the vfx/fx of halloween theme, like when
   merge, getting merge powerup etc. also colors are contrasting, can we apply some of those to normal version?" The decision:
   keep the cream paper card, put it on a deep dark desk, give every tile a dark ink outline and a stronger red / blue / green.
   The desk was a neutral slate (#1d2331) at first; the user then asked "can we keep bg as dark indigo? or just indigo? for normal
   theme", so it is a dark indigo (#1d2056, hue 237) and every dark of the look (the outline, the inks, the shadows, the scrim) is
   an indigo-black, not a slate or brown-grey.
   This section is applied HERE, after the painted looks above have copied the base paper (they were drawn against its cream
   desk, and a light HUD ink inherited by them would turn their score line pale on a light desk), so garden, glass and honey
   are exactly what they were. The base paper literal at the top stays the base they inherit from; THEMES.paper becomes
   this look. Everything is drawn in code; nothing here reads or changes the rules. */
Object.assign(THEMES.paper, (() => {
  const TAU = Math.PI * 2;
  const INK = '#242850', LINE = '#14153a', LINE_RGB = '20,21,58', CREAM = '#fbf7ee', GOLD = '#ffd04d', GOLD_LINE = 'rgba(150,98,14,0.85)';
  // stronger than the v2 trio, with more spread in lightness (red 0.23, blue 0.17, green 0.30) so the three still part in greyscale
  const COLORS = ['#f43e2a', '#1272d9', '#21ab4a'];
  // confetti tones per colour, lightest first: the pieces fly over the dark indigo desk as well as the cream card, so every tone reads on the desk
  // (contrast 3.5 or more; the blue ladder stops at #2a82e6, a touch lighter than the tile's own blue, because blue on indigo is the close pair)
  const TONES = [['#ff8a76', '#ff5f4a', '#f43e2a'], ['#8cc6fb', '#55a3f0', '#2a82e6'], ['#7fe095', '#49c468', '#21ab4a']];

  // deterministic scatter: the same confetti for the same moment, and never Math.random (the rules own that)
  const rng = seed => () => {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const rnd = rng(20261009);
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));

  // ---- particles: cut paper ----
  // a chip of confetti, a little hexagon tile that flips as it falls, a gold paper star, a gold sparkle, a puff of paper dust
  const P_CHIP = 0, P_HEX = 1, P_STAR = 2, P_MOTE = 3, P_PUFF = 4;
  function puff(x, y, n, shape, o) {
    const s = (typeof S === 'number' && S > 0) ? S : 30;
    for (let i = 0; i < n; i++) {
      const a = o.arc ? -Math.PI / 2 + (rnd() - 0.5) * o.arc : rnd() * TAU, v = (o.v0 + rnd() * o.v1) * 1.4 * s / 1000;
      const ci = o.c === 'any' ? ((rnd() * 3) | 0) : o.c;
      spawnPart({
        x: x + Math.cos(a) * s * (o.r || 0.25) * rnd(), y: y + Math.sin(a) * s * (o.r || 0.25) * rnd(),
        vx: Math.cos(a) * v, vy: Math.sin(a) * v - (o.up || 0) * s / 1000,
        g: (o.g || 0) * s / 1e6, drag: o.drag != null ? o.drag : 0.0013,
        rot: o.upright ? 0 : rnd() * TAU, vr: o.upright ? 0 : (rnd() - 0.5) * (o.spin || 0.009),
        life: o.life * (0.72 + rnd() * 0.56), size: s * o.size * (0.9 + rnd() * 0.5),
        c: ci, shape, ph: rnd() * TAU, tone: o.tone != null ? o.tone : ((rnd() * 3) | 0),
      });
    }
  }
  const hexPts = (g, r) => { g.beginPath(); for (let k = 0; k < 6; k++) { const a = Math.PI / 3 * k; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); };
  const starPts = (g, r, inner) => { g.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + Math.PI / 5 * k, rr = k % 2 ? r * inner : r; g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } g.closePath(); };

  const skin = {
    /* ---------- confetti, hex chips, paper stars and gold for the game's moments ---------- */
    emit(kind, x, y, ci, power) {
      const c = ci >= 0 && ci < 3 ? ci : 'any', P = cl(power || 1, 1, 4), n = k => Math.round(k * (0.7 + P * 0.3));
      if (kind === 'tick') puff(x, y, 3, P_CHIP, { c, v0: 1.6, v1: 2.4, up: 1.6, g: 5, life: 640, size: 0.14 });
      else if (kind === 'place') { puff(x, y, 3, P_PUFF, { c: -2, v0: 0.6, v1: 1.2, r: 0.7, life: 420, size: 0.26, drag: 0.004 }); puff(x, y, 2, P_CHIP, { c, v0: 1.4, v1: 1.4, up: 1.2, g: 5, life: 480, size: 0.12 }); }
      else if (kind === 'deny') puff(x, y, 3, P_PUFF, { c: -2, v0: 0.5, v1: 0.9, g: -1, life: 520, size: 0.24, drag: 0.004 });
      else if (kind === 'over') puff(x, y, 12, P_PUFF, { c: -2, r: 4, v0: 0.2, v1: 0.6, g: 1.2, life: 1800, size: 0.4, drag: 0.002 });
      else if (kind === 'level') {                                    // a scatter from the meter: hex chips and confetti in the colour that levelled (gold for a new best on the score line)
        const lc = ci >= 0 && ci < 3 ? ci : -1;
        puff(x, y, 7, P_HEX, { c: lc, v0: 3, v1: 4.5, up: 2.2, g: 2, life: 1300, size: 0.27, drag: 0.0009, spin: 0.012 });
        puff(x, y, 8, P_CHIP, { c: lc, v0: 2, v1: 3, up: 2, g: 4, life: 950, size: 0.15 });
      } else if (kind === 'goal') {                                   // a target: three big paper stars rise, gold and confetti everywhere
        puff(x, y, 1, P_STAR, { c: -1, r: 0.3, v0: 0.2, v1: 0.2, up: 3.4, g: -0.4, life: 2600, size: 1.05, upright: true, drag: 0.0004 });
        puff(x - 30, y + 10, 1, P_STAR, { c: -1, r: 0.3, v0: 0.2, v1: 0.2, up: 2.6, g: -0.3, life: 2300, size: 0.62, upright: true, drag: 0.0004 });
        puff(x + 34, y + 14, 1, P_STAR, { c: -1, r: 0.3, v0: 0.2, v1: 0.2, up: 2.9, g: -0.3, life: 2400, size: 0.56, upright: true, drag: 0.0004 });
        puff(x, y, 34, P_MOTE, { c: -1, r: 1.4, v0: 3, v1: 10, up: 3.2, g: 5, life: 1500, size: 0.16 });
        puff(x, y, 18, P_CHIP, { c: 'any', r: 1, v0: 3, v1: 9, up: 4, g: 6, life: 1500, size: 0.17 });
      } else if (kind === 'tier1') puff(x, y, n(7), P_CHIP, { c, v0: 2, v1: 2.6, up: 2, g: 5, life: 760, size: 0.15 });
      else if (kind === 'tier2') {
        puff(x, y, n(13), P_CHIP, { c, v0: 2.4, v1: 3.4, up: 2.6, g: 5, life: 960, size: 0.18 });
        puff(x, y, n(5), P_MOTE, { c: -1, v0: 2, v1: 3.4, up: 2.4, g: 4, life: 900, size: 0.14 });
      } else if (kind === 'tier3') {                                  // the big one: tiles in the group's own colour tumble out of it
        puff(x, y, n(16), P_HEX, { c, r: 0.6, v0: 3, v1: 5.5, up: 3.2, g: 6, life: 1400, size: 0.25, spin: 0.014 });
        puff(x, y, n(18), P_CHIP, { c, r: 0.6, v0: 3, v1: 7, up: 3.6, g: 5, life: 1300, size: 0.27 });
        puff(x, y, n(8), P_MOTE, { c: -1, v0: 2.4, v1: 5, up: 3, g: 3, life: 1200, size: 0.18 });
      } else if (kind === 'mergeDone') {                              // the merge swallowed its last tile: a punch in the merged colour
        puff(x, y, 8, P_HEX, { c, r: 0.5, v0: 1.2, v1: 2.4, up: 2.8, g: 3, life: 1000, size: 0.2, spin: 0.012 });
        puff(x, y, 8, P_CHIP, { c, v0: 2, v1: 3, up: 1.6, g: 4, life: 800, size: 0.15 });
        puff(x, y, 4, P_MOTE, { c: -1, v0: 1.4, v1: 2.4, up: 2, g: 3, life: 800, size: 0.14 });
      } else if (kind === 'reward') puff(x, y, 8, P_MOTE, { c: -1, v0: 1.6, v1: 3, up: 1.4, g: 2, life: 850, size: 0.15 });
      else if (kind === 'best') {
        puff(x, y, 18, P_MOTE, { c: -1, r: 0.8, v0: 2.4, v1: 5, up: 2.6, g: 3, life: 1300, size: 0.17 });
        puff(x, y, 6, P_CHIP, { c: 'any', v0: 2, v1: 3.4, up: 2.6, g: 5, life: 1200, size: 0.17 });
      }
    },
    particle(g, p, k) {
      const z = p.size * (0.6 + 0.4 * Math.min(1, k / 0.1));
      const fade = k > 0.6 ? Math.max(0, (1 - k) / 0.4) : 1;
      const ci = p.c >= 0 && p.c < 3 ? p.c : -1, tone = ((p.tone | 0) % 3 + 3) % 3;
      g.globalAlpha = fade;
      g.lineJoin = 'round';
      if (p.shape === P_CHIP) {                                       // cut-paper confetti: a small card that flips as it flutters
        g.scale(1, 0.3 + 0.7 * Math.abs(Math.cos(p.age * 0.011 + (p.ph || 0))));
        g.beginPath(); g.rect(-z * 1.05, -z * 0.65, z * 2.1, z * 1.3);
        g.fillStyle = ci >= 0 ? TONES[ci][tone] : GOLD; g.fill();
        g.strokeStyle = 'rgba(' + LINE_RGB + ',0.75)'; g.lineWidth = Math.max(0.8, z * 0.24); g.stroke();
      } else if (p.shape === P_HEX) {                                 // a little tile, outlined like the real ones, turning over as it goes
        g.scale(0.45 + 0.55 * Math.abs(Math.cos(p.age * 0.008 + (p.ph || 0))), 1);
        hexPts(g, z * 1.15);
        g.fillStyle = ci >= 0 ? TONES[ci][2] : GOLD; g.fill();
        g.strokeStyle = LINE; g.lineWidth = Math.max(0.9, z * 0.3); g.stroke();
        hexPts(g, z * 0.5);
        g.fillStyle = 'rgba(255,248,240,0.92)'; g.fill();
      } else if (p.shape === P_STAR) {                                // a paper star rising, swaying a little
        g.translate(Math.sin(p.age * 0.004 + (p.ph || 0)) * z * 0.28, 0);
        g.globalAlpha = fade * Math.min(1, k / 0.08);
        starPts(g, z * 1.1, 0.48);
        g.fillStyle = GOLD; g.fill();
        g.strokeStyle = LINE; g.lineWidth = Math.max(1, z * 0.13); g.stroke();
        starPts(g, z * 0.5, 0.48);
        g.fillStyle = 'rgba(255,250,224,0.85)'; g.fill();
      } else if (p.shape === P_MOTE) {                                // a gold sparkle with a pale heart
        const tw = 0.55 + 0.45 * Math.abs(Math.sin(p.age * 0.012 + (p.ph || 0))), a = z * 1.7 * tw, b = a * 0.3;
        g.beginPath(); g.moveTo(0, -a); g.lineTo(b, -b); g.lineTo(a, 0); g.lineTo(b, b); g.lineTo(0, a); g.lineTo(-b, b); g.lineTo(-a, 0); g.lineTo(-b, -b); g.closePath();
        g.fillStyle = GOLD; g.fill();
        g.strokeStyle = GOLD_LINE; g.lineWidth = Math.max(0.6, z * 0.14); g.stroke();
        g.beginPath(); g.arc(0, 0, z * 0.35, 0, TAU); g.fillStyle = '#fff8dc'; g.fill();
      } else if (p.shape === P_PUFF) {                                // paper dust, soft and grey; the sad grey one at game over
        g.globalAlpha = fade * 0.55 * (1 - k * 0.6);
        g.beginPath(); g.arc(0, 0, z * (0.6 + 0.9 * k), 0, TAU); g.fillStyle = '#a49c8c'; g.fill();
      }
    },
  };

  return {
    // the dark indigo desk, and everything that is drawn straight on it
    bg: '#1d2056',
    well: 'rgba(246,239,224,0.12)',
    wellEdge: 'rgba(246,239,224,0.34)',
    ringTrack: 'rgba(246,239,224,0.26)',            // the target bar's track: on a dark desk anything under ~0.15 alpha is not there
    trayEdge: 'rgba(246,239,224,0.28)',
    hudInk: '#f7f0e1',                              // the score line and the meter captions sit on the desk, not on the card
    hudInkSoft: 'rgba(247,240,225,0.74)',
    // the card, the tray and the plaques stay cream; the ink is an indigo-black so it sits with the desk
    ink: INK,
    inkSoft: 'rgba(36,40,80,0.78)',
    cardShadow: 'rgba(4,5,30,0.62)',
    cell: 'rgba(120,96,60,0.2)',
    cellEdge: 'rgba(36,40,80,0.24)',
    // tiles: a dark ink outline (a tenth of a tile) and a stronger red / blue / green
    colors: COLORS,
    tileOutline: LINE,
    tileOutlineW: 0.1,
    popInk: '#fffaf0',                              // the flying +1 labels cross the desk and the card: cream with the colour as its rim reads on both
    // what rides the card's edge over the desk: the tool chips (opaque plates), the count pips and the level badges (a light rim)
    chipFill: CREAM,
    chipRest: '#d8cfbd',
    badgeRim: CREAM,
    chipInk: '#f6efe0',
    plaqueInk: '#2a2d58',
    plaqueEdge: LINE,
    // the page chrome: plaques lift off a dark scrim; the primary button and the menu logo are outlined like the tiles;
    // the game-over icon is a blue tile with a worried face (no letters); the tear drips unless the player asks for calm
    css: '.overlay{background:rgba(10,11,40,.62)}' +
      '.plaque{box-shadow:0 18px 44px rgba(4,5,30,.6)}' +
      '.btn:not(.secondary){border:2px solid ' + LINE + ';box-shadow:0 5px 0 ' + LINE + ',0 10px 16px rgba(4,5,30,.34)}' +
      '.btn.secondary{box-shadow:0 4px 0 rgba(' + LINE_RGB + ',.55)}' +
      '.menuArt path{stroke:' + LINE + ';stroke-width:3}' +
      '.bigTitle svg g:first-child path:first-child{fill:#1272d9;stroke:' + LINE + ';stroke-width:1.8;stroke-linejoin:round}' +
      '.bigTitle svg g:first-child path:last-child{display:none}' +
      '.bigTitle .sadFace{display:inline;color:#fbf7ee}' +
      '.bigTitle .sadFace .tear{animation:tearDrip 2.4s ease-in infinite}' +
      '@keyframes tearDrip{0%{opacity:0;transform:translateY(-.7px)}16%{opacity:1;transform:translateY(0)}74%{opacity:1;transform:translateY(2.2px)}100%{opacity:0;transform:translateY(3.2px)}}' +
      '@media (prefers-reduced-motion:reduce){.bigTitle .sadFace .tear{animation:none}}' +
      '@media (min-height:501px){.bigTitle svg{width:64px;height:64px}}',
    skin,
  };
})());


/* v3: a portal A/B build sets one theme name here. Locked, the game shows that
   look only: no theme chip, no T key, no ?theme and no stored choice. */
const THEME_LOCK = 'paper';
/* v3: developer URL hooks (?demo, ?state, ?tools, ?drag, ?fx). A portal build
   sets this false, so a published game carries no development tools. */
const DEV = false;

/* The theme chip used to read "PAPER" / "NEON". It now shows the CURRENT
   theme as a mark — sun for the day dress, moon for the night one — keeping
   the old semantics (what you are in, not what you would switch to) while
   dropping the last word from the chrome. Declared here, beside THEMES, so it
   exists before applyTheme() runs at startup: a const referenced from a
   startup path but declared below it throws on its temporal dead zone and
   takes the rest of the script with it. */
const THEME_ICONS = {
  paper: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.4"/>' +
    '<path d="M12 1.7v3M12 19.3v3M22.3 12h-3M4.7 12h-3M19.3 4.7l-2.1 2.1M6.8 17.2l-2.1 2.1' +
    'M19.3 19.3l-2.1-2.1M6.8 6.8L4.7 4.7" stroke="currentColor" stroke-width="1.9" ' +
    'stroke-linecap="round" fill="none"/></svg>',
  neon: '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M20.6 14.7A8.9 8.9 0 0 1 9.3 3.4a8.9 8.9 0 1 0 11.3 11.3z"/></svg>',
};

let themeName = 'paper';        // day theme is the first thing a new player sees
if (THEME_LOCK && Object.prototype.hasOwnProperty.call(THEMES, THEME_LOCK)) themeName = THEME_LOCK;
else {
  try {
    const saved = localStorage.getItem('scraps-theme');
    if (saved && THEMES[saved]) themeName = saved;
  } catch (e) {}
}
let T = THEMES[themeName];

// reduced motion: damp (not remove) positional shake/burst/overshoot amplitude
let REDUCED = false;
try { REDUCED = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
const MOTION = REDUCED ? 0.32 : 1;

// ---------- hex board ----------
const R = 4;                                  // board radius: 61 cells
const SQ3 = Math.sqrt(3);
const DIRS = [[1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, -1]];
const key = (q, r) => q + ',' + r;

function boardCells(radius) {
  const out = [];
  for (let q = -radius; q <= radius; q++)
    for (let r = -radius; r <= radius; r++)
      if (Math.abs(q + r) <= radius) out.push([q, r]);
  return out;
}
const CELLS = boardCells(R);
const CELLSET = new Set(CELLS.map(([q, r]) => key(q, r)));

/* Flat-top orientation. With pointy-top tiles a hex-shaped board has a flat
   top edge several cells wide; with flat-top tiles the board itself comes to a
   vertex, so exactly one cell sits at the apex. Neighbour offsets (DIRS) are
   unchanged — this is purely how axial coords map to pixels. */
function hexToPixel(q, r, s) { return [s * 1.5 * q, s * SQ3 * (r + q / 2)]; }
function pixelToHex(x, y, s) {
  const qf = (2 / 3 * x) / s;
  const rf = (-x / 3 + SQ3 / 3 * y) / s;
  const sf = -qf - rf;
  let q = Math.round(qf), r = Math.round(rf), c = Math.round(sf);
  const dq = Math.abs(q - qf), dr = Math.abs(r - rf), dc = Math.abs(c - sf);
  if (dq > dr && dq > dc) q = -r - c;
  else if (dr > dc) r = -q - c;
  return [q, r];
}

// ---------- pieces ----------
// connected hex shapes; no rotation (pieces come as they are, like the ref)
const SHAPES = [
  [[0, 0]],
  [[0, 0], [1, 0]], [[0, 0], [0, 1]], [[0, 0], [-1, 1]],
  [[0, 0], [1, 0], [2, 0]], [[0, 0], [0, 1], [0, 2]], [[0, 0], [-1, 1], [-2, 2]],
  [[0, 0], [1, 0], [0, 1]], [[0, 0], [1, 0], [1, -1]], [[0, 0], [0, 1], [-1, 1]],
  [[0, 0], [1, 0], [-1, 1]],
];

// ---------- run state ----------
let board = new Map();     // key -> {q, r, c, shake, born}
let tray = [];             // [{cells:[{dq,dr,c}]} | null] x3
let score = 0, best = 0, placedCount = 0;
// each colour keeps its own meter: fill it and that colour levels up, with
// the next level costing more than the last (levelTarget below: 20, 40 ... 240, then 40 more each, then 50 more each)
let colourLevel = [1, 1, 1];
let colourFill = [0, 0, 0];
let colourFlash = [0, 0, 0];   // level-up celebration (big, slow decay)
let colourTick = [0, 0, 0];    // per-payout ring bump (small, fast decay)
let levelUps = 0;              // level-ups so far this run, for the lvl1/lvl2 events
/* The level targets, per colour: what one meter must fill to level up. The user's rule (2026-10-09, after corrections: "after 200 ... 50",
   then "at 240 it should grow by 30", "40*", "and at 400+ it should grow by 50"): the step is 20 up to a target of 240 (levels 1-12: 20, 40 ...
   240), then 40 (levels 13-16: 280, 320, 360, 400), then 50 from 400 on (levels 17 and up: 450, 500, 550 ...). levelTarget(1) is 20.
   A PROTECTED scoring value (progression / difficulty, not juice): it was level * 20 until then, and changes only on the user's word. */
function levelTarget(level) {
  if (level <= 12) return level * 20;              // 20, 40 ... 240
  if (level <= 16) return 240 + (level - 12) * 40; // 280, 320, 360, 400
  return 400 + (level - 16) * 50;                  // 450, 500, 550 ...
}
let state = 'menu';        // 'menu' | 'playing' | 'over'
let pops = [];             // score labels flying to their colour meter
let mergeAnim = [];        // tiles being swallowed by a merge powerup
const MERGE_STAGGER = 55;  // ms between each tile launching
const MERGE_FLIGHT = 300;  // ms for one tile's flight
// first-run demo (v2): steps 0-2 are guided placements (one per opening slot),
// step 3 (HINT_MERGE_STEP) hands out a free merge and guides it onto the group
// the player just built — the survival skill, pulled within the first ~20 s
let hintOn = false;
let hintStep = 0;
let hintClock = 0;
let tutMergeSlot = -1;     // the tray slot holding (or held for) the tutorial's free merge
let tutMergePending = false;   // held slot waiting for the third payout to land
/* v2 (Q1, M3): the colour-swap lesson. v1 made it the tutorial's last step and
   waited for a tap that about half of players never made — pulsing until game
   over and, because the merge lesson deferred to it, hiding the merge lesson
   for the whole run. It is now a contextual hint (maybeSwapHint): at most once
   a run, only until the player has swapped once, and it retires by itself after
   SWAP_HINT_PLACES more placements or SWAP_HINT_MS on screen, whichever comes
   first. Retiring is silent: 'switch' fires only on a real tap. */
const SWAP_HINT_PLACES = 3, SWAP_HINT_MS = 8000;
let swapHintOn = false;    // the swap hint is up
let swapHintDone = false;  // it has had its one showing this run
let swapLearned = false;   // the player has swapped colours at least once
let switchSent = false;    // 'switch' fired this run (on the first real tap)
let tapStepPlaced = 0;     // placements made while the swap hint was up
let tapStepShown = 0;      // ms the swap hint has actually been on screen
let scorePulse = 0;        // score counter bump on each payout tick
/* THE DISPLAYED score lags the logic score (user 2026-09-01): a payout settles
   score/colourFill immediately — rules, level-ups and anyMoveLeft never wait on
   an animation — but the NUMBERS the player reads only advance when that
   payout's flying label lands on its meter. Same split as the merge counter's
   vShow. scoreShow/fillShow/levelShow are display-only; never read by rules. */
let scoreShow = 0;
let fillShow = [0, 0, 0];
let levelShow = [1, 1, 1];
/* The target bar (user 2026-09-26): a visible goal on top of the score. Every
   TARGET_STEP points is a target, and reaching one rolls the target on, so
   there is always a goal in view: 5,000, then 10,000, 15,000 ... The bar shows
   the current segment (score − the last target reached, over TARGET_STEP) and
   its label reads "score / next target". Same split as everything else in the
   HUD: goalsReached is LOGIC, settled wherever score grows (the goal1–goal3
   events fire there, like lvl1/lvl2); everything the player SEES follows
   scoreShow — goalShow is the displayed count, goalFill the drawn fill (an
   ease-out tween toward the displayed fraction), and the celebration fires
   when the DISPLAYED score crosses. Per run, never persisted. */
const TARGET_STEP = 5000;
const GOAL_EVENTS = 3;            // goal1..goal3: the first three targets reached in a run
const GOAL_TWEEN_MS = 250;        // the fill's ease-out toward the displayed value
const GOAL_HOLD_MS = 420;         // the full bar is held (flash, burst, chime) before it rolls on
let goalsReached = 0;             // logic: targets reached this run
let goalShow = 0;                 // display: targets the displayed score has reached
let goalFill = 0;                 // display: the drawn fill, 0..1
let goalTween = null;             // {from, to, t}: the ease-out in flight, or null
let goalPulse = 0;                // tiny bump on each increase (never under REDUCED)
let goalFlash = 0;                // the crossing's bright flash, 1 → 0
let goalHold = 0;                 // ms the full bar is still held after a crossing
/* Logic side: called wherever score grows; a single payout may cross more
   than one target. Each target reached earns ONE free merge powerup (user
   2026-09-26, "just 1"), granted here — at the tick, like a level-up's — so
   anyMoveLeft and the game-over re-check see it at once; `prefer` is a slot
   known to be empty (a merge's own). The beam that delivers it flies from the
   target bar when the DISPLAYED score crosses (celebrateGoal). */
function checkGoals(prefer) {
  while (score >= bridgeGoalTarget(goalsReached + 1)) {
    goalsReached++;
    // v3: an undone and replayed crossing must not announce itself twice (goalsHigh is never rolled back)
    const first = goalsReached > goalsHigh;
    if (first) {
      goalsHigh = goalsReached;
      if (goalsReached <= GOAL_EVENTS) gameEvent('goal' + goalsReached);
    }
    goalTools(first);
    grantGoalReward(prefer);
  }
}
/* The reward's colour: the one whose best merge is worth the most right now
   (mergeHint's value, the same measure the lesson uses), ties broken by tiles
   on the board, then by index — so the reward is the most useful powerup the
   board can take. An empty board gets colour 0. */
function goalRewardColour() {
  const n = T.colors.length;
  const counts = new Array(n).fill(0);
  for (const t of board.values()) if (t.c >= 0 && t.c < n) counts[t.c]++;
  let best = 0, bestVal = -1, bestCount = -1;
  for (let c = 0; c < n; c++) {
    const t = mergeHint(c);
    const val = t ? mergeGroupAt(t[0], t[1], c).reduce((s, m) => s + (m.v || 1), 0) : 0;
    if (val > bestVal || (val === bestVal && counts[c] > bestCount)) { best = c; bestVal = val; bestCount = counts[c]; }
  }
  return best;
}
/* One powerup per target, through the level-up's own grant: deferred (hidden
   until its beam lands), into an empty slot — the one place() held for this
   crossing, or `prefer` — and otherwise owed to the next refill; the mercy rule
   inside grantMerge applies unchanged. The pending grant is tagged so a
   level-up crossing of the same colour cannot take its beam. */
function grantGoalReward(prefer) {
  const ci = goalRewardColour();
  const slot = grantMerge(ci, true, prefer);
  if (slot === -1) return -1;
  const pg = pendingGrants.find(p => p.slot === slot);
  if (pg) pg.goal = true;
  return slot;
}
// the displayed fill of the current segment, 0..1
function goalFrac() {
  const f = (scoreShow - bridgeGoalTarget(goalShow)) / (bridgeGoalTarget(goalShow + 1) - bridgeGoalTarget(goalShow));
  return Math.max(0, Math.min(1, f));
}
// digits with thousands separators, and nothing else — the label stays wordless
function fmtNum(n) { return String(Math.max(0, Math.floor(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
/* "score / next target" — while the full bar is held after a crossing it reads
   "5,000 / 5,000", the target just hit, and rolls to "5,000 / 10,000" with the bar. */
function goalLabel() {
  const target = bridgeGoalTarget(goalHold > 0 ? goalShow : goalShow + 1);
  return fmtNum(scoreShow) + ' / ' + fmtNum(target);
}
// display side: the displayed score has just crossed a target
function celebrateGoal() {
  goalFill = 1; goalTween = null;
  goalHold = GOAL_HOLD_MS;
  goalFlash = 1;
  const b = goalBarRect();
  spawnBurst(b.cx, b.cy, -3, 'goal');
  sfx.goal();
  // the target's reward: its beam leaves from the bar, so the goal is seen paying out
  const gi = pendingGrants.findIndex(pg => pg.goal);
  if (gi !== -1) { const pg = pendingGrants.splice(gi, 1)[0]; spawnBeam(pg.ci, pg.slot, [b.cx, b.cy]); }
  fxGoal(b, goalShow);             // v3: the board-wide moment, and the tool charges flying to their buttons
}
/* Level-up grant beam: when the DISPLAYED bar crosses, an energy streak flies
   from that colour's ring to the tray slot where the powerup materialises —
   the powerup was granted logically at payout (anyMoveLeft stays honest), but
   it is hidden until the beam delivers it. */
let beams = [];
let pendingGrants = [];    // {ci, slot} granted logically, awaiting the display crossing
/* Merge-powerup tutorial (user 2026-09-01): the first TWO deliveries per run
   get the same wordless dot-and-dotted-trail lesson as the opening steps —
   from the powerup's slot to the legal cell whose merge yields the most value.
   Cleared the moment the player picks the powerup up; per-run, like the
   opening tutorial (mergeHintUsed resets in newGame). */
let mergeHintSlot = -1;
let mergeHintUsed = 0;       // lessons actually DRAWN this run (v2: not merely armed)
let mergeHintSeen = false;   // has the armed lesson been drawn yet?
let mergeHintClock = 0;
let mergeHintCache = null;   // {placed, t} — recomputed when the board changes
const BEAM_MS = 525;   // 420 * 1.25 — user asked for a 25% slower delivery (2026-09-01)
function spawnBeam(ci, slot, from) {
  // v2: from the reward badge the meter pays out; a goal reward flies from the target bar instead
  const [sx, sy] = from || hudRewardPos(ci);
  const [tx, ty] = traySlotPos(slot);
  beams.push({ sx, sy, tx, ty, c: ci, slot, t: 0 });
}
// scoring is a ripple, not a lump: the group shakes, then each tile pays out
// a +1 in turn, outward from where the piece landed.
let tally = [];            // [{tile, at}] queued payouts
let shakeQueue = [];       // [{tile, at}] the travelling shake, one step ahead
let failShake = 0;         // whole-board jolt when there is no room left
let tapFlash = [0, 0, 0];  // brief pop when a tray piece is tapped
let rotAnim = [null, null, null];   // colours mid-swing after a tap
const ROT_MS = 260;
let tallyClock = 0;
let pendingOver = false;
const GAMEOVER_HOLD = 1100;   // ms the board is held, dead pieces marked, before NO ROOM lands
let overAt = 0;            // when the NO ROOM plaque should land
const SHAKE_MS = 260, TALLY_STEP = 85, SHAKE_LEAD = 190;

// fixed-size pool of short-lived ring bursts (payout ticks, placement thunk,
// level-up, rejected drops) — no per-frame growth, slots are recycled.
const MAX_BURSTS = 24;
const bursts = Array.from({ length: MAX_BURSTS }, () => ({ active: false, x: 0, y: 0, c: 0, kind: '', age: 0, dur: 1 }));
const BURST_DUR = { tick: 260, place: 180, level: 560, deny: 220, over: 900, goal: 720,
  // v3 reward feedback: a group finished paying (by tier), a merge landed, a charge or powerup arrived,
  // a new best; 'combo' and 'fete' are plain rings no theme dresses (a multi-group finale, the target's board rings)
  tier1: 320, tier2: 460, tier3: 640, mergeDone: 480, reward: 380, best: 620, combo: 520, fete: 680 };
function spawnBurst(x, y, c, kind, power) {
  let slot = null;
  for (const b of bursts) if (!b.active) { slot = b; break; }
  if (!slot) slot = bursts[0];               // pool full: recycle the oldest slot
  slot.active = true; slot.x = x; slot.y = y; slot.c = c; slot.kind = kind;
  slot.age = 0; slot.dur = BURST_DUR[kind] || 240;
  themeFx(kind, x, y, c, power || 1);        // v3: a painted theme dresses the same moment in its own particles
}

/* ---------- v3: reward feedback ("juice") ----------
   Poki on v2: "player feedback could be improved a little so it feels more
   rewarding to succeed and do good matches." Everything in this block is
   DISPLAY ONLY: it reads the rules' state and never writes it, draws no random
   number from Math.random (fxRand is its own little generator, so a seeded run
   deals the same pieces with the feedback on or off), and never gates input.
   setJuice(false) switches the whole layer off; the suite plays the same
   scripted game both ways and compares every rule field.

   What fires when (one function per moment):
     fxPlaced          a piece landed: squash-and-settle, same-colour neighbours
                       nudge toward it, a thud scaled by the piece's size
     groupPaid         a group's last tile paid: by its total (TIER_MIN) a "+N"
                       callout at the group's centre, a rising chord, a ring,
                       themeFx('tier1'|'tier2'|'tier3'), a board kick, a buzz.
                       The 2nd and 3rd group of one placement step up in pitch,
                       size and power, a beat apart, the last one the biggest.
     fxMergeDone       a merge swallowed its last tile: themeFx('mergeDone')
     fxLevelShown      the DISPLAYED meter crossed: the meter's own flash, and
                       the swap charge it earned flies to the swap button
     fxGoal            the DISPLAYED score crossed a target: the big one
     fxBest            the displayed score passed the stored best: once a run
     toolArrive        a tool charge arrived at its button: themeFx('reward')
     fxToolUsed / fxToolEmpty / toolDenied   the tools' own small sounds
   clearJuice() empties every queue here; newGame, continueRun and an undo call it. */
let JUICE = true;
function setJuice(on) { JUICE = !!on; if (!JUICE) clearJuice(); }

/* Payout tiers, by the TOTAL a finished group paid. Measured with seeded bots
   (60 runs a row, runs capped at 130 placements; the README has the table):
   10 is a group a player is glad of, and fires on about four placements in ten
   in the first forty; 45 is a big one (about 1 placement in 12 by 80 placements,
   none before ~40 in play); 100 is huge and rare (a typical bot: 0.8 a run of
   130 placements, none in the first 80; an expert bot: 2). Under TIER_MIN[0] a
   lone group gets only its per-tile labels. */
const TIER_MIN = [10, 45, 100];
function payoutTier(v) { return v >= TIER_MIN[2] ? 3 : v >= TIER_MIN[1] ? 2 : v >= TIER_MIN[0] ? 1 : 0; }

// the layer's own random numbers: decoration must never take a draw from the dealer
let fxSeed = 0x2f6e2b1;
function fxRand() { fxSeed = (Math.imul(fxSeed, 1664525) + 1013904223) >>> 0; return fxSeed / 4294967296; }

/* Haptics: a short buzz where the device has one. Feature-detected, inside
   try/catch (iOS Safari has no navigator.vibrate; Chrome refuses it before the
   first tap and in some frames), and off when muted or under reduced motion. */
function buzz(pattern) {
  if (!JUICE || muted || REDUCED || !pattern) return false;
  try {
    if (typeof navigator === 'undefined' || !navigator || typeof navigator.vibrate !== 'function') return false;
    return navigator.vibrate(pattern) !== false;
  } catch (e) { return false; }
}

/* The board kick: placed tiles hop once and settle. One vertical bounce, fast —
   deliberately unlike the slow sideways jolt of "no room" (failShake). Never
   under reduced motion; only the tiles move, never the hand or the piece held. */
const KICK_MS = 260, KICK_MAX = 7;
let kickAmp = 0, kickT = 0;
function kickBoard(px) {
  if (!JUICE || REDUCED || !(px > 0)) return;
  const left = kickAmp * (1 - Math.min(1, kickT / KICK_MS));
  kickAmp = Math.min(KICK_MAX, Math.max(left, px));
  kickT = 0;
}
function boardKickY() {
  if (kickAmp <= 0 || failShake > 0) return 0;      // "no room" has the board to itself: its jolt is the other language
  const k = Math.min(1, kickT / KICK_MS);
  return -kickAmp * Math.sin(k * Math.PI * 2.5) * (1 - k) * (1 - k);
}

/* Default sparks for the flat looks (paper, neon): plain dots from the shared
   particle pool. A painted theme spawns its own from emit(), so these stay out. */
function fxSparks(x, y, ci, n, speed, tint) {
  if (!JUICE || REDUCED || (T.skin && T.skin.emit)) return;
  const u = Math.max(0.6, S / 26);
  for (let i = 0; i < n; i++) {
    const a = (i + fxRand() * 0.8) / n * Math.PI * 2, v = speed * (0.55 + fxRand() * 0.7) * u;
    spawnPart({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 0.05 * u, g: 0.0005 * u, drag: 0.0022,
      life: 420 + fxRand() * 320, size: (2.4 + fxRand() * 2.2) * u, c: ci, tint: tint || null });
  }
}

/* A group in the payout queue: place() makes one per scoring group and tags the
   group's tally entries with it, so the tick that pays its last tile knows the
   group is done and what it paid in all. Display bookkeeping only. */
function juiceGroup(g, idx, of) {
  let x = 0, y = 0;
  for (const m of g) { const [px, py] = boardPix(m.q, m.r); x += px; y += py; }
  return { c: g[0].c, left: g.length, paid: 0, ticks: 0, idx, of, x: x / g.length, y: y / g.length };
}
// one tally entry of the group has had its turn (worth 0: the tile had left the board)
function groupTick(grp, worth) {
  if (!grp) return;
  grp.paid += worth;
  if (--grp.left !== 0) return;               // exactly once: the tick that closes the group
  if (grp.paid > 0) groupPaid(grp);
}

/* Callouts: the group's total, big, in its colour, at its centre — it pops in,
   holds and lifts away. Numbers and a plus sign only. A bounded list; a callout
   waits its turn (CALLOUT_GAP) so two groups finishing together are each read. */
const MAX_CALLOUTS = 6, CALLOUT_GAP = 240, CALLOUT_WAIT_MAX = 720;
const CALLOUT_IN = 140, CALLOUT_OUT = 300;
const CALLOUT_HOLD = [380, 460, 640, 820, 1000];       // ms held, by tier (4 = a target reached)
const CALLOUT_SIZE = [0.82, 1.0, 1.4, 1.8, 2.2];       // in cells, by tier
let callouts = [];            // {x, y, n, c, tier, idx, of, plus, wait, t, fired}
let calloutGate = 0;          // ms until the next callout may appear
function calloutText(c) { return (c.plus ? '+' : '') + fmtNum(c.n); }
function calloutLife(c) { return CALLOUT_IN + CALLOUT_HOLD[c.tier] + CALLOUT_OUT; }
// the last group of a multi-group placement is the finale: the biggest of them
function calloutScale(c) { return (1 + 0.1 * Math.min(2, c.idx)) * (c.of > 1 && c.idx === c.of - 1 ? 1.08 : 1); }
// a callout's box, estimated (digits are about 0.6 em wide): enough to keep two of them apart
function calloutBox(c) {
  const size = S * CALLOUT_SIZE[c.tier] * calloutScale(c);
  return [calloutText(c).length * size * 0.6, size * (c.of > 1 ? 1.35 : 1.1)];
}
function pushCallout(x, y, n, ci, tier, idx, of, plus) {
  const wait = Math.min(CALLOUT_WAIT_MAX, calloutGate);
  calloutGate = wait + CALLOUT_GAP;
  const c = { x, y, n, c: ci, tier, idx, of, plus: plus !== false, wait, t: 0, fired: false };
  const [w, h] = calloutBox(c);
  // inside the board's card: never over the HUD column, the tray column or the score line beside it
  const lo = BX - CARD_HW * S + w / 2, hi = BX + CARD_HW * S - w / 2;
  c.x = lo < hi ? clamp(x, lo, hi) : BX;
  // keep clear of a callout that is still up nearby: step above it, or below when that is nearer the group
  for (const o of callouts) {
    if (o.fired && o.t >= calloutLife(o) - CALLOUT_OUT) continue;
    const [ow, oh] = calloutBox(o);
    if (Math.abs(o.x - c.x) >= (w + ow) / 2 || Math.abs(o.y - c.y) >= (h + oh) / 2) continue;
    c.y = c.y <= o.y ? o.y - (h + oh) / 2 : o.y + (h + oh) / 2;
  }
  // ...and clear of the card's apex and foot (room for the half cell it rises), so a callout never reaches the meters above or the tray below
  c.y = clamp(c.y, BY - CARD_K * S + h / 2 + S * 0.5, BY + CARD_K * S - h / 2);
  if (callouts.length >= MAX_CALLOUTS) callouts.shift();
  callouts.push(c);
  return c;
}
function groupPaid(grp) {
  if (!JUICE) return;
  const tier = payoutTier(grp.paid);
  if (tier === 0 && grp.of < 2) return;                 // a small lone group: its per-tile labels are enough
  const c = pushCallout(grp.x, grp.y, grp.paid, grp.c, tier, grp.idx, grp.of, true);
  if (c.wait <= 0) fireCallout(c);
}
// the callout appears: this is the moment its sound, ring, particles, kick and buzz go off
function fireCallout(c) {
  c.fired = true; c.wait = 0; c.t = 0;
  if (c.tier > 3) return;                               // a target's number: fxGoal has already made the noise
  const step = Math.min(2, c.idx);
  sfx.tier(c.tier, step);
  if (c.tier > 0) {
    spawnBurst(c.x, c.y, c.c, 'tier' + c.tier, 1 + step);     // exactly one themeFx('tierN') per finished group
    fxSparks(c.x, c.y, c.c, [0, 0, 9, 16][c.tier] + step * 3, 0.16 + c.tier * 0.04);
  }
  if (c.of > 1 && c.idx === c.of - 1) spawnBurst(c.x, c.y, c.c, 'combo');
  kickBoard([0, 0, 2.5, 5][c.tier] + (c.tier > 0 ? step : 0));
  buzz(c.tier === 3 ? [24, 40, 34] : [0, 10, 18][c.tier] || (step ? 8 : 0));
}

// ---- a piece landed ----
const LAND_MS = 170, NUDGE_MS = 160;
const DIR_UNIT = DIRS.map(([dq, dr]) => { const [x, y] = hexToPixel(dq, dr, 1); const l = Math.hypot(x, y) || 1; return [x / l, y / l]; });
function fxPlaced(placed) {
  if (!JUICE) return;
  for (const t of placed) t.land = 1;
  // same-colour neighbours lean toward the newcomer, and back
  for (const t of placed) {
    for (let d = 0; d < DIRS.length; d++) {
      const n = board.get(key(t.q + DIRS[d][0], t.r + DIRS[d][1]));
      if (!n || n.c !== t.c || n.land > 0 || n.nudge > 0) continue;
      n.nudge = 1; n.nx = -DIR_UNIT[d][0]; n.ny = -DIR_UNIT[d][1];
    }
  }
  sfx.land(placed.length);
  buzz(8);
}

// ---- a merge swallowed its last tile: the valued tile lands with weight ----
function fxMergeDone(tile, x, y, ci, total) {
  if (!JUICE) return;
  const tier = payoutTier(total);
  if (tile) { tile.born = 1; tile.punch = 1.3; tile.shake = 0; }
  spawnBurst(x, y, ci, 'mergeDone', 1 + tier);
  fxSparks(x, y, ci, 8 + tier * 3, 0.18 + tier * 0.03);
  sfx.mergeDone(tier);
  kickBoard(2 + tier);
  buzz(16);
}

/* Charges in flight. A charge earned through play is granted at the payout tick
   (the rules never wait), but the player sees it ARRIVE: when the displayed
   meter or target crosses, a gold spark flies from there to the tool's button,
   and only its landing pops the button (toolArrive). Until then the button's
   pip shows the count without it (toolInFlight). A charge granted with no
   crossing still to come — an ad, a direct call — arrives at once. */
const CHARGE_MS = 560, PENDING_MAX_MS = 2600;
let toolPending = [];         // [{kind, why, age}] granted, waiting for the display to cross
let chargeBeams = [];         // [{kind, sx, sy, tx, ty, t}] flying to a tool button
let toolUse = { swap: 0, undo: 0, deal: 0 };           // a tool just acted: its icon turns
let toolPip = { swap: 0, undo: 0, deal: 0 };           // its count just changed: the pip ticks
function toolInFlight(kind) {
  let n = 0;
  for (const p of toolPending) if (p.kind === kind) n++;
  for (const b of chargeBeams) if (b.kind === kind && !b.done) n++;
  return n;
}
// will the display still cross for this grant? (the logic is ahead of what the player reads)
function crossingAhead(why) {
  if (why === 'goal') return goalsReached > goalShow;
  if (why === 'level') return colourLevel[0] + colourLevel[1] + colourLevel[2] > levelShow[0] + levelShow[1] + levelShow[2];
  return false;
}
function toolArrive(kind) {
  toolFlash[kind] = 1;
  toolPip[kind] = 1;
  const [bx, by] = toolBtnPos(kind);
  if (!JUICE) { themeFx('reward', bx, by, -1, 1); return; }
  spawnBurst(bx, by, -3, 'reward');                     // the ring, and themeFx('reward') once
  fxSparks(bx, by, -1, 6, 0.12, T.goal || GOLD);
  sfx.charge();
  buzz(10);
}
function sendCharge(kind, from) {
  const [tx, ty] = toolBtnPos(kind);
  if (chargeBeams.length >= 8) { toolArrive(kind); return; }
  chargeBeams.push({ kind, sx: from[0], sy: from[1], tx, ty, t: 0, done: false });
}
// the display crossed: every charge waiting on that crossing takes off from `from`
function releaseCharges(why, from, max) {
  let sent = 0;
  for (let i = 0; i < toolPending.length && sent < (max || 9); i++) {
    if (toolPending[i].why !== why) continue;
    sendCharge(toolPending.splice(i--, 1)[0].kind, from);
    sent++;
  }
}

// ---- the DISPLAYED meter crossed its level ----
let meterPop = [0, 0, 0];     // the meter's own moment, 1 -> 0
function fxLevelShown(ci) {
  if (!JUICE) { releaseCharges('level', hudRingPos(ci), 1); return; }
  meterPop[ci] = 1;
  releaseCharges('level', hudRewardPos(ci), 1);
  buzz(14);
}

/* ---- the DISPLAYED score crossed a target: the biggest moment in the game ----
   The bar's own flash, burst, chime and powerup beam are celebrateGoal()'s. On
   top: the target's number, big and gold, over the board; a gold wash that is
   gone in a third of a second; rings and theme particles across the board; the
   undo and fresh-hand charges flying from the bar to their buttons; a kick and
   a buzz. Nothing here blocks input or waits for anything. */
const GOAL_WASH_MS = 380;
let goalWash = 0;             // 1 -> 0, the board's gold wash
let goalSweep = 0;            // 1 -> 0, the shine that crosses the bar
let goalPartyAt = -1e9;       // shakeClock at the last party (several targets in one payout make one)
let goalCallout = null;       // that party's number, so a second target in the same payout raises it
let fxTimers = [];            // [{at, kind, x, y, c, power}] small delayed beats, bounded
function fxLater(ms, kind, x, y, c, power) {
  if (fxTimers.length >= 12) return;
  fxTimers.push({ at: ms, kind, x, y, c, power: power || 1 });
}
function fxGoal(bar, reached) {
  releaseCharges('goal', [bar.cx, bar.cy]);
  if (!JUICE) return;
  goalSweep = 1;
  if (shakeClock - goalPartyAt < 500) {                 // a multi-target payout parties once, and its number is the last target
    if (goalCallout && callouts.includes(goalCallout)) goalCallout.n = bridgeGoalTarget(reached);
    return;
  }
  goalPartyAt = shakeClock;
  goalWash = 1;
  const c = goalCallout = pushCallout(BX, BY - S * 0.6, bridgeGoalTarget(reached), -3, 4, 0, 1, false);
  c.wait = 0; fireCallout(c);
  const pts = [[-2.7, -1.2], [2.7, -0.4], [0, 2.4]];
  for (let i = 0; i < pts.length; i++) fxLater(70 + i * 110, 'goal', BX + pts[i][0] * S, BY + pts[i][1] * S, -3, 2);
  kickBoard(6);
  buzz([30, 50, 30, 50, 60]);
}

/* ---- a new best: the displayed score has passed the stored best ----
   Once a run, and never on a player's first-ever run (best 0: every first
   score would be a "best", and the moment would mean nothing). The HUD carries
   no crown and no best (the user's 2026-09-26 declutter, pinned by the goal
   suite), so the moment is the score itself turning gold for a breath, with a
   gold ring, the theme's 'best' particles and a flourish — nothing is added to
   the line and nothing stays. */
const BEST_GLOW_MS = 1700;
let bestCrowned = false;      // this run has had its new-best moment
let bestGlow = 0;             // 1 -> 0: the score line's gold
function fxBest() {
  if (bestCrowned) return;
  bestCrowned = true;
  if (!JUICE) return;
  bestGlow = 1;
  const L = hudScoreLine(), x = L.x + L.bigW / 2, y = L.y;
  spawnBurst(x, y, -2, 'best');
  fxSparks(x, y, -1, 10, 0.16, GOLD);
  sfx.best();
  buzz([14, 30, 20]);
}

// ---- the tools' own feel ----
function fxToolUsed(kind, how) {
  if (!JUICE) return;
  toolUse[kind] = 1;
  if (how === 'charge') toolPip[kind] = 1;
  const [bx, by] = toolBtnPos(kind);
  if (kind === 'undo') { sfx.undo(); spawnBurst(bx, by, -1, 'combo'); buzz(12); }
  else if (kind === 'deal') { sfx.deal(); spawnBurst(bx, by, -1, 'combo'); buzz(12); }
}
function fxToolEmpty(kind) { if (JUICE) sfx.empty(); }

function updateJuice(dt) {
  if (calloutGate > 0) calloutGate = Math.max(0, calloutGate - dt);
  if (callouts.length) {
    let done = 0;
    for (const c of callouts) {
      if (!c.fired) { c.wait -= dt; if (c.wait <= 0) fireCallout(c); }
      else { c.t += dt; if (c.t >= calloutLife(c)) done++; }
    }
    if (done) callouts = callouts.filter(c => !c.fired || c.t < calloutLife(c));
  }
  if (kickAmp > 0) { kickT += dt; if (kickT >= KICK_MS) { kickAmp = 0; kickT = 0; } }
  if (goalWash > 0) goalWash = Math.max(0, goalWash - dt / GOAL_WASH_MS);
  if (goalSweep > 0) goalSweep = Math.max(0, goalSweep - dt / 520);
  if (bestGlow > 0) bestGlow = Math.max(0, bestGlow - dt / BEST_GLOW_MS);
  for (let i = 0; i < meterPop.length; i++) if (meterPop[i] > 0) meterPop[i] = Math.max(0, meterPop[i] - dt / 480);
  for (const kind of TOOL_KINDS) {
    if (toolUse[kind] > 0) toolUse[kind] = Math.max(0, toolUse[kind] - dt / 360);
    if (toolPip[kind] > 0) toolPip[kind] = Math.max(0, toolPip[kind] - dt / 260);
  }
  if (toolPending.length) {
    for (let i = 0; i < toolPending.length; i++) {
      const p = toolPending[i];
      p.age += dt;
      // its crossing never came (the labels were cleared under it): it simply arrives
      if (p.age >= PENDING_MAX_MS || !crossingAhead(p.why)) { toolPending.splice(i--, 1); toolArrive(p.kind); }
    }
  }
  if (chargeBeams.length) {
    for (const b of chargeBeams) {
      b.t += dt / CHARGE_MS;
      if (b.t >= 1 && !b.done) { b.done = true; toolArrive(b.kind); }
    }
    chargeBeams = chargeBeams.filter(b => !b.done);
  }
  if (fxTimers.length) {
    for (let i = 0; i < fxTimers.length; i++) {
      const f = fxTimers[i];
      f.at -= dt;
      if (f.at > 0) continue;
      fxTimers.splice(i--, 1);
      if (f.kind === 'goal') {
        spawnBurst(f.x, f.y, f.c, 'fete');
        themeFx('goal', f.x, f.y, f.c, f.power);
        fxSparks(f.x, f.y, fxTimers.length % 3, 12, 0.24);
        fxSparks(f.x, f.y, -1, 6, 0.3, T.goal || GOLD);
      }
    }
  }
}

// every queue of this layer, emptied: a new run, a rescue, an undo
function clearJuice() {
  callouts = []; calloutGate = 0;
  toolPending = []; chargeBeams = []; fxTimers = [];
  kickAmp = 0; kickT = 0;
  goalWash = 0; goalSweep = 0; goalPartyAt = -1e9; goalCallout = null;
  bestGlow = 0;
  meterPop = [0, 0, 0];
  toolUse = { swap: 0, undo: 0, deal: 0 };
  toolPip = { swap: 0, undo: 0, deal: 0 };
  parts = [];
  for (const b of bursts) b.active = false;   // the rings of what was undone (or ended) are not left hanging
}

function loadBest() {
  try {
    const v = parseInt(localStorage.getItem('scraps-best'), 10);
    if (v >= 0) return v;
  } catch (e) {}
  return 0;
}

/* The best a screen shows: the stored best, or this run's score if it is already
   higher — the HUD crown reads the same way, so the menu opened mid-run can no
   longer say 0 under a crown saying 10. Display only: `best` itself (and its
   save) still moves only at run end, per the house save cadence. */
function displayBest() { return Math.max(best, score); }
function saveBest() {
  try { localStorage.setItem('scraps-best', String(best)); } catch (e) {}
}

/* v2 (Q3): the tutorial runs on a player's FIRST run only; later runs deal a
   random tray with no hints, so a restart is instant and the tut events fire
   once per player. What is remembered lives under its own key, as a versioned
   payload, beside the untouched 'scraps-best' and 'scraps-theme':
     done — the tutorial was completed (tut4) or a tutorial run ended;
     swap — the player has swapped colours, so the swap hint never returns;
     merge — the player has placed a merge powerup (the tutorial's free one or
       any later one), so the merge lesson never returns (user 2026-09-26: "if
       the merge tutorial step placement is done we dont need to show it again").
       A save from before this field has none, so a returning player who has
       never merged still gets the lesson until their first merge.
   Read at boot; written once at each milestone. Every field is type-guarded,
   and without storage (incognito) all three simply last for the session. */
const TUT_KEY = 'scraps-tutorial';
let tutDone = false;
let tutRun = false;          // this run is the tutorial run
let mergeLearned = false;    // a merge powerup has been placed, ever: the lesson has retired
function loadTutorial() {
  let raw = null, o = null;
  try { raw = localStorage.getItem(TUT_KEY); } catch (e) { return; }   // unreadable: keep what this session knows
  try { o = raw ? JSON.parse(raw) : null; } catch (e) { o = null; }   // corrupt reads as missing
  tutDone = !!o && o.done === true;
  swapLearned = !!o && o.swap === true;
  mergeLearned = !!o && o.merge === true;
}
function saveTutorial() {
  try { localStorage.setItem(TUT_KEY, JSON.stringify({ v: 1, done: tutDone, swap: swapLearned, merge: mergeLearned })); } catch (e) {}
}
function markTutorialDone() {
  if (tutDone) return;
  tutDone = true;
  saveTutorial();
}
function markMergeLearned() {
  if (mergeLearned) return;
  mergeLearned = true;
  saveTutorial();
}

/* Colour balance. Uniform random colours let one colour run away, and a run
   that deals blue after blue reads as broken rather than unlucky. Spawn weight
   is therefore a function of what is actually ON THE BOARD: a colour that has
   taken over stops spawning entirely, and a starved colour is favoured.

   The floor is a WEIGHT, not a guarantee. Three colours share one board, so
   their shares average 33% and a literal "never below 40%" is unsatisfiable —
   every colour would qualify at once. Favouring the starved ones delivers the
   balance; promising a floor could not. */
const COLOUR_CAP = 0.70;     // at or above this share of the board, a colour stops spawning
const COLOUR_FLOOR = 0.40;   // below this share, a colour is favoured
const FLOOR_BOOST = 3;       // by this much
const BALANCE_MIN = 10;      // ...but not until the board has enough tiles to mean anything

// fraction of placed tiles belonging to each colour; all zero on an empty board
function colourShares() {
  const n = T.colors.length;
  const counts = new Array(n).fill(0);
  let total = 0;
  for (const t of board.values()) {
    if (t.c >= 0 && t.c < n) { counts[t.c]++; total++; }
  }
  if (!total) return counts;
  return counts.map(c => c / total);
}

function spawnWeights() {
  const n = T.colors.length;
  // Below the threshold the board says nothing: the very first tile placed
  // puts its own colour at 100%, and capping there would lock it out instantly.
  if (board.size < BALANCE_MIN) return new Array(n).fill(1);
  const shares = colourShares();
  const w = shares.map(s => (s >= COLOUR_CAP ? 0 : s < COLOUR_FLOOR ? FLOOR_BOOST : 1));
  // the cap must never leave the spawner with nothing to draw
  return w.some(x => x > 0) ? w : new Array(n).fill(1);
}

function pickColour() {
  const w = spawnWeights();
  let total = 0;
  for (const x of w) total += x;
  let roll = Math.random() * total;
  for (let i = 0; i < w.length; i++) { roll -= w[i]; if (roll < 0) return i; }
  return w.length - 1;
}

function randomPiece() {
  const shape = SHAPES[(Math.random() * SHAPES.length) | 0];
  return {
    cells: shape.map(([dq, dr]) => ({ dq, dr, c: pickColour() })),
  };
}

// A single-cell piece carrying the recycle mark. Placed next to its own colour,
// it pulls that whole connected group into itself.
function mergePiece(ci) {
  return { merge: true, cells: [{ dq: 0, dr: 0, c: ci }] };
}

/* The whole opening hand is planned, not random — the tutorial walks the player
   through all three slots in turn, and a random third piece would mean the
   guided placement sometimes had no adjacent home to point at.
   An all-one-colour hand read as a bug ("all 3 are blue"), so a contrast
   colour is threaded through it: a lead pair, a contrast single, then a MIXED
   pair whose guided placement bridges both groups at once — the finale pays
   the most, which is the lesson (bigger connected groups pay better), and the
   presence of two colours is what makes the swap lesson afterwards mean
   anything. Runs on every restart, which is when a player is most likely to
   be re-learning anyway. */
function openingTray() {
  const ci = 1;                                   // lead colour (droplet / sun)
  const alt = 2;                                  // contrast colour (leaf / star)
  return [
    { cells: [{ dq: 0, dr: 0, c: ci }, { dq: 1, dr: 0, c: ci }] },
    { cells: [{ dq: 0, dr: 0, c: alt }] },
    { cells: [{ dq: 0, dr: 0, c: ci }, { dq: 0, dr: 1, c: alt }] },
  ];
}

function refillTray() {
  tray = [randomPiece(), randomPiece(), randomPiece()];
}

/* Drop a merge powerup into the tray for the colour that just levelled.
   It takes an empty slot — `prefer` first (a merge's own slot), then any, which
   is usually the slot place() held empty for it (v2 Q5). v2 NEVER overwrites a
   piece: with no empty slot the powerup is owed to the next refill instead (in
   v1 it replaced the first ordinary piece, often one the player was saving).
   Returns the slot, or -1 when it was owed. */
let reservedSlots = [];    // [{slot, until}] held empty for a forecast level-up powerup
let owedMerges = [];       // colours of powerups earned with no free slot, dealt by the next refill
function grantMerge(ci, deferred, prefer) {
  let slot = prefer !== undefined && tray[prefer] === null ? prefer : tray.findIndex(p => p === null);
  if (slot === -1) { owedMerges.push(ci); return -1; }
  /* A level-up filling an empty slot is a refill, so the mercy rule (M1)
     applies: a powerup with nowhere to land, arriving in a hand where nothing
     else fits, would end the run beside open cells. The slot gets a piece that
     fits and the powerup is owed to the next refill instead. (Direct grants —
     tests and tools — stay literal.) */
  if (deferred && !fitsSomewhere(mergePiece(ci)) && !othersFit(slot)) {
    owedMerges.push(ci);
    refillSlot(slot);
    return -1;
  }
  tray[slot] = mergePiece(ci);
  rotAnim[slot] = null;
  snapBack[slot] = null;
  if (deferred) {
    /* Granted by a level-up: the piece EXISTS now (anyMoveLeft and the
       game-over re-check must see it) but stays invisible until the beam from
       its colour's ring delivers it — display gating only. */
    tray[slot].hidden = true;
    pendingGrants.push({ ci, slot });
  } else {
    tapFlash[slot] = 1;
  }
  return slot;
}

/* Where should the merge powerup go to earn the most? The legal cell whose
   swallowed group carries the highest total VALUE (not size — a lone value-5
   tile beats three value-1s), ties broken by group size. Pure; null when the
   powerup has nowhere legal to go. */
function mergeHint(ci) {
  let best = null, bestVal = -1, bestLen = -1;
  for (const [q, r] of mergeTargets(ci)) {
    const grp = mergeGroupAt(q, r, ci);
    const val = grp.reduce((n, t) => n + (t.v || 1), 0);
    if (val > bestVal || (val === bestVal && grp.length > bestLen)) {
      best = [q, r]; bestVal = val; bestLen = grp.length;
    }
  }
  return best;
}

/* Arm the lesson for a delivered powerup — capped at two per run. v2: arming
   no longer spends one. A lesson counts only once drawMergeGuide() has really
   painted it; in v1 every run spent both on arming while the rotate hint hid
   them, so half of players never saw one. */
function activateMergeHint(slot) {
  if (mergeLearned) return false;          // placed one before (any run, any session): nothing left to teach
  if (mergeHintUsed >= 2) return false;
  if (!tray[slot] || !tray[slot].merge) return false;
  mergeHintSlot = slot;
  mergeHintSeen = false;
  mergeHintClock = 0;
  mergeHintCache = null;
  return true;
}

/* Where the armed merge lesson points, or null when there is no lesson or its
   powerup has nowhere legal to go. Cached per placedCount: the board only
   changes on a placement. Shared by the draw and by the priority checks, so
   "the merge lesson is showing" can never disagree with what is painted. */
function mergeGuideTarget() {
  if (mergeHintSlot === -1) return null;
  const piece = tray[mergeHintSlot];
  if (!piece || !piece.merge || piece.hidden) return null;
  if (!mergeHintCache || mergeHintCache.placed !== placedCount) {
    mergeHintCache = { placed: placedCount, t: mergeHint(piece.cells[0].c) };
  }
  return mergeHintCache.t;
}

// the swap hint is on screen: raised, nothing in hand, no tutorial step or merge
// lesson (both outrank it) showing, and something that can rotate
function tapHintShowing() {
  return swapHintOn && !hintOn && state === 'playing' && !drag &&
    !mergeGuideTarget() && hintTapSlot() !== -1;
}

/* Colour swap is taught when it would help, not up front (v2 M3): the first
   time a piece in hand could pay only if its colours were swapped, or right
   after the first merge the player makes on their own (`afterMerge`). */
function maybeSwapHint(afterMerge) {
  if (swapLearned || swapHintDone || hintOn || state !== 'playing') return false;
  if (hintTapSlot() === -1) return false;
  if (!afterMerge && !tray.some(p => p && swapOnlyPays(p))) return false;
  swapHintOn = true;
  swapHintDone = true;
  tapStepPlaced = 0;
  tapStepShown = 0;
  hintClock = 0;
  return true;
}

// the colours of a piece stepped k seats round its shape, as a tap would
function swappedPiece(piece, k) {
  const clone = { cells: piece.cells.map(c => ({ dq: c.dq, dr: c.dr, c: c.c })) };
  for (let i = 0; i < k; i++) {
    const order = angularOrder(clone), n = order.length;
    const cols = order.map(c => c.c);
    order.forEach((c, j) => { c.c = cols[(j - 1 + n) % n]; });
  }
  return clone;
}
function bestGain(piece) {
  let best = 0;
  for (const [q, r] of CELLS) {
    const g = previewGain(piece, q, r);
    if (g && g.gained > best) best = g.gained;
  }
  return best;
}
// true when this piece scores nothing anywhere as it is, but would score after a swap
function swapOnlyPays(piece) {
  if (piece.merge || piece.hidden || piece.cells.length < 2) return false;
  if (new Set(piece.cells.map(c => c.c)).size < 2) return false;
  if (bestGain(piece) > 0) return false;
  for (let k = 1; k < piece.cells.length; k++) if (bestGain(swappedPiece(piece, k)) > 0) return true;
  return false;
}

/* A real colour swap happened (the rotate button or a tile tap): the swap
   hint's job is done for good, and the run's first one sends 'switch' — the
   v1 name, kept so old and new funnels line up. */
function swapTaken() {
  if (!swapLearned) { swapLearned = true; saveTutorial(); }
  swapHintOn = false;
  if (!switchSent) { switchSent = true; gameEvent('switch'); }
}

/* Portal-neutral analytics seam. The source ships no SDK, so this is a no-op
   over file:// and on anul.space; a portal build calls installGameEvents() with
   a sink that forwards to whatever that portal's analytics wants. Names are
   short and stable — a rename silently orphans the funnel already collected. */
let gameEventSink = null;
function installGameEvents(fn) { gameEventSink = fn; }
function gameEvent(name) {
  if (!gameEventSink) return;
  try { gameEventSink(name); } catch (e) {}       // analytics must never break play
}
/* v2 (Q4) adds events, never renames one (see v2/EVENTS.md):
   run2 / run3 / run5 — the session's 2nd, 3rd, 5th run started. A run that
     was never played (not one placement: the boot run behind the menu, a
     double restart) is replaced, not counted, so "run2" means a player lost
     or quit a real run and started another — the step v1 could not see.
   p10 / p25 / p50 / p100 — placements made in the current run.
   merge1 — the first merge used in the run (on a tutorial run, with tut4).
   tut4 — the tutorial's free merge was used. */
const RUN_EVENTS = [2, 3, 5];
const PLACE_EVENTS = [10, 25, 50, 100];
let sessionRuns = 0;       // played runs this session, counting the current one
let mergeUsed = false;     // merge1 sent this run
let placedHigh = 0;        // v3: the most placements this run has reached; an undo never lowers it
function countPlacement() {
  placedCount++;
  if (placedCount <= placedHigh) return;      // an undone placement, replayed: already counted
  placedHigh = placedCount;
  if (PLACE_EVENTS.includes(placedCount)) gameEvent('p' + placedCount);
}

function newGame() {
  runSerial++; continuesUsed = 0; adPending = false; drag = null; newBestRun = false;
  // a run that never saw a placement is replaced, not counted (see RUN_EVENTS)
  const newRun = sessionRuns === 0 || placedCount > 0;
  if (newRun) sessionRuns++;
  mergeUsed = false;
  board = new Map();
  score = 0;
  placedCount = 0;
  colourLevel = [1, 1, 1];
  colourFill = [0, 0, 0];
  colourFlash = [0, 0, 0];
  colourTick = [0, 0, 0];
  scorePulse = 0;
  scoreShow = 0;
  fillShow = [0, 0, 0];
  levelShow = [1, 1, 1];
  goalsReached = 0;
  goalShow = 0; goalFill = 0; goalTween = null; goalPulse = 0; goalFlash = 0; goalHold = 0;
  beams = [];
  pendingGrants = [];
  reservedSlots = [];
  owedMerges = [];
  mergeHintSlot = -1;
  mergeHintUsed = 0;
  mergeHintSeen = false;
  mergeHintClock = 0;
  mergeHintCache = null;
  tapStepPlaced = 0;
  tapStepShown = 0;
  swapHintOn = false;
  swapHintDone = false;
  switchSent = false;
  tutMergeSlot = -1;
  tutMergePending = false;
  pops = [];
  mergeAnim = [];
  tally = [];
  shakeQueue = [];
  failShake = 0;
  tapFlash = [0, 0, 0];
  rotAnim = [null, null, null];
  pendingOver = false;
  overAt = 0;                // a restart mid-jolt must not pop NO ROOM over the new run
  snapBack = [null, null, null];
  for (const b of bursts) b.active = false;
  parts = [];
  clearJuice(); bestCrowned = false;   // v3: no callout, charge in flight or crown outlives its run
  tools = { swap: TOOL_START.swap, undo: TOOL_START.undo, deal: TOOL_START.deal };
  toolFlash = { swap: 0, undo: 0, deal: 0 };
  toolShake = { swap: 0, undo: 0, deal: 0 };
  undoSnap = null;
  dealQueue = [[], [], []];
  trayIn = [null, null, null];
  toolFirst = { swap: false, undo: false, deal: false };
  swapZeroSent = false;
  placedHigh = 0; levelUpsHigh = 0; goalsHigh = 0;
  /* v2 (Q3): the planned opening hand and the guided steps are the FIRST run's;
     later runs deal a random, colour-balanced tray with no hints. */
  tutRun = !tutDone;
  if (tutRun) tray = openingTray();   // planned opening hand for the drag hint
  else refillTray();
  hintOn = tutRun;
  hintStep = 0;
  hintClock = 0;
  levelUps = 0;
  dealClock = 0;             // display only: the empty board deals itself in
  state = 'playing';
  gameEvent('start');
  if (newRun && RUN_EVENTS.includes(sessionRuns)) gameEvent('run' + sessionRuns);
}

// ---------- placement ----------
function canPlace(piece, q, r) {
  for (const c of piece.cells) {
    const k = key(q + c.dq, r + c.dr);
    if (!CELLSET.has(k)) return false;
    if (board.has(k)) return false;
  }
  /* A powerup may only land where it would actually merge. Routing that
     through canPlace is deliberate: anyMoveLeft() then inherits it, so a
     powerup with nowhere to go cannot be mistaken for a legal move. Checking
     it only at the drop site is exactly the shape of the game-over bug this
     game already shipped once. */
  if (piece.merge) return mergeGroupAt(q, r, piece.cells[0].c).length > 0;
  return true;
}

function groupOf(q, r) {
  const start = board.get(key(q, r));
  if (!start) return [];
  const seen = new Set([key(q, r)]);
  const out = [start], stack = [start];
  while (stack.length) {
    const cur = stack.pop();
    for (const [dq, dr] of DIRS) {
      const k = key(cur.q + dq, cur.r + dr);
      if (seen.has(k)) continue;
      const n = board.get(k);
      if (!n || n.c !== start.c) continue;
      seen.add(k);
      out.push(n);
      stack.push(n);
    }
  }
  return out;
}

/* What a powerup of colour ci would swallow if it landed on (q, r): every
   same-colour tile reachable from its neighbours. A powerup dropped BETWEEN
   two separate groups of its colour joins them and takes both, so the flood
   has to start from all of its same-colour neighbours at once — which is what
   placeMerge's own groupOf() ends up doing after the tile lands.
   Pure — the board is never touched — so the drag preview can call it every
   frame while the player moves across cells. */
function mergeGroupAt(q, r, ci) {
  const at = key(q, r);
  if (!CELLSET.has(at) || board.has(at)) return [];
  const seen = new Set(), out = [], stack = [];
  for (const [dq, dr] of DIRS) {
    const n = board.get(key(q + dq, r + dr));
    if (!n || n.c !== ci) continue;
    const nk = key(n.q, n.r);
    if (seen.has(nk)) continue;
    seen.add(nk); out.push(n); stack.push(n);
  }
  while (stack.length) {
    const cur = stack.pop();
    for (const [dq, dr] of DIRS) {
      const k = key(cur.q + dq, cur.r + dr);
      if (seen.has(k)) continue;
      const n = board.get(k);
      if (!n || n.c !== ci) continue;
      seen.add(k); out.push(n); stack.push(n);
    }
  }
  return out;
}

/* Every cell a powerup of colour ci may legally land on. One source of truth
   for both the legality gate in canPlace and the glow the player sees while
   holding one — if those ever disagreed, the game would be highlighting cells
   it then refuses. */
function mergeTargets(ci) {
  const out = [];
  for (const [q, r] of CELLS) if (mergeGroupAt(q, r, ci).length) out.push([q, r]);
  return out;
}

/* Placing the powerup: every tile in the connected same-colour group it joins
   is pulled into it. Those tiles leave the board IMMEDIATELY so the cells are
   free and "can I still move?" stays honest — the tween that follows is purely
   visual. The powerup itself stays, carrying the count it swallowed as its
   value, and pays that value into the colour meter. */
function placeMerge(slot, q, r) {
  const piece = tray[slot];
  const ci = piece.cells[0].c;
  const tile = { q, r, c: ci, v: 1, vShow: 1, shake: 0, born: 1, punch: 1, merged: true };
  board.set(key(q, r), tile);
  tray[slot] = null;
  countPlacement();
  fxPlaced([tile]);                        // v3 (display only): the powerup lands like any piece
  const tutorialMerge = hintOn && slot === tutMergeSlot;
  markMergeLearned();                      // a merge placed, guided or not: the lesson has done its job for good
  advanceHint(slot, true);
  if (!mergeUsed) { mergeUsed = true; gameEvent('merge1'); }

  const group = groupOf(q, r).filter(m => m !== tile);
  const [tx, ty] = boardPix(q, r);

  /* Nearest tile first, each launched a beat after the last, so the group
     visibly drains inward instead of collapsing all at once. The delay is
     what makes it read as a chain being pulled rather than a cut. */
  const ordered = group.slice().sort((a, b) => {
    const [ax, ay] = boardPix(a.q, a.r), [bx, by] = boardPix(b.q, b.r);
    return Math.hypot(ax - tx, ay - ty) - Math.hypot(bx - tx, by - ty);
  });

  /* Launch pacing accelerates: gaps shrink (pow < 1) and later tiles fly
     faster, so the drain starts deliberate and ends rapid-fire — each arrival
     landing as its own collision on the powerup. The logic value is settled
     below in one lump; only vShow ticks up with the arrivals. */
  let pulled = 0;
  const n = ordered.length;
  const SPAN = MERGE_STAGGER * Math.max(0, n - 1);
  ordered.forEach((m, i) => {
    pulled += m.v || 1;
    const [mx, my] = boardPix(m.q, m.r);
    const u = n > 1 ? i / (n - 1) : 0;
    const delay = SPAN * Math.pow(u, 0.58);
    const dur = MERGE_FLIGHT * (1 - 0.38 * u);
    mergeAnim.push({ x: mx, y: my, tx, ty, c: m.c, v: m.v || 1, age: 0, delay, dur, t: 0, idx: i, to: tile });
    sfx.whoosh(i, delay / 1000);
    board.delete(key(m.q, m.r));
  });
  // v3 (display only): the arrival that completes the merge is told, so the tile can land with weight
  {
    let last = null;
    for (let i = mergeAnim.length - n; i < mergeAnim.length; i++) {
      const a = mergeAnim[i];
      if (!last || a.delay + a.dur >= last.delay + last.dur) last = a;
    }
    if (last) { last.last = true; last.total = pulled; }
  }

  if (pulled > 0) {
    tile.v = pulled;                       // the tile now reads as what it ate
    spawnBurst(tx, ty, ci, 'level');
    sfx.levelUp();
    // the swallowed value pays out, flying to this colour's meter
    // logic settles NOW; the visible bumps and any level-up celebration fire
    // when the flying label LANDS (see the pops loop in update)
    score += pulled;
    checkGoals(slot);                      // a target's reward may take the slot this powerup just left
    colourFill[ci] += pulled;
    pushPop(q, r, pulled, ci);
    while (colourFill[ci] >= levelTarget(colourLevel[ci])) {
      colourFill[ci] -= levelTarget(colourLevel[ci]);
      colourLevel[ci] += 1;
      grantMerge(ci, true, slot);          // into the slot this powerup just left
      levelUpTools();                      // v3: every colour level-up refills a swap
    }
  } else {
    sfx.drop();                            // placed with nothing to eat
  }

  // v2 (Q5): v1 refilled unconditionally here and overwrote the powerup a
  // levelling merge had just been granted into this same slot — it was lost
  if (tray[slot] === null) refillSlot(slot);
  if (!anyMoveLeft()) pendingOver = true;
  // the first merge a player makes on their own is when colour swap is taught
  if (!tutorialMerge) maybeSwapHint(true);
  return pulled;
}

/* Every placement moves the lessons on. During the guided steps any placement
   advances one (tut1-tut3); the third holds its slot for the free merge. The
   merge step ends only when that free merge is placed (tut4). A swap hint that
   is up counts each placement toward its retirement. */
function advanceHint(slot, isMerge) {
  if (swapHintOn && ++tapStepPlaced >= SWAP_HINT_PLACES) swapHintOn = false;   // retired, silently
  if (!hintOn) return;
  if (hintStep < HINT_MERGE_STEP) {
    gameEvent('tut' + ++hintStep);
    hintClock = 0;
    if (hintStep === HINT_MERGE_STEP) { tutMergeSlot = slot; tutMergePending = true; }
    return;
  }
  if (isMerge && slot === tutMergeSlot) {
    hintOn = false;
    tutMergeSlot = -1;
    markTutorialDone();
    gameEvent('tut4');
  }
}

/* The tutorial's free merge: once the third guided payout has landed, a merge
   powerup of the colour with the most to gain is granted into the held slot and
   its beam flies from that colour's ring — the same delivery a level-up makes,
   so the first merge looks exactly like every later one. The beam's landing
   arms the merge lesson, which the tutorial then keeps up until it is used. */
function grantTutorialMerge() {
  tutMergePending = false;
  let ci = -1, bestVal = 0;
  for (const c of [1, 2, 0]) {                  // the opening's lead colour wins a tie
    const t = mergeHint(c);
    if (!t) continue;
    const val = mergeGroupAt(t[0], t[1], c).reduce((n, m) => n + (m.v || 1), 0);
    if (val > bestVal) { bestVal = val; ci = c; }
  }
  const slot = ci === -1 ? -1 : grantMerge(ci, true, tutMergeSlot);
  if (slot === -1) {                            // nowhere to merge: the tutorial ends here
    hintOn = false;
    markTutorialDone();
    if (tutMergeSlot !== -1 && tray[tutMergeSlot] === null) refillSlot(tutMergeSlot);
    tutMergeSlot = -1;
    return false;
  }
  tutMergeSlot = slot;
  // no meter crossing will send this beam, so send it now
  const gi = pendingGrants.findIndex(pg => pg.slot === slot);
  if (gi !== -1) pendingGrants.splice(gi, 1);
  spawnBeam(ci, slot);
  return true;
}

// place a tray piece; returns the points scored (0 if the move is illegal)
function place(slot, q, r) {
  const piece = tray[slot];
  if (!piece || state !== 'playing' || !canPlace(piece, q, r)) return 0;
  /* v3: one level of undo. Everything the rules own is copied BEFORE the
     placement changes anything; a guided tutorial placement is never undoable. */
  undoSnap = hintOn ? null : takeSnapshot();
  if (piece.merge) return placeMerge(slot, q, r);
  const placed = [];
  let cx = 0, cy = 0;
  for (const c of piece.cells) {
    const t = { q: q + c.dq, r: r + c.dr, c: c.c, v: 1, shake: 0, born: 1, punch: 0 };
    board.set(key(t.q, t.r), t);
    placed.push(t);
    const [px, py] = boardPix(t.q, t.r);
    cx += px; cy += py;
  }
  tray[slot] = null;
  countPlacement();
  advanceHint(slot, false);
  spawnBurst(cx / placed.length, cy / placed.length, placed[0].c, 'place');   // landing thunk

  // every connected same-colour group touched by this piece scores its size,
  // paid out one tile at a time rippling outward from the landing point
  const { gained, groups } = scoreGroups(placed);
  // asked before this payout joins the queue: level-ups, and targets (each earns a powerup too)
  const ahead = levelUpsAhead(groups) + goalsAhead(gained);
  fxPlaced(placed);                          // v3 (display only): squash, neighbour nudge, thud
  let until = tallyClock;
  for (let gi = 0; gi < groups.length; gi++) {
    const { g, from: t } = groups[gi];
    const order = rippleOrder(g, t);
    const base = tallyClock + SHAKE_MS + tally.length * TALLY_STEP;
    // v3 (display only): the group's record rides on its tally entries, so its last payout can celebrate the total
    // (a double or triple that pays less than the first tier in all stays quiet: two 2-tile groups are no "great match")
    const grp = juiceGroup(g, gi, gained >= TIER_MIN[0] ? groups.length : 1);
    order.forEach((m, i) => {
      const at = base + i * TALLY_STEP;
      tally.push({ tile: m, at, grp });
      // the shake travels like a snake: each tile tenses just before its own
      // +1 lands, so the wave runs along the shape instead of the whole group
      // flinching at once (that language is reserved for "no room").
      shakeQueue.push({ tile: m, at: at - SHAKE_LEAD });
      until = at;
    });
  }
  if (gained > 0) sfx.shake();
  else sfx.drop();

  // Refill this slot straight away rather than waiting for all three to empty.
  // The player always sees three options, so a dead hand is much rarer and the
  // run ends only when none of three genuinely fits.
  // v2 (Q5): unless this payout will level a colour. Then the slot stays empty
  // for the powerup that level-up grants, and the beam delivers into it — in v1
  // the refill came first and the grant overwrote the first ordinary piece,
  // often one the player was saving.
  if (ahead > 0) reservedSlots.push({ slot, until });
  else if (!(tutMergePending && slot === tutMergeSlot)) refillSlot(slot);   // (held for the free merge)
  if (!anyMoveLeft()) pendingOver = true;   // let the ripple finish first
  maybeSwapHint(false);
  return gained;

}

/* The scoring rule, factored out of place() unchanged so the drag preview can
   ask the SAME question: every connected same-colour group the placed tiles
   touch pays its total value once (a bridge scores the merged group once; two
   cells in one group are not double-counted; a lone tile pays nothing). */
function scoreGroups(placed) {
  let gained = 0;
  const counted = new Set(), groups = [];
  for (const t of placed) {
    const g = groupOf(t.q, t.r);
    if (g.length < 2) continue;
    const id = g.map(m => key(m.q, m.r)).sort().join('|');
    if (counted.has(id)) continue;
    counted.add(id);
    gained += g.reduce((n, m) => n + (m.v || 1), 0);   // merged tiles are worth their value
    groups.push({ g, from: t });
  }
  return { gained, groups };
}

/* What would this drop pay? Places the piece on the real board for one
   synchronous moment, asks scoreGroups() (the exact rule place() uses), and
   takes it back out. Nothing else can observe the board while this runs.
   Returns {gained, cells:Set of keys that would pay, colours}. */
function previewGain(piece, q, r) {
  if (!piece || !canPlace(piece, q, r)) return null;
  if (piece.merge) {
    const ci = piece.cells[0].c;
    const grp = mergeGroupAt(q, r, ci);
    return { gained: grp.reduce((n, t) => n + (t.v || 1), 0),
      cells: new Set(grp.map(t => key(t.q, t.r)).concat([key(q, r)])), colours: new Set([ci]) };
  }
  const temp = piece.cells.map(c => ({ q: q + c.dq, r: r + c.dr, c: c.c, v: 1 }));
  for (const t of temp) board.set(key(t.q, t.r), t);
  let res;
  try { res = scoreGroups(temp); }
  finally { for (const t of temp) board.delete(key(t.q, t.r)); }
  const cells = new Set(), colours = new Set();
  for (const { g } of res.groups) for (const m of g) { cells.add(key(m.q, m.r)); colours.add(m.c); }
  return { gained: res.gained, cells, colours };
}

/* v2 (Q5): how many level-ups will these scoring groups cause once they pay?
   The payout itself happens later, tile by tile (update), so this replays the
   same arithmetic now: this colour's fill, plus whatever earlier placements
   still have queued, plus these groups. Exact unless the board changes mid-
   ripple (a merge swallowing queued tiles) — reservedSlots and owedMerges
   absorb that case, so a wrong guess can cost a beat, never a piece. */
function levelsCrossed(ci, extra) {
  let f = colourFill[ci] + extra, l = colourLevel[ci], n = 0;
  while (f >= levelTarget(l)) { f -= levelTarget(l); l++; n++; }
  return n;
}
/* How many targets will this payout cross? The score after everything still
   queued, against the score after this payout too — same forecast shape as the
   level-ups, so the used slot is held for the target's reward as well. */
function goalsAhead(gained) {
  let queued = 0;
  for (const e of tally) if (board.has(key(e.tile.q, e.tile.r))) queued += e.tile.v || 1;
  const before = score + queued;
  return bridgeGoalCount(before + gained) - bridgeGoalCount(before);
}
function levelUpsAhead(groups) {
  const n = colourFill.length;
  const queued = new Array(n).fill(0), gain = new Array(n).fill(0);
  // a payout tick skips a tile that has left the board, so the forecast does too
  for (const e of tally) if (board.has(key(e.tile.q, e.tile.r))) queued[e.tile.c] += e.tile.v || 1;
  for (const { g } of groups) for (const m of g) gain[m.c] += m.v || 1;
  let ups = 0;
  for (let ci = 0; ci < n; ci++) {
    if (gain[ci]) ups += levelsCrossed(ci, queued[ci] + gain[ci]) - levelsCrossed(ci, queued[ci]);
  }
  return ups;
}

/* Deal into an emptied tray slot. A powerup that was earned while the tray
   had no free slot (owedMerges) comes first; otherwise a normal piece. */
function refillSlot(slot) {
  rotAnim[slot] = null;
  if (owedMerges.length) {
    const p = mergePiece(owedMerges[0]);
    // the mercy rule (dealPiece) holds for a powerup too: one that could not
    // land, dealt into a hand where nothing else fits, waits for the next refill
    if (fitsSomewhere(p) || othersFit(slot)) {
      owedMerges.shift();
      tray[slot] = p;
      tapFlash[slot] = 1;
      activateMergeHint(slot);
      return;
    }
  }
  tray[slot] = dealPiece(slot);
  if (JUICE) trayIn[slot] = { t: 0 };        // v3 (display only): the new piece scales in, so a refill is seen
}

/* v2 (M1): the mercy refill, always on (user decision 2026-09-25). When a slot
   refills and neither other piece in hand fits anywhere, the new piece is
   re-drawn — through the same colour-balanced randomPiece() — until it fits,
   at most MERCY_TRIES times, then the smallest shape that fits is dealt. In v1
   76% of novice deaths came with 10+ free cells: three 3-cell pieces over a
   scattered board read as "no room" beside open space. The rules are
   unchanged — a run still ends only when no piece in hand fits — so with this,
   a run ends only when the board truly has no room. When another piece fits,
   this is exactly one randomPiece() call, as before. */
const MERCY_TRIES = 30;
const SHAPES_BY_SIZE = SHAPES.slice().sort((a, b) => a.length - b.length);
function fitsSomewhere(piece) {
  for (const [q, r] of CELLS) if (canPlace(piece, q, r)) return true;
  return false;
}
function othersFit(slot) {
  return tray.some((p, i) => i !== slot && p && fitsSomewhere(p));
}
function dealPiece(slot) {
  /* v3: no re-roll through undo. A piece an undone placement had revealed in
     this slot is served again before anything new is drawn — unless the mercy
     rule objects (it fits nowhere and nothing else in hand fits), in which case
     it keeps its place in the queue and a piece that fits is dealt as usual. */
  const queue = dealQueue[slot];
  if (queue && queue.length) {
    const others = othersFit(slot);
    const qi = queue.findIndex(p => others || fitsSomewhere(p));
    if (qi !== -1) return queue.splice(qi, 1)[0];
  }
  let piece = randomPiece();
  if (othersFit(slot) || fitsSomewhere(piece)) return piece;
  for (let i = 0; i < MERCY_TRIES; i++) {
    piece = randomPiece();
    if (fitsSomewhere(piece)) return piece;
  }
  for (const shape of SHAPES_BY_SIZE) {
    const p = { cells: shape.map(([dq, dr]) => ({ dq, dr, c: pickColour() })) };
    if (fitsSomewhere(p)) return p;
  }
  return piece;                 // no free cell at all: nothing can fit, the run ends honestly
}

// breadth-first from the landing tile, so the payout spreads like a wave
function rippleOrder(group, from) {
  const inGroup = new Set(group.map(m => key(m.q, m.r)));
  const seen = new Set([key(from.q, from.r)]);
  const out = [from], queue = [from];
  while (queue.length) {
    const cur = queue.shift();
    for (const [dq, dr] of DIRS) {
      const k = key(cur.q + dq, cur.r + dr);
      if (seen.has(k) || !inGroup.has(k)) continue;
      const n = board.get(k);
      if (!n) continue;
      seen.add(k);
      out.push(n);
      queue.push(n);
    }
  }
  return out;
}

/* One tile's payout — the LOGIC of it, and nothing the player sees: score, the
   targets, the colour meter, a level-up's powerup and swap charge, the events.
   update() calls it when the tile's turn comes; an undo calls it for payouts
   that were still in flight when the undone placement was made (v3). */
let levelUpsHigh = 0;      // v3: the most level-ups this run has reached; an undo never lowers it
let goalsHigh = 0;         // ...and the most targets
function settleTile(t) {
  const worth = t.v || 1;
  score += worth;
  checkGoals();
  const ci = t.c;
  colourFill[ci] += worth;
  while (colourFill[ci] >= levelTarget(colourLevel[ci])) {   // meter full
    colourFill[ci] -= levelTarget(colourLevel[ci]);
    colourLevel[ci] += 1;
    grantMerge(ci, true);                        // levelling earns a merge powerup
    // ordinal, not per-colour: 'the first level-up of the run', then the next
    levelUps++;
    if (levelUps > levelUpsHigh) {               // never twice for an undone, replayed level-up
      levelUpsHigh = levelUps;
      if (levelUps <= 2) gameEvent('lvl' + levelUps);
    }
    levelUpTools();                              // v3: ...and refills a swap
  }
  return worth;
}

function anyMoveLeft() {
  for (const piece of tray) {
    if (!piece) continue;
    for (const [q, r] of CELLS) if (canPlace(piece, q, r)) return true;
  }
  return false;
}

function gameOver() {
  if (state === 'over') return;
  drag = null;
  state = 'over';
  gameEvent('lose');
  const newBest = score > best && score > 0;
  newBestRun = newBest;             // the plaque's crown row goes gold for it (showOver)
  if (score > best) { best = score; saveBest(); }
  if (tutRun) markTutorialDone();   // a player who played a whole tutorial run has seen it
  spawnBurst(BX, BY, -1, 'over');   // one last board-wide beat before the plaque lands
  // v2 (M4): a new best, the first one included, gets its moment — a gold burst on
  // the score itself, now that the HUD shows no crown (2026-09-26)
  if (newBest) { const L = hudScoreLine(); spawnBurst(L.x + L.bigW / 2, L.y, -2, 'level'); }
  // every tile flinches together — deliberately the opposite language to the
  // travelling scoring wave, so "no room" can never be mistaken for a score
  failShake = 1;
  /* v2: the board is held for GAMEOVER_HOLD before the plaque lands, so the
     struck-out tray (why the run ended) is read first — the lead's ruling. */
  overAt = tallyClock + GAMEOVER_HOLD;
  sfx.over();
}

let newBestRun = false;           // this run set a new best (gameOver); shown gold on the plaque

// Portal-neutral rewarded rescue. Ordinary builds install no ad capability.
let rewardedAd = null, continuesUsed = 0, adPending = false, runSerial = 0;
const MAX_CONTINUES = 1;
/* A portal installs the rewarded-ad capability, and says WHICH rewards it offers:
   `kinds` is a list out of REWARD_KINDS; left out, every kind is offered. A kind
   that is not offered behaves exactly as it does with no ad at all (an empty
   tool simply refuses and refills through play), so a build can carry the
   game-over Continue without putting an ad on the tools. */
let rewardKinds = null;          // null = every kind
function installRewardedAd(fn, kinds) {
  rewardedAd = typeof fn === 'function' ? fn : null;
  rewardKinds = Array.isArray(kinds) ? kinds.filter(k => typeof k === 'string') : null;
  syncContinueButton();
}
function rewardOffered(kind) { return !!rewardedAd && (rewardKinds === null || rewardKinds.includes(kind)); }
function canContinue() { return rewardOffered('continue') && state === 'over' && continuesUsed < MAX_CONTINUES; }
function continueRun() {
  if (state !== 'over' || continuesUsed >= MAX_CONTINUES) return;
  // A connected nineteen-cell clearing fits every ordinary 1–3-cell shape.
  for (const [q, r] of boardCells(2)) board.delete(key(q, r));
  tray = [randomPiece(), randomPiece(), randomPiece()];
  undoSnap = null; dealQueue = [[], [], []];      // v3: nothing to take back across a rescue (tool stocks stay as they are)
  // Finish the previous run's visual deliveries before refreshing the tray.
  // Logic score/progression have already settled when the no-move check runs.
  pops = []; beams = []; pendingGrants = []; mergeAnim = [];
  reservedSlots = []; owedMerges = [];
  tally = []; shakeQueue = []; pendingOver = false; overAt = 0; failShake = 0;
  scoreShow = score; fillShow = colourFill.slice(); levelShow = colourLevel.slice();
  goalShow = goalsReached; goalHold = 0; goalTween = null; goalFill = goalFrac();
  for (const tile of board.values()) { tile.shake = 0; tile.vShow = tile.v || 1; }
  drag = null; snapBack = [null, null, null]; rotAnim = [null, null, null];
  mergeHintSlot = -1; mergeHintCache = null;
  hintOn = false; tutMergeSlot = -1; tutMergePending = false; swapHintOn = false;
  clearJuice();
  continuesUsed++;
  state = 'playing'; hideOverlays(); syncContinueButton();
  spawnBurst(BX, BY, -1, 'level'); sfx.levelUp();
}
/* v3: ONE rewarded path for every kind of reward. A portal installs a single
   ad function (installRewardedAd); the game asks it for an ad only on an
   explicit player choice, and grants only on a strict `true`. 'continue' is the
   game-over rescue above; 'swap', 'undo' and 'deal' are the in-run tools below.
   The request is a mutex (adPending), and a reward that arrives after the run it
   was asked in has ended is dropped (runSerial). */
const REWARD_KINDS = ['continue', 'swap', 'undo', 'deal'];
function canReward(kind) {
  if (!rewardOffered(kind) || adPending) return false;
  if (kind === 'continue') return canContinue();
  return state === 'playing' && toolRewardable(kind);
}
/* A rewarded ad was EARNED for `kind` (every time: the rw* events). Swap is a
   refill; for undo and the fresh hand the ad IS the action. Should the action
   no longer be possible when the reward lands, the charge is banked instead, so
   a watched ad is never wasted. */
function applyReward(kind) {
  if (kind === 'continue') { gameEvent('rwcont'); continueRun(); return; }
  if (kind === 'swap') {
    gameEvent('rwswap');
    const got = grantTool('swap', TOOL_AD.swap, 'ad');
    // the undo snapshot carries the swap stock: charges bought with an ad must survive an undo
    if (undoSnap) undoSnap.tools.swap = Math.min(TOOL_MAX.swap, undoSnap.tools.swap + got);
    return;
  }
  if (kind === 'undo') { gameEvent('rwundo'); if (!undoLast('ad')) grantTool('undo', TOOL_AD.undo, 'ad'); return; }
  if (kind === 'deal') { gameEvent('rwdeal'); if (!dealHand('ad')) grantTool('deal', TOOL_AD.deal, 'ad'); return; }
}
function requestReward(kind) {
  if (adPending || !canReward(kind)) return false;
  adPending = true;
  const requestedRun = runSerial;
  syncContinueButton();
  let settled = false;
  const finish = earned => {
    if (settled) return;
    settled = true; clearTimeout(guard);
    if (runSerial !== requestedRun) return;
    adPending = false;
    if (earned) applyReward(kind);
    syncContinueButton();
  };
  const guard = setTimeout(() => finish(false), 20000);
  try { Promise.resolve(rewardedAd(kind)).then(result => finish(result === true), () => finish(false)); }
  catch (_) { finish(false); }
  return true;
}
function watchAdToContinue() { requestReward('continue'); }

/* v3 tools: colour swaps, an undo and a fresh hand are small stocks of charges.
   Each starts with a free allowance, refills through play, and — where a portal
   has installed a rewarded ad — offers one when it runs dry. The stock, the
   buttons and the offer are here; what each tool DOES lives with its rules. */
const TOOL_KINDS = ['swap', 'undo', 'deal'];
const TOOL_START = { swap: 5, undo: 1, deal: 1 };
const TOOL_MAX = { swap: 9, undo: 3, deal: 3 };
const TOOL_AD = { swap: 5, undo: 1, deal: 1 };       // what one rewarded ad grants (undo / deal: the ad IS the action)
const TOOL_REFILL = { swap: 1, undo: 1, deal: 1 };   // through play: a swap per colour level-up; an undo and a fresh hand per target reached
let tools = { swap: TOOL_START.swap, undo: TOOL_START.undo, deal: TOOL_START.deal };
let toolFlash = { swap: 0, undo: 0, deal: 0 };        // a charge just arrived: the button pops
let toolShake = { swap: 0, undo: 0, deal: 0 };        // a refused press: the button shakes its head
/* SEAM — a charge was granted. `why` is 'level' (a colour levelled up), 'goal'
   (a target was reached) or 'ad' (a rewarded ad). Returns how many really
   arrived (0 at the cap). Every grant in the game passes through here. */
function grantTool(kind, n, why) {
  if (!TOOL_KINDS.includes(kind)) return 0;
  const before = tools[kind];
  tools[kind] = Math.min(TOOL_MAX[kind], before + (n || TOOL_AD[kind]));
  const got = tools[kind] - before;
  /* What the player sees (toolArrive: the button pops, a ring, themeFx('reward'),
     a chime). A charge earned through play with its display crossing still to
     come waits for it and flies in from the meter or the target bar; any other
     grant arrives at once. */
  if (JUICE && got > 0 && crossingAhead(why) && toolPending.length < 12) {
    for (let i = 0; i < got; i++) toolPending.push({ kind, why, age: 0 });
  } else if (got > 0) toolArrive(kind);
  return got;
}
// through play: every colour level-up refills a swap
function levelUpTools() { grantTool('swap', TOOL_REFILL.swap, 'level'); }
/* ...and every target reached refills an undo and a fresh hand. The fresh hand
   is part of the undo snapshot, so it is re-earned when a crossing is replayed;
   the undo's own stock is not, so its charge comes only the FIRST time the run
   reaches that target (otherwise undoing a crossing would pay for itself). */
function goalTools(first) {
  if (first) grantTool('undo', TOOL_REFILL.undo, 'goal');
  grantTool('deal', TOOL_REFILL.deal, 'goal');
}

// ---------- layout ----------
const cvs = document.getElementById('cv');
/* v3: `ctx` is a `let` — while a painted theme renders into an offscreen layer
   (withCtx), every drawing helper in this file draws there instead. */
let ctx = cvs.getContext('2d');
let W = 420, H = 720, DPR = 1, S = 26, BX = 0, BY = 0, TRAY_Y = 0, TRAY_S = 16;
// short-wide embeds (portal preview panes, landscape phones) flip to a
// three-column arrangement: HUD column, board, tray column
let LANDSCAPE = false, HUD_COL = 112, TRAY_COL = 118;
/* v2 polish geometry. The board now sits on a raised pointy-top paper card whose
   circumradius is CARD_K cells; the tray is a recessed rounded panel. Portrait
   stacks score / meters / card / tray as ONE tight column and centres the
   column (OY) instead of pinning the HUD to the top and the tray to the bottom
   with dead space between — the old gaps are what detached the score from play. */
const CARD_K = 8.55;                          // card circumradius, in cells
const CARD_HW = CARD_K * SQ3 / 2;             // card half-width (flat sides)
const TRAY_HALF_K = 1.9;                      // portrait tray half-height, in cells
const TRAY_HALF_MAX = 56;                     // ...capped: on a tall desktop the tray read as heavy (phones sit under it)
/* v2 (B1): the three-column landscape is used whenever the window is clearly
   wider than tall. v1 flipped only below 640px of height, so a 1280x720 Poki
   desktop got the phone card at 35% of the width — and a bigger window got a
   SMALLER board than 1000x560. */
const LANDSCAPE_ASPECT = 1.25;
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
let OY = 0, RING_R = 20, HUD_SCORE_Y = 31, HUD_RING_Y = 70, HUD_METER_TOP = 130;
/* The target bar's row (2026-09-26). Portrait: one line under the score row —
   bullseye, bar, label — before the meters. Landscape: the bar spans the HUD
   column under the best line, its label centred beneath it. HUD_GOAL_Y is the
   bar's centre line; layout() reserves the row so the board never overlaps it. */
let HUD_GOAL_Y = 0;
const GOAL_ROW = 16;              // portrait: the bar's row, directly under the score line
const GOAL_ROW_L = 14;            // landscape: the bar's row under the score line, before the meters
let TRAY_TOP = 0, TRAY_BOTTOM = 0, TRAY_HALF = 50, TRAY_CY = 0;
let TRAY_X0 = 0, TRAY_X1 = 0;                 // tray panel extent (portrait x / landscape column)

function layout() {
  DPR = (typeof devicePixelRatio !== 'undefined' && devicePixelRatio) || 1;
  const vw = (typeof innerWidth !== 'undefined' ? innerWidth : 420);
  const vh = (typeof innerHeight !== 'undefined' ? innerHeight : 720);
  LANDSCAPE = vw >= vh * LANDSCAPE_ASPECT;

  if (LANDSCAPE) {
    H = Math.min(vh, 900);                       // a huge monitor centres a capped layout
    let s = (H - 20) / (CARD_K * 2);             // height is the scarce axis
    // the HUD scales with the tiles (ANALYSIS UI #6), within readable bounds.
    // 2026-09-26: 4.3 x S with a 136px floor (was 3.6 x S, 112px), so the one-line
    // "12,345 / 15,000" keeps a ~24px score at 1000x560; at that size and in the
    // 616x346 pane the canvas is narrower than the window, so the extra width
    // widens the canvas rather than the board losing anything.
    HUD_COL = clamp(s * 4.3, 136, 196);
    TRAY_COL = clamp(s * 5.1, 104, 230);
    RING_R = clamp(s * 0.6, 14, 34);
    const side = 12;
    const contentW = HUD_COL + side + CARD_HW * 2 * s + side + TRAY_COL + 6;
    W = Math.min(vw - 12, contentW);
    if (W < contentW) s = (W - HUD_COL - TRAY_COL - side * 2 - 6) / (CARD_HW * 2);
    S = s;
    BX = HUD_COL + side + CARD_HW * S;
    BY = H / 2;
    OY = 0;
    TRAY_X0 = W - TRAY_COL - 6; TRAY_X1 = W - 6;
    TRAY_TOP = 10; TRAY_BOTTOM = H - 10;
    TRAY_S = S * 0.92;
    /* One score line ("score / target"), the target bar right under it, then
       the meters (user 2026-09-26: "just have 0/5,000 ... the bar below it").
       The bar sits under the tallest the line can be (hudScoreBase before any
       shrink-to-fit), so a wider score never pushes it. */
    HUD_SCORE_Y = 82;
    HUD_GOAL_Y = HUD_SCORE_Y + Math.min(40, HUD_COL / 4.6) * 0.5 + 12;
    HUD_METER_TOP = HUD_GOAL_Y + GOAL_ROW_L;
  } else {
    H = Math.min(vh, 880);
    W = Math.min(vw, H * 0.62);
    RING_R = Math.max(16, Math.min(27, W / 18, H * 0.03));
    const scoreRow = 48;                        // one line: "score / target" (the theme and mute buttons ride it)
    const meterRow = 12 + RING_R * 2 + 17;      // reward badge overhang + ring + caption
    const fixed = 8 + scoreRow + GOAL_ROW + meterRow + 4 + 12 + 14 + 10;
    /* On a phone the width binds and the column is short of the screen height,
       so the card runs edge to edge (C-polish refine: give the spare to the
       board). Letting the board itself set the limit clipped the card's sides
       and cost its silhouette for ~4% more; the edge-to-edge card keeps it. */
    const sW = (W - 2) / (CARD_HW * 2);
    const sH = (H - fixed) / (CARD_K * 2 + TRAY_HALF_K * 2);
    S = Math.min(sW, sH, 40);
    TRAY_HALF = Math.max(40, Math.min(TRAY_HALF_MAX, TRAY_HALF_K * S));
    const contentH = fixed + CARD_K * 2 * S + TRAY_HALF * 2;
    OY = Math.max(0, (H - contentH) * 0.42);
    let y = OY + 8;
    HUD_SCORE_Y = y + 24;
    y += scoreRow;
    HUD_GOAL_Y = y + 8;                          // the target bar's centre line, directly under the score line
    y += GOAL_ROW;
    HUD_RING_Y = y + 12 + RING_R;               // v3: 3 px more (all a 360x640 phone can give), so the badges clear the target bar
    y += meterRow + 4;
    BX = W / 2;
    BY = y + CARD_K * S;
    y += CARD_K * 2 * S + 12;
    TRAY_TOP = y;
    TRAY_CY = y + 7 + TRAY_HALF;
    TRAY_BOTTOM = TRAY_CY + TRAY_HALF + 7;
    TRAY_Y = TRAY_CY - 30;                      // legacy name, kept for anything reading it
    TRAY_X0 = Math.max(4, BX - CARD_HW * S - 2); TRAY_X1 = W - TRAY_X0;
    TRAY_S = S * 0.92;
  }

  cvs.style.width = W + 'px';
  cvs.style.height = H + 'px';
  cvs.width = Math.round(W * DPR);
  cvs.height = Math.round(H * DPR);
  rebuildSkin();                                 // v3: a painted theme's layers follow the layout

  // theme chip: anchored to the card, 44px target, level with the score row
  const gapX = Math.max(0, (vw - W) / 2);
  const gapY = Math.max(0, (vh - H) / 2);
  if (LANDSCAPE) {
    themeBtn.style.left = (gapX + 10) + 'px';
    themeBtn.style.right = 'auto';
    themeBtn.style.top = (gapY + 12) + 'px';
    muteBtn.style.left = (gapX + 10 + (THEME_LOCK ? 0 : 44 + 8)) + 'px';
    muteBtn.style.right = 'auto';
    muteBtn.style.top = (gapY + 12) + 'px';
  } else {
    themeBtn.style.right = (gapX + TRAY_X0 + 2) + 'px';
    themeBtn.style.left = 'auto';
    themeBtn.style.top = (gapY + HUD_SCORE_Y - 22) + 'px';
    muteBtn.style.right = (gapX + TRAY_X0 + 2 + (THEME_LOCK ? 0 : 44 + 8)) + 'px';
    muteBtn.style.left = 'auto';
    muteBtn.style.top = (gapY + HUD_SCORE_Y - 22) + 'px';
  }
}

function boardPix(q, r) {
  const [x, y] = hexToPixel(q, r, S);
  return [BX + x, BY + y];
}

/* ---------- skins: painted themes (v3) ----------
   A theme whose block sets `skin` is painted by its own hooks; paper and neon
   have none and keep the flat renderer. Every hook is optional. Inside a hook
   the global `ctx` IS the target (the `g` argument is the same object), so the
   helpers here — hexPath, roundRectPath, flatCorner, drawGlyph — just work, and
   all coordinates are CSS pixels. `L` is layoutInfo().

     backdrop(g, vw, vh, card, L)   the whole window behind the play card, on #bg;
                                    card = {x, y, w, h} is where the play card sits.
                                    Painted once per layout.
     panels(g, L)                   static chrome on the play card: HUD and tray
                                    frames. Cached; painted once per layout.
     board(g, L)                    the board base and all 61 empty cells. Cached.
     tile(g, s, ci, o)              ONE tile at the origin, circumradius s, colour
                                    ci; o = {kind: 'normal' | 'merge' | 'valued',
                                    matched}. 'valued' carries no symbol (the
                                    renderer prints its number on top). Cached as
                                    a sprite: no time-dependent drawing here.
     meter(g, m)                    a whole colour meter; m = {i, cx, cy, r, frac,
                                    flash, tick, level, fill, target, ready}.
     goalBar(g, b, st)              the target bar; b = goalBarRect(), st = {fill,
                                    pulse, flash, held}.
     toolChip(g, kind, st)          the chip under a tool button, at the origin;
                                    kind = 'swap' | 'undo' | 'deal', st = see
                                    toolBtnState(). The icon and the count are
                                    drawn on top by the renderer.
     ambient(g, t, L)               each frame, over the static layer, under tiles.
     overlay(g, t, L)               each frame, over everything.
     emit(kind, x, y, ci, power)    spawn this theme's particles (spawnPart) for a
                                    game moment; kinds are listed at themeFx().
     particle(g, p, k)              paint one particle; k = its age 0..1.

   Tokens a skin usually sets beside the hooks: font, valueInk, popInk, matAlpha,
   valueStroke, tileShadow (null = none), toolInk, pipBg, pipInk, chipBg, chipEdge,
   chipInk, plaqueEdge, icon (the theme chip's SVG), and css: a block of CSS rules
   for the page chrome (plaques, buttons, chips), swapped whole with the theme. */
const bgCvs = typeof document !== 'undefined' ? document.getElementById('bg') : null;
const bgCtx = bgCvs && typeof bgCvs.getContext === 'function' ? bgCvs.getContext('2d') : null;
let staticLayer = null;          // panels + board, painted once per layout
let tileSprites = new Map();     // 'ci|kind|matched|size' -> {c, half, ref}
function layoutInfo() {
  return { W, H, S, BX, BY, DPR, LANDSCAPE, OY, HUD_COL, TRAY_COL, RING_R, CARD_K, CARD_HW,
    TRAY_X0, TRAY_X1, TRAY_TOP, TRAY_BOTTOM, TRAY_CY, TRAY_HALF, TRAY_RAIL,
    HUD_SCORE_Y, HUD_GOAL_Y, HUD_RING_Y, HUD_METER_TOP };
}
function withCtx(g, fn) {
  const prev = ctx;
  ctx = g;
  try { return fn(); } finally { ctx = prev; }
}
// an offscreen layer in CSS pixels, or null where the host has no canvas factory (then skins paint directly)
function makeLayer(w, h) {
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') return null;
  const c = document.createElement('canvas');
  if (!c || typeof c.getContext !== 'function') return null;
  c.width = Math.max(1, Math.round(w * DPR));
  c.height = Math.max(1, Math.round(h * DPR));
  const g = c.getContext('2d');
  if (!g) return null;
  g.setTransform(DPR, 0, 0, DPR, 0, 0);
  return { c, g };
}
/* Called by layout() and setTheme(): repaint the backdrop, rebuild the static
   layer, drop the tile sprites. A hook that throws costs its layer, never the game. */
function rebuildSkin() {
  tileSprites = new Map();
  staticLayer = null;
  const sk = T.skin || null;
  const L = layoutInfo();
  if (bgCvs && bgCvs.style) {
    if (sk && sk.backdrop && bgCtx) {
      const vw = (typeof innerWidth !== 'undefined' ? innerWidth : W);
      const vh = (typeof innerHeight !== 'undefined' ? innerHeight : H);
      bgCvs.width = Math.max(1, Math.round(vw * DPR));
      bgCvs.height = Math.max(1, Math.round(vh * DPR));
      bgCvs.style.display = 'block';
      bgCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
      bgCtx.clearRect(0, 0, vw, vh);
      const card = { x: Math.max(0, (vw - W) / 2), y: Math.max(0, (vh - H) / 2), w: W, h: H };
      try { withCtx(bgCtx, () => sk.backdrop(bgCtx, vw, vh, card, L)); } catch (e) { console.error(e); }
    } else bgCvs.style.display = 'none';
  }
  if (sk && (sk.panels || sk.board)) {
    const layer = makeLayer(W, H);
    if (layer) {
      try {
        withCtx(layer.g, () => { if (sk.panels) sk.panels(layer.g, L); if (sk.board) sk.board(layer.g, L); });
        staticLayer = layer.c;
      } catch (e) { console.error(e); }
    }
  }
}
/* Every per-frame hook goes through here: a hook that throws is reported once,
   switched off for that theme, and the flat renderer takes over its element. */
const skinFailed = {};
function skinPaint(name, a, b, c) {
  const sk = T.skin;
  if (!sk || !sk[name] || skinFailed[themeName + '.' + name]) return false;
  ctx.save();
  try { sk[name](ctx, a, b, c); return true; }
  catch (e) { skinFailed[themeName + '.' + name] = true; console.error(e); return false; }
  finally { ctx.restore(); }
}
// a skin's tile as a cached sprite; tray and badge tiles scale down from the board size
const SPRITE_PAD = 1.4;          // sprite half-extent in tile radii: room for the glow or rim a skin paints
function tileSprite(ci, kind, matched) {
  const ref = Math.max(18, Math.ceil(S));
  const k = ci + '|' + kind + '|' + (matched ? 1 : 0) + '|' + ref;
  let sp = tileSprites.get(k);
  if (sp === undefined) {
    sp = null;
    const half = Math.ceil(ref * SPRITE_PAD);
    const layer = makeLayer(half * 2, half * 2);
    if (layer) {
      layer.g.translate(half, half);
      try { withCtx(layer.g, () => T.skin.tile(layer.g, ref, ci, { kind, matched: !!matched })); sp = { c: layer.c, half, ref }; }
      catch (e) { console.error(e); sp = null; }
    }
    tileSprites.set(k, sp);
  }
  return sp;
}
function drawSkinTile(x, y, s, ci, o) {
  const kind = o.merge ? 'merge' : (o.valued || (o.v || 1) > 1) ? 'valued' : 'normal';
  const base = typeof ctx.globalAlpha === 'number' ? ctx.globalAlpha : 1;
  ctx.save();
  // a soft contact shadow, longer while the piece is in hand; a ghost casts none
  if (!o.ghost && T.tileShadow !== null && !o.badge) {
    ctx.globalAlpha = base * (o.dragging ? 0.30 : 0.20) * TILE_ALPHA;
    hexPath(x + (o.dragging ? s * 0.20 : s * 0.05), y + (o.dragging ? s * 0.30 : s * 0.11), s * 0.92);
    ctx.fillStyle = T.tileShadow || '#3a2a14';
    ctx.fill();
  }
  if (o.ghost) {
    /* A ghost at 45% over a painted cell washed to grey (the cell's own art
       showed through the glossy sprite). Cover the cell with a flat base first,
       then lay the tile on it, so the ghost keeps its colour and its symbol. */
    ctx.globalAlpha = base * TILE_ALPHA * 0.92;
    hexPath(x, y, s * 0.93);
    ctx.fillStyle = T.ghostBase || T.card || '#fffaf0';
    ctx.fill();
  }
  ctx.globalAlpha = base * TILE_ALPHA * (o.ghost ? 0.66 : 1);
  const sp = tileSprite(ci, kind, o.matched);
  if (sp) {
    const half = sp.half * s / sp.ref;
    ctx.drawImage(sp.c, x - half, y - half, half * 2, half * 2);
  } else {
    // no sprite (no canvas factory, or the hook threw while building one): paint direct, and never lose the tile
    ctx.translate(x, y);
    try { T.skin.tile(ctx, s, ci, { kind, matched: !!o.matched }); }
    catch (e) { hexPath(0, 0, s * 0.9); ctx.fillStyle = T.colors[ci] || T.ink; ctx.fill(); }
  }
  ctx.restore();
  if (kind === 'valued') drawValue(x, y, s, o.v || 1, T.valueInk || '#fff8f0');
}

/* Theme particles (v3). One bounded pool; a skin spawns into it from emit() and
   paints each one in particle(). Decoration only: never read by the rules, and
   off entirely under reduced motion. */
const MAX_PARTS = 160;
let parts = [];
function spawnPart(p) {
  if (REDUCED) return;
  if (parts.length >= MAX_PARTS) parts.shift();
  parts.push(Object.assign({ x: 0, y: 0, vx: 0, vy: 0, g: 0, drag: 0, rot: 0, vr: 0, age: 0, life: 600, size: 6, c: 0, shape: 0 }, p));
}
/* The moments a skin may dress. Every ring burst passes through here with its
   own kind: 'tick' (one tile pays), 'place', 'level', 'deny', 'over', 'goal'.
   The juice pass adds: 'tier1' | 'tier2' | 'tier3' (a group finished paying,
   by size), 'mergeDone' (a merge has swallowed its last tile), 'reward' (a tool
   charge or powerup arrived), 'best' (a new best score). An unknown kind must
   be ignored by a skin, never thrown on. */
function themeFx(kind, x, y, ci, power) {
  const sk = T.skin;
  if (!sk || !sk.emit || REDUCED) return;
  /* A theme's particles may ask for random numbers. For the length of the call
     they get the feedback layer's own generator, never the dealer's: decoration
     must not take a draw from the rules (a seeded run deals the same pieces in
     every look, with the feedback on or off). */
  const dealer = Math.random;
  Math.random = fxRand;
  try { sk.emit(kind, x, y, ci, power || 1); } catch (e) {} finally { Math.random = dealer; }
}
function updateParts(dt) {
  if (!parts.length) return;
  for (const p of parts) {
    p.age += dt;
    p.vy += p.g * dt;
    if (p.drag) { const d = Math.max(0, 1 - p.drag * dt); p.vx *= d; p.vy *= d; }
    p.x += p.vx * dt; p.y += p.vy * dt;
    p.rot += p.vr * dt;
  }
  parts = parts.filter(p => p.age < p.life);
}
function drawParts() {
  if (!parts.length) return;
  const paint = T.skin && T.skin.particle;
  for (const p of parts) {
    const k = Math.min(1, p.age / p.life);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    if (paint) { try { paint(ctx, p, k); } catch (e) {} }
    else {
      ctx.globalAlpha = 1 - k;
      ctx.fillStyle = p.tint || (p.c >= 0 && p.c < T.colors.length ? T.colors[p.c] : T.ink);
      ctx.beginPath(); ctx.arc(0, 0, p.size * (1 - k * 0.5), 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
}
function traySlotPos(i) {
  if (LANDSCAPE) return [(TRAY_X0 + TRAY_X1) / 2, TRAY_TOP + (TRAY_BOTTOM - TRAY_TOP - TRAY_RAIL) * (i + 0.5) / 3];
  return [TRAY_X0 + (TRAY_X1 - TRAY_X0 - TRAY_RAIL) * (i + 0.5) / 3, TRAY_CY];
}

// tray pieces are centred on their shape, not on their anchor cell, so a
// piece that grows right-and-down doesn't sit off to one side of its slot
function pieceOffset(piece, s) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const c of piece.cells) {
    const [x, y] = hexToPixel(c.dq, c.dr, s);
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return [-(minX + maxX) / 2, -(minY + maxY) / 2];
}

/* One global tray scale made tall shapes overflow the band: a 3-cell diagonal
   is much taller than a compact trio, so it spilled above and below the tray.
   Each piece now gets its own scale, shrunk only as far as its own bounding box
   demands, so compact pieces stay full size. */
const TRAY_RAIL = 52;      // right rail (portrait) / bottom rail (landscape) for the rotate button
function trayScale(piece) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const c of piece.cells) {
    const [x, y] = hexToPixel(c.dq, c.dr, 1);   // measure at unit scale
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  // add one tile's own half-extent: the bbox is centres, not edges
  const halfH = (maxY - minY) / 2 + SQ3 / 2;   // flat-top tile: SQ3/2 tall, 1 wide
  const halfW = (maxX - minX) / 2 + 1;
  // landscape slots stack vertically, so the tight axis flips with the layout;
  // both modes give up TRAY_RAIL of their long axis to the rotate button
  const limitH = LANDSCAPE ? (TRAY_BOTTOM - TRAY_TOP - TRAY_RAIL) / 6 - 6 : TRAY_HALF - 3;
  const limitW = LANDSCAPE ? (TRAY_X1 - TRAY_X0) / 2 - 8 : ((TRAY_X1 - TRAY_X0 - TRAY_RAIL) / 3) / 2 - 5;
  return Math.min(TRAY_S, limitH / halfH, limitW / halfW);
}

function trayCellPos(piece, cell, slot) {
  const [sx, sy] = traySlotPos(slot);
  const ts = trayScale(piece);
  const [ox, oy] = pieceOffset(piece, ts);
  const [x, y] = hexToPixel(cell.dq, cell.dr, ts);
  return [sx + ox + x, sy + oy + y];
}


// ---------- drag ----------
let drag = null;   // {slot, x, y, grabDq, grabDr, hover:[q,r]|null}
/* The dragged piece rides this many tiles ABOVE the finger so a thumb never
   hides it. One constant for everything that must agree on it: where a drop
   lands, where the piece in hand is drawn, where a refusal pushes back from,
   and (v2 Q2) where the tutorial's demonstration finger ends. */
const DRAG_LIFT = 1.1;

// where cell c of a piece held at (px, py) by its grabbed cell is drawn
function liftedCellPos(px, py, c, grabDq, grabDr) {
  const [x, y] = hexToPixel(c.dq - grabDq, c.dr - grabDr, S);
  return [px + x, py - S * DRAG_LIFT + y];
}

const hexDist = (a, b) => (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) +
  Math.abs(a[0] + a[1] - b[0] - b[1])) / 2;

/* The anchor the tutorial is guiding THIS slot's piece to, or null when no
   guided step is asking for it: a guided placement, or the free merge. */
function guidedTarget(slot) {
  if (!hintOn || !tray[slot]) return null;
  if (hintStep < HINT_MERGE_STEP) return slot === hintStep ? hintTarget(tray[slot]) : null;
  const p = tray[slot];
  if (slot !== tutMergeSlot || !p.merge || p.hidden) return null;
  return mergeHint(p.cells[0].c);
}

/* Where a piece held at (px, py) would land. v2 (Q2) forgives near misses:
   - during a guided step, a release within one cell of the demonstrated target
     (measured from the lifted spot OR from the finger) lands on the target;
   - otherwise the lifted spot, exactly as before, when it is legal;
   - otherwise the cell under the finger itself, when THAT is legal — a player
     who lets go where they are pointing is not refused for it.
   Computed in dragTo, so the landing preview always shows the real outcome. */
function dropAnchor(piece, px, py, grabDq, grabDr, slot) {
  const [lq, lr] = pixelToHex(px - BX, py - BY - S * DRAG_LIFT, S);
  const [fq, fr] = pixelToHex(px - BX, py - BY, S);
  const lifted = [lq - grabDq, lr - grabDr];
  const finger = [fq - grabDq, fr - grabDr];
  const guide = guidedTarget(slot);
  if (guide && (hexDist(lifted, guide) <= 1 || hexDist(finger, guide) <= 1)) return guide;
  if (canPlace(piece, lifted[0], lifted[1])) return lifted;
  if (canPlace(piece, finger[0], finger[1])) return finger;
  return null;
}
// one slot in flight per tray slot: a rejected piece eases back to the tray
// instead of just vanishing — {x, y, grabDq, grabDr, t, dur} | null, x3
let snapBack = [null, null, null];
const SNAPBACK_MS = 260;


// a tap (not a drag) cycles the piece's colours one step counter-clockwise
// around its own shape — a way to rescue an awkward piece without changing
// any scoring rule
// cells in counter-clockwise order about the piece's centroid. canvas y grows
// downward, so a *descending* atan2 angle walks anti-clockwise on screen.
function angularOrder(piece) {
  const cells = piece.cells;
  const pos = cells.map(c => hexToPixel(c.dq, c.dr, 1));
  let cx = 0, cy = 0;
  for (const [x, y] of pos) { cx += x / cells.length; cy += y / cells.length; }
  return cells
    .map((c, i) => ({ c, a: Math.atan2(pos[i][1] - cy, pos[i][0] - cx) }))
    .sort((p, q) => q.a - p.a)
    .map(p => p.c);
}

function rotatePieceColours(slot) {
  const piece = tray[slot];
  if (!piece || state !== 'playing') return false;
  if (piece.cells.length < 2) { tapFlash[slot] = 1; sfx.deny(); return false; }
  const order = angularOrder(piece);
  const n = order.length;
  const colours = order.map(c => c.c);
  // each colour steps one seat anti-clockwise: the cell at position i takes
  // the colour that was sitting at i-1, so colours travel i -> i+1 on screen
  const moves = order.map((c, i) => ({
    cell: c,
    fromDq: order[(i - 1 + n) % n].dq,
    fromDr: order[(i - 1 + n) % n].dr,
  }));
  order.forEach((c, i) => { c.c = colours[(i - 1 + n) % n]; });
  rotAnim[slot] = { t: 0, moves };      // tween the colours around the shape
  tapFlash[slot] = 1;
  sfx.rotate();
  return true;
}

// swing a point around a centre: lerp angle and radius, not x and y, so the
// colour visibly arcs to its new seat instead of cutting straight across
function arcLerp(cx, cy, ax, ay, bx, by, k) {
  const a0 = Math.atan2(ay - cy, ax - cx), r0 = Math.hypot(ax - cx, ay - cy);
  const a1 = Math.atan2(by - cy, bx - cx), r1 = Math.hypot(bx - cx, by - cy);
  let d = a1 - a0;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  const a = a0 + d * k, r = r0 + (r1 - r0) * k;
  return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
}

function pickUp(slot, px, py) {
  snapBack[slot] = null;   // grabbing again cancels any in-flight return
  if (state !== 'playing' || !tray[slot]) return;
  if (tray[slot].hidden) return;   // still riding the grant beam — not delivered yet
  if (slot === mergeHintSlot) mergeHintSlot = -1;   // lesson over: they took it
  // which cell of the piece did the finger land on?
  let grab = tray[slot].cells[0], bd = Infinity;
  for (const c of tray[slot].cells) {
    const [cx, cy] = trayCellPos(tray[slot], c, slot);
    const d = Math.hypot(cx - px, cy - py);
    if (d < bd) { bd = d; grab = c; }
  }
  drag = {
    slot, piece: tray[slot], x: px, y: py, x0: px, y0: py, moved: 0,
    grabDq: grab.dq, grabDr: grab.dr, hover: null,
    /* A powerup may only land where it would merge, and that rule is invisible
       unless the board shows it — a player who can't see it just experiences
       drops being refused. The board cannot change during a drag, so the legal
       set is computed once here instead of flood-filling 61 cells every frame. */
    mergeCells: tray[slot].merge ? mergeTargets(tray[slot].cells[0].c) : null,
  };
  sfx.lift();
}

function dragTo(px, py) {
  if (!drag) return;
  if (state !== 'playing' || tray[drag.slot] !== drag.piece) { drag = null; return; }
  drag.moved = Math.max(drag.moved, Math.hypot(px - drag.x0, py - drag.y0));
  drag.x = px; drag.y = py;
  // the piece rides above the finger (DRAG_LIFT); dropAnchor forgives near misses
  const piece = tray[drag.slot];
  drag.hover = dropAnchor(piece, px, py, drag.grabDq, drag.grabDr, drag.slot);
  /* v2 (C-polish): what this drop would pay, asked of the SAME scoreGroups()
     place() uses (previewGain), recomputed only when the landing cell changes. */
  const hk = drag.hover ? key(drag.hover[0], drag.hover[1]) : '';
  if (hk !== drag.previewKey) {
    drag.previewKey = hk;
    drag.preview = drag.hover ? previewGain(piece, drag.hover[0], drag.hover[1]) : null;
  }
  drag.clash = drag.hover ? null : clashCells(piece, px, py, drag.grabDq, drag.grabDr);
}

/* With nowhere legal to land, the cells that block the lifted spot (ANALYSIS
   UI #10): the occupied ones, or for a powerup a free cell it cannot merge on.
   Display only; empty when the piece is off the board entirely. */
function clashCells(piece, px, py, grabDq, grabDr) {
  const [lq, lr] = pixelToHex(px - BX, py - BY - S * DRAG_LIFT, S);
  const out = [];
  for (const c of piece.cells) {
    const q = lq - grabDq + c.dq, r = lr - grabDr + c.dr;
    if (!CELLSET.has(key(q, r))) continue;
    if (board.has(key(q, r)) || (piece.merge && !mergeGroupAt(q, r, c.c).length)) out.push([q, r]);
  }
  return out;
}

const TAP_SLOP = 10;   // a press that never travels this far is a tap

/* The rotate button. Tapping a tray piece already swaps its colours, but a
   tap on a tile is invisible as an affordance — this is the explicit control
   that says the mechanic exists. It applies the SAME swap to every piece that
   can take one, so it also serves as "cycle the whole hand". */
let btnSpin = 0;                     // press feedback: the icon takes a half-turn
let btnSwap = false;                 // which way round the icon's two tiles rest
function rotateBtnPos() {
  if (LANDSCAPE) return [(TRAY_X0 + TRAY_X1) / 2, TRAY_BOTTOM - TRAY_RAIL / 2 - 2];
  return [TRAY_X1 - TRAY_RAIL / 2 - 8, TRAY_CY];   // room for the lesson's pulse ring (UI #13)
}
function rotateBtnHit(px, py) {
  const [bx, by] = rotateBtnPos();
  return Math.hypot(px - bx, py - by) <= 26;
}
function rotateAllColours() {
  let any = false;
  for (let i = 0; i < 3; i++) if (tray[i] && rotatePieceColours(i)) any = true;
  if (any) {
    btnSpin = 1;
    btnSwap = !btnSwap;
    swapTaken();                     // a real swap: the hint's job is done, 'switch' once a run
  } else {
    sfx.deny();                      // nothing in the tray could swap
  }
  return any;
}

// the icon's turn angle and which colour each of its two tiles wears (pure)
function rotateIconPose() {
  const k = 1 - btnSpin, turning = btnSpin > 0;
  return { angle: turning ? Math.PI * k * k * (3 - 2 * k) : 0,
    order: (turning ? !btnSwap : btnSwap) ? [1, 0] : [0, 1] };
}

/* v3: the tool buttons. Swap keeps its rail in the tray; undo and the fresh hand
   sit in the two bottom corners of the board card's bounding box, which the hex
   card leaves empty in both layouts (undo left, fresh hand right, next to the
   tray). Each is a chip, an icon and a pip: the pip is the charges left, or the
   video badge when the stock is empty and a rewarded ad can refill it. */
// all three grow with the board (they were fixed sizes: small islands beside 95 px tiles on a desktop)
function toolBtnR(kind) { return kind === 'swap' ? clamp(S * 0.55, 18, 22) : clamp(S * 0.62, 18, 32); }
function toolBtnPos(kind) {
  if (kind === 'swap') return rotateBtnPos();
  const r = toolBtnR(kind);
  const dx = CARD_HW * S - r - 5, dy = CARD_K * S - r - 5;
  // on a phone the card runs edge to edge: keep the ring 8 px, and the count pip 4 px, inside the play card
  if (kind === 'undo') return [Math.max(BX - dx, r + 8), BY + dy];
  return [Math.min(BX + dx, W - 4 - r * 1.25), BY + dy];
}
function toolBtnHit(kind, px, py) {
  if (kind === 'swap') return rotateBtnHit(px, py);
  const [bx, by] = toolBtnPos(kind);
  return Math.hypot(px - bx, py - by) <= Math.max(24, toolBtnR(kind) + 6);
}
/* Would this tool's action do something right now, the stock aside? Swap: any
   time in play (the press itself reports a hand with nothing to swap). Undo: a
   placement to take back. Fresh hand: an ordinary piece to replace. */
function toolPossible(kind) {
  if (state !== 'playing') return false;
  if (kind === 'swap') return true;
  if (kind === 'undo') return canUndo();
  if (kind === 'deal') return canDeal();
  return false;
}
// the button's truth: it can act with a charge / it is empty and an ad could stand in
function toolUsable(kind) { return TOOL_KINDS.includes(kind) && tools[kind] > 0 && toolPossible(kind); }
function toolRewardable(kind) { return TOOL_KINDS.includes(kind) && tools[kind] <= 0 && toolPossible(kind); }
// everything a chip, an icon or a pip needs to draw one button (also what skin.toolChip receives)
function toolBtnState(kind) {
  const [x, y] = toolBtnPos(kind);
  const n = tools[kind];
  return { kind, x, y, r: toolBtnR(kind), n, max: TOOL_MAX[kind], empty: n <= 0,
    ad: rewardOffered(kind) && toolRewardable(kind),   // out of charges, and a press would offer a rewarded ad
    busy: adPending, flash: toolFlash[kind], shake: toolShake[kind], spin: kind === 'swap' ? btnSpin : 0, usable: toolUsable(kind),
    // v3 feedback: the count the pip shows (a charge still flying in is not there yet), the icon's turn, the pip's tick
    shown: Math.max(0, n - toolInFlight(kind)), use: toolUse[kind], pip: toolPip[kind] };
}
// the flat themes' chip (paper, neon); a painted theme supplies skin.toolChip instead
function drawToolChip(kind, st) {
  const r = st.r;
  const plate = T.style !== 'wire' && T.chipFill;        // a look on a dark desk: an opaque plate, so the chip reads where it sits beside the card
  const a0 = ctx.globalAlpha;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  if (plate) { ctx.globalAlpha = 1; ctx.fillStyle = (st.usable || st.ad) ? plate : (T.chipRest || plate); }
  else ctx.fillStyle = T.style === 'wire' ? 'rgba(120,195,255,0.10)' : 'rgba(255,255,255,0.5)';
  ctx.fill();
  ctx.globalAlpha = a0;
  ctx.lineWidth = 2;
  ctx.strokeStyle = T.ink;
  if (T.style === 'wire') { ctx.shadowColor = T.ink; ctx.shadowBlur = 6 + st.spin * 12; }
  const a = ctx.globalAlpha;
  ctx.globalAlpha = (typeof a === 'number' ? a : 1) * 0.9;
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.globalAlpha = a;
}
function drawToolIcon(kind, st) {
  const r = st.r, ink = T.toolInk || T.ink;
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (kind === 'swap') {
    /* v2 (ANALYSIS UI #3): the icon shows its action — two tiles trading colours
       along two curved arrows — where v1's plain circular arrows read as
       "restart", the same mark as replay. Press feedback is still a half-turn:
       while turning, the tiles keep their pre-press colours, so landing at pi IS
       the new resting pose (btnSwap flips per press) and nothing snaps. */
    const { angle, order } = rotateIconPose();
    ctx.rotate(angle - 0.62);                    // a standing tilt: level, the two tiles over an arc read as a face
    for (let j = 0; j < 2; j++) {
      const col = T.colors[order[j]];
      hexPath((j ? 1 : -1) * r * 0.36, 0, r * 0.3);
      if (T.style === 'wire') { ctx.fillStyle = col + '44'; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 1.4; ctx.stroke(); }
      else { ctx.fillStyle = col; ctx.fill(); }
    }
    ctx.strokeStyle = ink;
    ctx.fillStyle = ink;
    ctx.lineWidth = 1.8;
    const a = r * 0.64, a0 = Math.PI * 1.18, a1 = Math.PI * 1.8;
    for (const flip of [0, Math.PI]) {          // over the top left-to-right, under the bottom back
      ctx.save();
      ctx.rotate(flip);
      ctx.beginPath();
      ctx.arc(0, 0, a, a0, a1);
      ctx.stroke();
      ctx.translate(Math.cos(a1) * a, Math.sin(a1) * a);
      ctx.rotate(a1 + Math.PI / 2);             // along the arc's direction of travel
      ctx.beginPath();
      ctx.moveTo(3.4, 0);
      ctx.lineTo(-2, -2.9);
      ctx.lineTo(-2, 2.9);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  } else if (kind === 'undo') {
    // one move back: an arc swinging anti-clockwise into an arrowhead
    // (used: the whole mark winds back one full turn, easing out — back where it started)
    if (st.use > 0 && !REDUCED) { const k = 1 - st.use; ctx.rotate(-Math.PI * 2 * (1 - Math.pow(1 - k, 3))); }
    const a = r * 0.5;
    ctx.strokeStyle = ink;
    ctx.fillStyle = ink;
    ctx.lineWidth = Math.max(2, r * 0.17);
    ctx.beginPath();
    ctx.arc(r * 0.04, r * 0.06, a, -Math.PI * 0.62, Math.PI * 0.80);
    ctx.stroke();
    const hx = r * 0.04 + Math.cos(-Math.PI * 0.62) * a, hy = r * 0.06 + Math.sin(-Math.PI * 0.62) * a;
    ctx.beginPath();
    ctx.moveTo(hx - r * 0.42, hy - r * 0.02);
    ctx.lineTo(hx + r * 0.10, hy - r * 0.34);
    ctx.lineTo(hx + r * 0.10, hy + r * 0.30);
    ctx.closePath();
    ctx.fill();
  } else {
    // a fresh hand: two crossing arrows, the shuffle mark (used: it flips over once, like a card)
    if (st.use > 0 && !REDUCED) ctx.scale(Math.cos((1 - st.use) * Math.PI * 2), 1);
    ctx.strokeStyle = ink;
    ctx.fillStyle = ink;
    ctx.lineWidth = Math.max(2, r * 0.15);
    const w = r * 0.5, h = r * 0.3;
    for (const dir of [1, -1]) {
      ctx.beginPath();
      ctx.moveTo(-w, dir * h);
      ctx.bezierCurveTo(-w * 0.2, dir * h, w * 0.1, -dir * h, w * 0.62, -dir * h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(w + r * 0.14, -dir * h);
      ctx.lineTo(w * 0.52, -dir * h - r * 0.2);
      ctx.lineTo(w * 0.52, -dir * h + r * 0.2);
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.restore();
}
function drawToolPip(kind, st) {
  const pr = Math.max(7.5, st.r * 0.46);
  const shown = st.shown != null ? st.shown : st.n;
  ctx.save();
  ctx.translate(st.r * 0.74, -st.r * 0.74);
  if (st.pip > 0) { const k = 1 + Math.sin((1 - st.pip) * Math.PI) * 0.3 * MOTION; ctx.scale(k, k); }
  if (st.ad) {
    // out of charges and a rewarded ad can refill it: the results screen's video badge, small
    roundRectPath(-pr * 1.3, -pr * 0.92, pr * 2.6, pr * 1.84, pr * 0.55);
    ctx.fillStyle = '#ffda81';
    ctx.fill();
    ctx.strokeStyle = '#fff6df';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#3b321f';
    ctx.beginPath();
    ctx.moveTo(-pr * 0.34, -pr * 0.5);
    ctx.lineTo(pr * 0.56, 0);
    ctx.lineTo(-pr * 0.34, pr * 0.5);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(0, 0, pr, 0, Math.PI * 2);
    if (T.style === 'wire') {
      ctx.fillStyle = T.bg; ctx.fill();
      ctx.strokeStyle = T.ink; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = T.ink;
    } else {
      ctx.fillStyle = shown <= 0 ? T.inkSoft : (T.pipBg || T.ink);
      ctx.fill();
      if (T.badgeRim) { ctx.strokeStyle = T.badgeRim; ctx.lineWidth = 1.8; ctx.stroke(); }   // the pip rides the chip's edge, over the desk: a light rim
      ctx.fillStyle = T.pipInk || T.card || '#fffaf2';
    }
    ctx.font = hudFont(800, Math.round(pr * 1.3));
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(shown), 0, 0.5);
  }
  ctx.restore();
}
function drawToolBtn(kind) {
  const st = toolBtnState(kind);
  ctx.save();
  ctx.translate(st.x + Math.sin(st.shake * 19) * 3.5 * st.shake * MOTION, st.y);   // a refused press shakes its head
  const pop = 1 + st.flash * 0.22 * MOTION;
  ctx.scale(pop, pop);
  const alpha0 = typeof ctx.globalAlpha === 'number' ? ctx.globalAlpha : 1;
  if (!st.usable && !st.ad) ctx.globalAlpha = alpha0 * 0.5;     // nothing to spend and nothing to watch: a quiet control
  if (!skinPaint('toolChip', kind, st)) drawToolChip(kind, st);
  // while the tap lesson is up, the swap button pulses too — same mechanic
  if (kind === 'swap' && tapHintShowing()) {
    const ring = 0.5 + 0.5 * Math.sin(hintClock * 0.008);
    ctx.save();
    ctx.globalAlpha = 0.25 + ring * 0.35;
    ctx.lineWidth = 2;
    ctx.strokeStyle = T.toolInk || T.ink;
    ctx.beginPath();
    ctx.arc(0, 0, st.r + 4 + ring * 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  drawToolIcon(kind, st);
  // a charge in stock stays readable even while there is nothing to use it on ("1 left" is not "0 left")
  if (st.n > 0) ctx.globalAlpha = alpha0;
  drawToolPip(kind, st);
  ctx.restore();
}
function drawRotateBtn() { drawToolBtn('swap'); }
/* ---------- v3 tools: the rules ----------
   Soft friction (Poki, 2026-09-30): colour swaps are charges, and an undo and
   a fresh hand sit beside the board. Each refills through play (a swap per
   colour level-up; an undo and a fresh hand per target) and, when it runs dry
   and a portal has installed a rewarded ad, the button offers one. A player
   who never watches an ad still has a fair run.

   One function per action — swapHand(), tapSwap(slot), undoLast(how),
   dealHand(how) — and four seams the feedback pass can dress:
     grantTool(kind, n, why)   a charge was granted        (further up)
     toolUsed(kind, how)       a tool acted
     toolRanOut(kind)          its stock just reached 0
     toolDenied(kind)          a press was refused */
let undoSnap = null;               // the state before the last placement, or null — one level deep
let dealQueue = [[], [], []];      // per slot: pieces an undone placement had revealed, served first (dealPiece)
const DEAL_QUEUE_MAX = 4;
let toolFirst = { swap: false, undo: false, deal: false };   // used this run (undo1 / deal1 fire on the first)
let swapZeroSent = false;          // swap0 sent this run
// display only: a fresh hand's pieces deal in, slot by slot
const TRAY_IN_MS = 260, TRAY_IN_STAGGER = 70;
let trayIn = [null, null, null];   // {t} ms since this slot's piece was dealt in (negative: waiting its turn)
function trayInK(i) {
  const a = trayIn[i];
  if (!a) return 1;
  const u = Math.max(0, Math.min(1, a.t / TRAY_IN_MS));
  return REDUCED ? u : 1 - Math.pow(1 - u, 3);
}

/* SEAM — a tool acted. how: 'charge' (it cost one), 'ad' (a rewarded ad paid),
   or 'free' (a swap the tutorial or the swap hint asked for). */
function toolUsed(kind, how) {
  fxToolUsed(kind, how);
  if (toolFirst[kind]) return;
  toolFirst[kind] = true;
  if (kind === 'undo') gameEvent('undo1');
  if (kind === 'deal') gameEvent('deal1');
}
// SEAM — the stock just reached 0 (the button now shows the offer, or goes quiet)
function toolRanOut(kind) {
  fxToolEmpty(kind);
  if (kind === 'swap' && !swapZeroSent) { swapZeroSent = true; gameEvent('swap0'); }
}
// SEAM — a press was refused: nothing to spend, nothing to act on, no ad to offer. Always returns false.
function toolDenied(kind) {
  toolShake[kind] = 1;
  sfx.thud();                                         // a soft thud and a shake of the head, never a harsh error
  const [bx, by] = toolBtnPos(kind);
  spawnBurst(bx, by, -1, 'deny');
  return false;
}
function spendTool(kind) {
  tools[kind] = Math.max(0, tools[kind] - 1);
  if (tools[kind] === 0) toolRanOut(kind);
}

// ---- swap: colour rotation costs a charge ----
// would a swap really change this piece? (two or more cells, two or more colours)
function swapChanges(piece) {
  return !!piece && !piece.merge && piece.cells.length > 1 && piece.cells.some(c => c.c !== piece.cells[0].c);
}
// the swaps the game itself asks for are free: the tutorial's run of guided steps, and the swap hint
function swapFree() { return hintOn || swapHintOn; }
/* The swap button (and the S key): every piece that can, swaps. One charge when
   at least one piece really changes; a hand with nothing to change costs
   nothing and behaves as it always did. At 0 the press offers a rewarded ad
   where one is installed (earned: +TOOL_AD.swap, nothing is rotated by the ad),
   and otherwise is refused. */
function swapHand() {
  if (state !== 'playing') return false;
  if (!tray.some(swapChanges)) return rotateAllColours();     // nothing would change: free, as before
  const free = swapFree();                                     // asked before the swap retires the hint
  if (!free && tools.swap <= 0) return canReward('swap') ? requestReward('swap') : toolDenied('swap');
  rotateAllColours();
  if (!free) spendTool('swap');
  toolUsed('swap', free ? 'free' : 'charge');
  return true;
}
/* A tap on a tray piece: the same swap for that one piece, the same charge. At
   0 it NEVER starts an ad — a tap on a tile is too easy to make by accident —
   it is refused, and the swap button flashes to show where the limit lives. */
function tapSwap(slot) {
  const piece = tray[slot];
  if (!piece || state !== 'playing') return false;
  if (!swapChanges(piece)) {                                   // nothing would change: free, as before
    if (!rotatePieceColours(slot)) return false;
    swapTaken();
    return true;
  }
  const free = swapFree();
  if (!free && tools.swap <= 0) {
    tapFlash[slot] = 1;
    toolFlash.swap = 1;
    toolDenied('swap');
    return false;
  }
  rotatePieceColours(slot);
  swapTaken();
  if (!free) spendTool('swap');
  toolUsed('swap', free ? 'free' : 'charge');
  return true;
}

// ---- undo: take back the last placement ----
function clonePiece(p) {
  if (!p) return null;
  const o = { cells: p.cells.map(c => ({ dq: c.dq, dr: c.dr, c: c.c })) };
  if (p.merge) o.merge = true;
  if (p.hidden) o.hidden = true;
  return o;
}
/* Everything the rules own, copied before a placement changes anything: the
   board, the hand, the score, the colour meters, the targets, the placement
   count, what is owed, and the swap and fresh-hand stocks (not the undo's own).
   `queued` is the payouts of EARLIER placements still in flight — they were
   earned before this one, so an undo settles them rather than losing them.
   `refs` is the hand's piece objects themselves, to tell afterwards which
   pieces the placement revealed. Event flags and high-water marks are NOT here:
   an undone, replayed placement never announces itself twice. */
function takeSnapshot() {
  return {
    board: [...board.values()].map(t => ({ q: t.q, r: t.r, c: t.c, v: t.v || 1, merged: !!t.merged })),
    tray: tray.map(clonePiece),
    refs: tray.slice(),
    score, placedCount, levelUps, goalsReached,
    colourLevel: colourLevel.slice(),
    colourFill: colourFill.slice(),
    owedMerges: owedMerges.slice(),
    tools: { swap: tools.swap, deal: tools.deal },
    queued: tally.filter(e => board.has(key(e.tile.q, e.tile.r))).map(e => [e.tile.q, e.tile.r]),
  };
}
function restoreSnapshot(s) {
  board = new Map();
  for (const t of s.board) {
    const tile = { q: t.q, r: t.r, c: t.c, v: t.v, vShow: t.v, shake: 0, born: 0, punch: 0 };
    if (t.merged) tile.merged = true;
    board.set(key(t.q, t.r), tile);
  }
  tray = s.tray.map(clonePiece);
  score = s.score; placedCount = s.placedCount; levelUps = s.levelUps; goalsReached = s.goalsReached;
  colourLevel = s.colourLevel.slice();
  colourFill = s.colourFill.slice();
  owedMerges = s.owedMerges.slice();
  tools.swap = s.tools.swap; tools.deal = s.tools.deal;
  // every in-flight visual queue goes, as in continueRun()
  pops = []; beams = []; pendingGrants = []; mergeAnim = [];
  reservedSlots = []; tally = []; shakeQueue = [];
  pendingOver = false; overAt = 0; failShake = 0;
  drag = null; snapBack = [null, null, null]; rotAnim = [null, null, null]; trayIn = [null, null, null];
  mergeHintSlot = -1; mergeHintCache = null;
  // payouts that were still in flight at the snapshot: earned before the undone placement, settled now
  for (const [q, r] of s.queued) { const t = board.get(key(q, r)); if (t) settleTile(t); }
  // a powerup still riding its beam is simply there; a slot held for one that never came is dealt
  for (let i = 0; i < 3; i++) {
    if (tray[i] === null) refillSlot(i);
    else if (tray[i].hidden) { tray[i].hidden = false; activateMergeHint(i); }
  }
  pendingGrants = [];
  // what the player reads snaps to the restored logic
  scoreShow = score; fillShow = colourFill.slice(); levelShow = colourLevel.slice();
  goalShow = goalsReached; goalHold = 0; goalTween = null; goalFill = goalFrac();
  scorePulse = 0; colourTick = [0, 0, 0];
  // the feedback layer's queues go with the rest: callouts, particles, the kick, charges in flight
  clearJuice(); goalFlash = 0; goalPulse = 0;
}
function canUndo() { return state === 'playing' && !hintOn && !!undoSnap; }
/* Take back the last placement (how: 'charge' | 'ad'). One level deep: the
   snapshot is spent, so there is no undo of an undo. The pieces the placement
   had revealed go back in their slots' queues, so placing again deals exactly
   them — an undo is never a re-roll. Returns false when there is nothing to
   take back. */
function undoLast(how) {
  if (!canUndo()) return false;
  const s = undoSnap;
  undoSnap = null;
  for (let i = 0; i < 3; i++) {
    const p = tray[i];
    if (p && !p.merge && p !== s.refs[i] && dealQueue[i].length < DEAL_QUEUE_MAX) dealQueue[i].unshift(clonePiece(p));
  }
  const back = [0, 1, 2].filter(i => tray[i] !== s.refs[i]);
  restoreSnapshot(s);
  // display only: the piece that was taken back is seen returning to its slot
  if (JUICE) for (const i of back) if (tray[i] && !trayIn[i]) trayIn[i] = { t: 0 };
  toolUsed('undo', how);
  return true;
}

// ---- fresh hand: new pieces ----
function canDeal() { return state === 'playing' && !hintOn && tray.some(p => p && !p.merge); }
/* Replace every ordinary piece in hand with a freshly dealt one (how: 'charge'
   | 'ad'). Merge powerups are kept, and a slot held empty for one stays held.
   The pieces come through dealPiece(), so the mercy rule still guarantees the
   new hand can move. Nothing survives it to be taken back: the undo snapshot
   and the no-re-roll queue are cleared. Returns false with nothing to replace. */
function dealHand(how) {
  if (!canDeal()) return false;
  undoSnap = null;
  dealQueue = [[], [], []];
  drag = null;
  const slots = [];
  for (let i = 0; i < 3; i++) if (tray[i] && !tray[i].merge) { slots.push(i); tray[i] = null; }
  slots.forEach((i, n) => {
    tray[i] = dealPiece(i);
    rotAnim[i] = null; snapBack[i] = null; tapFlash[i] = 0;
    trayIn[i] = { t: -n * TRAY_IN_STAGGER };          // dealt in, not popped
  });
  if (anyMoveLeft()) pendingOver = false;             // a hand that was stuck is not any more
  toolUsed('deal', how);
  return true;
}

/* A tool button was pressed (or its key: S, U, N). Returns true when the press
   did something — acted, or started a rewarded ad. With a charge and something
   to act on: act, charge -1. With no charge, something to act on and an ad
   installed: ask for the ad (for undo and the fresh hand the ad IS the action).
   Anything else is refused. Never outside play: not on the menu (paused), not
   when the run is over. */
function useTool(kind) {
  if (state !== 'playing' || !TOOL_KINDS.includes(kind)) return false;
  if (kind === 'swap') return swapHand();
  if (!toolPossible(kind)) return toolDenied(kind);
  if (tools[kind] > 0) {
    spendTool(kind);
    if (kind === 'undo') undoLast('charge'); else dealHand('charge');
    return true;
  }
  return canReward(kind) ? requestReward(kind) : toolDenied(kind);
}

function drop() {
  if (!drag) return;
  const d = drag;
  drag = null;
  if (state !== 'playing' || tray[d.slot] !== d.piece) return;
  if (d.moved < TAP_SLOP) {          // a tap: recolour the piece, don't place it
    // a tap never skips a tutorial step; a swap that happened counts as learned
    tapSwap(d.slot);
    return;
  }
  if (d.hover) { place(d.slot, d.hover[0], d.hover[1]); return; }
  sfx.deny();
  // the refusal bursts in the colour of the cell held (ANALYSIS UI #10)
  const held = d.piece.cells.find(c => c.dq === d.grabDq && c.dr === d.grabDr) || d.piece.cells[0];
  spawnBurst(d.x, d.y - S * DRAG_LIFT, held.c, 'deny');
  snapBack[d.slot] = { x: d.x, y: d.y - S * DRAG_LIFT, grabDq: d.grabDq, grabDr: d.grabDr, t: 0, dur: SNAPBACK_MS };
}

// ---------- audio ----------
let audio = null, muted = false;
/* v2 (ANALYSIS UI #13): touch had no way to mute. The speaker button and the
   M key both go through setMuted() — the ONE place a player's choice writes
   `muted` and is remembered ('scraps-mute'). Audio only ever resumes through
   ac(), inside the tap that unmuted it. (A portal adapter may force `muted`
   during an ad and restore it; that never passes through here, so it is never
   saved.) */
function setMuted(on) {
  muted = !!on;
  try { localStorage.setItem('scraps-mute', muted ? '1' : '0'); } catch (e) {}
  if (!muted) ac();
  syncMuteButton();
}
function loadMute() {
  try { muted = localStorage.getItem('scraps-mute') === '1'; } catch (e) {}
}
function ac() {
  if (!audio) {
    const AC = (typeof AudioContext !== 'undefined' && AudioContext) ||
               (typeof webkitAudioContext !== 'undefined' && webkitAudioContext);
    if (!AC) return null;
    audio = new AC();
  }
  if (audio.state === 'suspended') audio.resume().catch(() => {});
  return audio;
}
function blip(freq, dur, type, vol, delay) {
  const a = ac(); if (!a || muted) return;
  const t = a.currentTime + (delay || 0);
  const o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g); g.connect(a.destination);
  o.start(t); o.stop(t + dur);
}
// v3: the chord tones of the payout scale (C major), low to high — a tier's chord climbs them
const CHORD = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1568, 2093];
const sfx = {
  lift() { blip(520, 0.05, 'sine', 0.04); },
  // v3: a piece lands — a soft body under the drop, lower and fuller the bigger the piece
  land(n) {
    const k = Math.max(1, Math.min(3, n || 1));
    blip(168 - k * 22, 0.08 + k * 0.02, 'sine', 0.04 + k * 0.009);
    blip(84 - k * 6, 0.1 + k * 0.02, 'sine', 0.03 + k * 0.006, 0.005);
  },
  /* v3: a group finished paying. The chord rises through the scale's chord tones
     and grows with the tier (1 note for a small group in a multi-group move, then
     2, 3, 4); `step` moves the whole chord up an inversion for the 2nd and 3rd
     group of one placement, so a double and a triple climb. */
  tier(tier, step) {
    const s0 = Math.max(0, Math.min(2, step | 0)), n = Math.max(0, Math.min(3, tier | 0)) + 1;
    const vol = 0.036 + n * 0.004;
    for (let j = 0; j < n; j++) blip(CHORD[s0 + j], 0.13 + j * 0.035, 'sine', vol, j * 0.055);
    if (n >= 3) blip(CHORD[s0] / 2, 0.24, 'triangle', 0.03);                 // a body under a big one
    if (n >= 4) {
      blip(CHORD[s0 + 3] * 2, 0.2, 'sine', 0.014, 0.2);                       // shimmer over the top note
      blip(130.81, 0.3, 'sine', 0.06);                                        // and the floor under a huge one
    }
  },
  // v3: a merge has swallowed its last tile — low and round, a fifth over it
  mergeDone(tier) {
    blip(130.81, 0.34, 'sine', 0.07);
    blip(196, 0.26, 'sine', 0.045, 0.03);
    blip(261.63, 0.22, 'triangle', 0.035, 0.06);
    if (tier >= 2) blip(523.25, 0.2, 'sine', 0.03, 0.1);
  },
  // v3: a tool charge or a powerup arrived
  charge() { blip(880, 0.07, 'sine', 0.04); blip(1318.5, 0.12, 'sine', 0.04, 0.06); },
  // v3: a new best — a quick rising flourish
  best() {
    blip(783.99, 0.08, 'sine', 0.05);
    blip(1046.5, 0.08, 'sine', 0.05, 0.07);
    blip(1318.5, 0.1, 'sine', 0.05, 0.14);
    blip(1568, 0.26, 'sine', 0.05, 0.21);
    blip(3136, 0.16, 'sine', 0.012, 0.23);
  },
  // v3: undo — the rotate's two notes played backwards and down, a small rewind
  undo() { blip(587, 0.06, 'triangle', 0.05); blip(440, 0.06, 'triangle', 0.048, 0.055); blip(330, 0.1, 'triangle', 0.045, 0.11); },
  // v3: a fresh hand — three quick flicks rising, one per slot as the pieces deal in
  deal() { blip(392, 0.05, 'triangle', 0.045); blip(494, 0.05, 'triangle', 0.045, 0.07); blip(587, 0.08, 'triangle', 0.045, 0.14); },
  // v3: a refused tool — one soft low thud
  thud() { blip(150, 0.09, 'sine', 0.05); blip(96, 0.12, 'sine', 0.045, 0.01); },
  // v3: a stock just ran out — a small falling two-note, quieter than any reward, after the tool's own sound has finished
  empty() { blip(392, 0.07, 'sine', 0.03, 0.26); blip(294, 0.12, 'sine', 0.03, 0.33); },
  rotate() { blip(392, 0.06, 'triangle', 0.05); blip(587, 0.07, 'triangle', 0.045, 0.05); },
  drop() {
    blip(300, 0.07, 'sine', 0.05);
    blip(120, 0.09, 'sine', 0.045);            // low body under the tone: a thunk, not a click
  },
  deny() {
    blip(220, 0.06, 'square', 0.035);
    blip(140, 0.09, 'square', 0.032, 0.05);    // two-note "uh-uh" instead of one blip
  },
  shake() { blip(196, 0.16, 'triangle', 0.045); },
  // one per swallowed tile, pitch climbing with the chain so a big merge
  // builds instead of repeating the same note
  whoosh(i, delay) {
    const f = 240 + Math.min(i, 14) * 46;
    blip(f, 0.13, 'sine', 0.038, delay);
    blip(f * 1.5, 0.09, 'triangle', 0.018, delay + 0.02);
  },
  tick(i) {
    const notes = [523, 587, 659, 698, 784, 880, 988, 1046, 1175, 1318, 1397, 1568];   // v3: two more steps for long groups
    const f = notes[Math.min(i, notes.length - 1)];
    blip(f, 0.1, 'sine', 0.05);
    blip(f * 2, 0.05, 'sine', 0.016, 0.015);   // faint octave shimmer, coin sparkle
  },
  levelUp() {
    blip(659, 0.1, 'sine', 0.06);
    blip(988, 0.14, 'sine', 0.055, 0.08);
    blip(1318, 0.18, 'sine', 0.05, 0.16);      // top sparkle note — a real celebration beat
  },
  // a target reached: a longer rising chime than a level-up, ending on a held top note
  goal() {
    blip(523, 0.12, 'sine', 0.06);
    blip(659, 0.12, 'sine', 0.06, 0.09);
    blip(784, 0.14, 'sine', 0.06, 0.18);
    blip(1046, 0.34, 'sine', 0.062, 0.27);
    blip(2093, 0.22, 'sine', 0.018, 0.29);     // faint octave shimmer over the top note
    // v3: the fanfare — the held top note gets its chord and a floor, then a bright tag over it
    blip(261.63, 0.5, 'triangle', 0.04, 0.27);
    blip(659.25, 0.3, 'sine', 0.03, 0.27);
    blip(783.99, 0.3, 'sine', 0.03, 0.27);
    blip(1318.5, 0.1, 'sine', 0.035, 0.46);
    blip(1568, 0.1, 'sine', 0.035, 0.54);
    blip(2093, 0.3, 'sine', 0.035, 0.62);
  },
  over() {
    blip(392, 0.18, 'sine', 0.06);
    blip(330, 0.22, 'sine', 0.055, 0.15);
    blip(261, 0.55, 'sine', 0.06, 0.32);       // descending cadence: the run lands, not fizzles
  },
};

// ---------- drawing ----------
function hexPath(x, y, s) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 180 * (60 * i);   // flat-top tile
    const px = x + s * Math.cos(a), py = y + s * Math.sin(a);
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

// one tile, in whichever dress the theme calls for
/* ---------- elemental symbols ----------
   0 flame (red), 1 droplet (blue), 2 leaf (green). The associations are
   automatic — fire is red, water is blue, a leaf is green — so the symbol
   reinforces the colour instead of competing with it, and the silhouettes stay
   distinct at tray size: asymmetric and pointed, symmetric teardrop, angled
   lens with a vein. It also makes red-and-green a safe pair, which it normally
   is not. `merge` is the powerup's recycle mark. */
// kept as the fallback if a theme ever omits its own set
const SYMBOLS = ['flame', 'drop', 'leaf'];


/* The demo loops on a fixed cycle: hold at the tray, travel, press, lift.
   It is drawn, not simulated — it never touches game state, so a player who
   starts dragging mid-demo is never fighting it. */
const HINT_CYCLE = 2600;
const HINT_MERGE_STEP = 3;   // steps 0-2 place, step 3 is the free merge (v2; v1's step 3 was the swap)

// a one-cell piece refuses to rotate, so the lesson must point at a slot that
// will actually respond to a tap
function hintTapSlot() {
  for (let i = 0; i < 3; i++) if (tray[i] && tray[i].cells.length > 1) return i;
  return -1;
}

/* The last lesson: the colour-swap control. It points at the ROTATE BUTTON
   rather than at a tray piece — the button is the explicit affordance, and a
   dot pressing a real control teaches a gesture the player can repeat, where a
   dot pressing a tile taught an invisible one.
   Drawn as a press in place, deliberately unlike step one's travelling drag so
   the two gestures never blur. Wordless: the button pulses underneath it, and
   the swap it performs is visible the moment it fires. */
function drawTapHint() {
  // nothing in hand can rotate, so there is no lesson to demonstrate
  if (hintTapSlot() === -1) return;
  const t = (hintClock % 1500) / 1500;
  const press = t < 0.5 ? Math.sin(t * Math.PI * 2) : 0;
  const [sx, sy] = rotateBtnPos();
  const R0 = 26;                          // the button's own hit radius

  ctx.save();
  const ring = 0.5 + 0.5 * Math.sin(hintClock * 0.008);
  ctx.globalAlpha = Math.min(1, 0.30 + ring * 0.30);
  ctx.strokeStyle = T.ink;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(sx, sy, R0 * (1.18 + ring * 0.20), 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = 0.92;
  const rr = R0 * (0.42 - press * 0.10);
  ctx.beginPath();
  ctx.arc(sx, sy, rr, 0, Math.PI * 2);
  ctx.fillStyle = T.style === 'wire' ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.78)';
  ctx.fill();
  ctx.lineWidth = 2.2;
  ctx.strokeStyle = T.ink;
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.restore();
}

/* Where the guided drag should drop this piece. On an empty board it aims at
   the middle; after that it INSISTS on an anchor whose cells touch something
   already placed — that requirement is the entire lesson of steps two and
   three — and among those prefers the spot touching the most same-colour
   tiles, so the demonstrated move visibly scores instead of just landing. */
function hintTarget(piece) {
  let best = null, bestScore = -Infinity;
  for (const [q, r] of CELLS) {
    if (!canPlace(piece, q, r)) continue;
    let touch = 0, same = 0, dist = 0;
    for (const c of piece.cells) {
      const cq = q + c.dq, cr = r + c.dr;
      dist += (Math.abs(cq) + Math.abs(cr) + Math.abs(cq + cr)) / 2;
      for (const [dq, dr] of DIRS) {
        const nb = board.get(key(cq + dq, cr + dr));
        if (!nb) continue;
        touch++;
        if (nb.c === c.c) same++;
      }
    }
    if (board.size > 0 && touch === 0) continue;
    const s = same * 10 + touch - dist / piece.cells.length;   // dist only breaks ties
    if (s > bestScore) { bestScore = s; best = [q, r]; }
  }
  return best;
}

/* The demonstrated drag, as the finger would really perform it (v2 Q2). v1
   ended the dot ON the target, but a real drag carries the piece DRAG_LIFT
   above the finger, so a player who copied it landed a cell high or was
   refused. Now the dot presses the cell of the piece a real pickUp() would
   grab (the one nearest the slot centre, first on a tie, same rule), and
   travels to one lift BELOW that cell's target — releasing there lands exactly
   on the target. Pure: shared by the draw and the tests. */
function dragHintPath(slot) {
  const piece = tray[slot];
  if (!piece) return null;
  const anchor = hintTarget(piece);
  if (!anchor) return null;
  const [cx, cy] = traySlotPos(slot);
  let grab = piece.cells[0], bd = Infinity;
  for (const c of piece.cells) {
    const [x, y] = trayCellPos(piece, c, slot);
    const d = Math.hypot(x - cx, y - cy);
    if (d < bd) { bd = d; grab = c; }
  }
  const [sx, sy] = trayCellPos(piece, grab, slot);
  const [gx, gy] = boardPix(anchor[0] + grab.dq, anchor[1] + grab.dr);
  return { piece, anchor, grab, sx, sy, tx: gx, ty: gy + S * DRAG_LIFT };
}

function drawDragHint() {
  const slot = Math.min(hintStep, 2);
  const path = dragHintPath(slot);
  if (!path) return;
  const { piece, anchor, grab, sx, sy, tx, ty } = path;
  const t = (hintClock % HINT_CYCLE) / HINT_CYCLE;

  let k, press;
  if (t < 0.16) { k = 0; press = t / 0.16; }            // settle onto the piece
  else if (t < 0.66) { const u = (t - 0.16) / 0.50; k = u * u * (3 - 2 * u); press = 1; }
  else if (t < 0.80) { k = 1; press = 1; }              // hold on target
  else { k = 1; press = 1 - (t - 0.80) / 0.20; }        // lift away

  // one parametric path, sampled for both the dot and the trail behind it, so
  // the dashes cannot drift off the route the finger actually takes
  const at = (u) => [
    sx + (tx - sx) * u,
    sy + (ty - sy) * u - Math.sin(u * Math.PI) * 26 * MOTION,
  ];
  const [x, y] = at(k);

  ctx.save();

  // target cell pulse, so the destination reads before the finger arrives
  const pulse = 0.5 + 0.5 * Math.sin(hintClock * 0.006);
  ctx.globalAlpha = 0.30 + pulse * 0.28;
  ctx.strokeStyle = T.colors[piece.cells[0].c];
  ctx.lineWidth = Math.max(2, S * 0.10);
  for (const c of piece.cells) {
    const [px, py] = boardPix(anchor[0] + c.dq, anchor[1] + c.dr);
    hexPath(px, py, S * (0.80 + pulse * 0.10));
    ctx.stroke();
  }

  /* Dashed trail from the slot to wherever the dot has got to. Drawn only as
     far as k, so it grows with the drag and reads as a route being taken
     rather than a static line between two places. */
  if (k > 0.02) {
    ctx.globalAlpha = 0.34 + pulse * 0.16;
    ctx.strokeStyle = T.ink;
    ctx.lineWidth = Math.max(1.5, S * 0.07);
    ctx.lineCap = 'round';
    if (ctx.setLineDash) ctx.setLineDash([Math.max(3, S * 0.16), Math.max(4, S * 0.24)]);
    ctx.beginPath();
    const steps = 22;
    for (let i = 0; i <= steps; i++) {
      const [px, py] = at((i / steps) * k);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    if (ctx.setLineDash) ctx.setLineDash([]);
  }

  // ghost of the piece riding one lift above the touch, exactly as a real drag
  // draws the piece in hand — at the end of the path it sits on the target
  ctx.globalAlpha = 0.34 * press;
  for (const c of piece.cells) {
    const [cx, cy] = liftedCellPos(x, y, c, grab.dq, grab.dr);
    drawTile(cx, cy, S, c.c, { dragging: true, merge: !!piece.merge });
  }

  // the touch dot itself
  ctx.globalAlpha = 0.9;
  const rr = S * (0.34 - press * 0.06);
  ctx.beginPath();
  ctx.arc(x, y, rr, 0, Math.PI * 2);
  ctx.fillStyle = T.style === 'wire' ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.75)';
  ctx.fill();
  ctx.lineWidth = Math.max(2, S * 0.09);
  ctx.strokeStyle = T.ink;
  ctx.stroke();

  /* No caption. The demonstration IS the lesson: the dot travels from a real
     tray slot to a real legal cell, and hintTarget() insists that cell touch
     what is already down and prefers the most same-colour contact — so the
     move it shows visibly pays, and the flying +N says "bigger groups score
     more" without a sentence saying it. */
  ctx.globalAlpha = 1;
  ctx.textAlign = 'left';
  ctx.restore();
}

/* The merge lesson's demonstrated drag, as the finger really performs it —
   the same fix as dragHintPath (v2 Q2): the dot starts on the powerup (a single
   cell, so its slot centre) and ends one DRAG_LIFT below the target, so a
   player who copies it drops the powerup exactly there. Pure. */
function mergeGuidePath() {
  const target = mergeGuideTarget();
  if (!target) return null;
  const slot = mergeHintSlot;
  const [sx, sy] = traySlotPos(slot);
  const [gx, gy] = boardPix(target[0], target[1]);
  return { slot, target, ci: tray[slot].cells[0].c, sx, sy, gx, gy, tx: gx, ty: gy + S * DRAG_LIFT };
}

/* The merge-powerup lesson: same wordless choreography as drawDragHint — one
   parametric path sampled for both the travelling dot and the dashed trail
   behind it (they can never drift apart), the destination pulsing before the
   dot arrives. The destination is mergeHint()'s best-value cell, recomputed
   only when the board changes (placedCount), not per frame. Deliberately NO
   group outline at the target — that border was removed at the user's request
   the same day this lesson was added; the pulsing cell is the whole signpost. */
function drawMergeGuide() {
  const path = mergeGuidePath();
  if (!path) return;                         // no lesson, or nowhere legal: nothing to teach
  const { slot, sx, sy, gx, gy, tx, ty } = path;
  const piece = tray[slot];
  // v2: the lesson is spent only now that it is really on screen — and the
  // tutorial's free merge is its own step, not one of the run's two lessons
  if (!mergeHintSeen) {
    mergeHintSeen = true;
    if (!(hintOn && slot === tutMergeSlot)) mergeHintUsed++;
  }

  const ci = piece.cells[0].c;
  const t = (mergeHintClock % HINT_CYCLE) / HINT_CYCLE;

  let k, press;
  if (t < 0.16) { k = 0; press = t / 0.16; }
  else if (t < 0.66) { const u = (t - 0.16) / 0.50; k = u * u * (3 - 2 * u); press = 1; }
  else if (t < 0.80) { k = 1; press = 1; }
  else { k = 1; press = 1 - (t - 0.80) / 0.20; }

  const at = (u) => [
    sx + (tx - sx) * u,
    sy + (ty - sy) * u - Math.sin(u * Math.PI) * 26 * MOTION,
  ];
  const [x, y] = at(k);

  ctx.save();

  // destination pulse, in the powerup's own colour
  const pulse = 0.5 + 0.5 * Math.sin(mergeHintClock * 0.006);
  ctx.globalAlpha = 0.30 + pulse * 0.28;
  ctx.strokeStyle = T.colors[ci];
  ctx.lineWidth = Math.max(2, S * 0.10);
  hexPath(gx, gy, S * (0.80 + pulse * 0.10));
  ctx.stroke();

  if (k > 0.02) {
    ctx.globalAlpha = 0.34 + pulse * 0.16;
    ctx.strokeStyle = T.ink;
    ctx.lineWidth = Math.max(1.5, S * 0.07);
    ctx.lineCap = 'round';
    if (ctx.setLineDash) ctx.setLineDash([Math.max(3, S * 0.16), Math.max(4, S * 0.24)]);
    ctx.beginPath();
    const steps = 22;
    for (let i = 0; i <= steps; i++) {
      const [px, py] = at((i / steps) * k);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    if (ctx.setLineDash) ctx.setLineDash([]);
  }

  // ghost of the powerup one lift above the touch, as a real drag carries it
  ctx.globalAlpha = 0.34 * press;
  const [hx, hy] = liftedCellPos(x, y, piece.cells[0], 0, 0);
  drawTile(hx, hy, S, ci, { merge: true, dragging: true });

  // the touch dot
  ctx.globalAlpha = 0.9;
  const rr = S * (0.34 - press * 0.06);
  ctx.beginPath();
  ctx.arc(x, y, rr, 0, Math.PI * 2);
  ctx.fillStyle = T.style === 'wire' ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.75)';
  ctx.fill();
  ctx.lineWidth = Math.max(2, S * 0.09);
  ctx.strokeStyle = T.ink;
  ctx.stroke();

  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawGlyph(kind, x, y, r, ink) {
  ctx.save();
  ctx.fillStyle = ink;
  ctx.strokeStyle = ink;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  if (kind === 'flame') {
    // leans and kinks on one side, and its base is notched: a teardrop with a
    // twist, so it never reads as the droplet
    ctx.beginPath();
    ctx.moveTo(x + r * 0.10, y - r * 1.02);
    ctx.bezierCurveTo(x + r * 0.92, y - r * 0.18, x + r * 0.60, y + r * 0.92, x, y + r * 0.98);
    ctx.bezierCurveTo(x - r * 0.66, y + r * 0.92, x - r * 0.86, y + r * 0.10, x - r * 0.28, y - r * 0.44);
    ctx.bezierCurveTo(x - r * 0.20, y - r * 0.02, x - r * 0.02, y - r * 0.10, x + r * 0.02, y - r * 0.34);
    ctx.bezierCurveTo(x + r * 0.06, y - r * 0.62, x - r * 0.06, y - r * 0.82, x + r * 0.10, y - r * 1.02);
    ctx.closePath();
    ctx.fill();
  } else if (kind === 'drop') {
    // perfectly symmetric: a round belly under a straight point
    ctx.beginPath();
    ctx.moveTo(x, y - r * 1.02);
    ctx.bezierCurveTo(x + r * 0.78, y - r * 0.10, x + r * 0.70, y + r * 0.98, x, y + r * 0.98);
    ctx.bezierCurveTo(x - r * 0.70, y + r * 0.98, x - r * 0.78, y - r * 0.10, x, y - r * 1.02);
    ctx.closePath();
    ctx.fill();
  } else if (kind === 'leaf') {
    // an angled lens plus a vein — the diagonal alone separates it from the
    // two upright shapes even before the vein is legible
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(0, -r * 1.04);
    ctx.bezierCurveTo(r * 0.86, -r * 0.34, r * 0.72, r * 0.52, 0, r * 1.04);
    ctx.bezierCurveTo(-r * 0.72, r * 0.52, -r * 0.86, -r * 0.34, 0, -r * 1.04);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    } else if (kind === 'moon') {
    /* Full disc with a reverse-wound disc punched out. Arc-to-arc crescents
       left a sliver that read as a letter C at tray size. */
    ctx.beginPath();
    ctx.arc(x - r * 0.10, y, r, 0, Math.PI * 2, false);
    ctx.arc(x + r * 0.42, y, r * 0.86, 0, Math.PI * 2, true);
    ctx.fill();
  } else if (kind === 'sun') {
    ctx.beginPath();
    ctx.arc(x, y, r * 0.54, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = Math.max(1.2, r * 0.19);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * r * 0.76, y + Math.sin(a) * r * 0.76);
      ctx.lineTo(x + Math.cos(a) * r * 1.04, y + Math.sin(a) * r * 1.04);
      ctx.stroke();
    }
  } else if (kind === 'star') {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i / 10) * Math.PI * 2;
      const rad = i % 2 === 0 ? r : r * 0.44;
      const px = x + Math.cos(a) * rad, py = y + Math.sin(a) * rad;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  } else if (kind === 'merge') {
    /* Three fat arrows pointing INWARD at a solid core. The mechanic is
       "everything nearby gets pulled into this tile", and arrows-converging
       says that directly; the earlier recycle ring turned to mush at tray
       size because three curved arcs plus heads is far too much detail for
       ~10 device pixels. */
    ctx.beginPath();
    ctx.arc(x, y, r * 0.30, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 3; i++) {
      const a = -Math.PI / 2 + (i / 3) * Math.PI * 2;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(a);
      // stem
      ctx.lineWidth = Math.max(1.8, r * 0.30);
      ctx.beginPath();
      ctx.moveTo(0, -r * 1.02);
      ctx.lineTo(0, -r * 0.74);
      ctx.stroke();
      // head, apex toward the core
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.34);
      ctx.lineTo(-r * 0.50, -r * 0.88);
      ctx.lineTo(r * 0.50, -r * 0.88);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }
  ctx.restore();
}

function drawTile(x, y, s, ci, opts) {
  const o = opts || {};
  if (T.skin && T.skin.tile) { drawSkinTile(x, y, s, ci, o); return; }   // v3: a painted theme's own tile
  drawTileBody(x, y, s, ci, o);
  // face: a merged tile shows what it is worth, everything else its symbol
  const ink = T.style === 'wire' ? T.colors[ci] : '#fff8f0';
  if (o.merge) drawGlyph('merge', x, y, s * 0.60, ink);
  else if (o.valued || (o.v || 1) > 1) drawValue(x, y, s, o.v || 1, ink);
  else drawGlyph((T.symbols || SYMBOLS)[ci], x, y, s * 0.46, ink);
}

function drawValue(x, y, s, v, ink) {
  const size = Math.round(s * 0.86);
  ctx.save();
  ctx.font = (T.mono ? `700 ${size}px ui-monospace, Menlo, monospace`
                     : `800 ${size}px ${T.font || '"Avenir Next", sans-serif'}`);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (T.valueStroke) {                       // v3: a rim so the number reads on a busy painted tile
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(2, size * 0.2);
    ctx.strokeStyle = T.valueStroke;
    ctx.strokeText(String(v), x, y + s * 0.02);
  }
  ctx.fillStyle = ink;
  ctx.fillText(String(v), x, y + s * 0.02);
  ctx.restore();
}

let TILE_ALPHA = 1;        // display-only fade (game over dims the dead hand)
function drawTileBody(x, y, s, ci, opts) {
  const o = opts || {};
  const col = T.colors[ci];
  if (T.style === 'wire') {
    hexPath(x, y, s * 0.9);
    ctx.fillStyle = col + (o.matched ? '55' : '22');
    ctx.fill();
    ctx.strokeStyle = col;
    ctx.lineWidth = Math.max(1.6, s * 0.11);
    ctx.shadowColor = col;
    ctx.shadowBlur = (o.matched ? 1.0 : 0.45) * s;
    ctx.stroke();
    ctx.shadowBlur = 0;
    return;
  }
  // cut paper: matte card, soft shadow, a degree or two off-square
  const rot = ((Math.round(x * 3) * 13 + Math.round(y * 3) * 7) % 7 - 3) * 0.012;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  if (!o.ghost) {
    ctx.globalAlpha = (o.dragging ? 0.28 : 0.17) * TILE_ALPHA;
    hexPath(o.dragging ? s * 0.22 : s * 0.06, o.dragging ? s * 0.3 : s * 0.11, s * 0.9);
    ctx.fillStyle = '#4a3a20';
    ctx.fill();
    ctx.globalAlpha = TILE_ALPHA;
  }
  hexPath(0, 0, s * 0.9);
  ctx.fillStyle = col;
  if (o.ghost) ctx.globalAlpha = 0.4;
  ctx.fill();
  ctx.globalAlpha = TILE_ALPHA;
  // torn-paper highlight along the top edge
  ctx.save();
  ctx.clip();
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.fillRect(-s, -s, s * 2, s * 0.45);
  ctx.restore();
  /* an ink outline (the look's tileOutline, about a tenth of a tile): the tile reads as a cut-out on any ground, in greyscale too.
     A look with no tileOutline draws no line, exactly as before. */
  if (T.tileOutline) {
    hexPath(0, 0, s * 0.9);
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(1.5, s * (T.tileOutlineW || 0.1));
    ctx.strokeStyle = T.tileOutline;
    if (o.ghost) ctx.globalAlpha = 0.4;
    ctx.stroke();
    ctx.globalAlpha = TILE_ALPHA;
  }
  ctx.restore();
}

let shakeClock = 0;
let dealClock = 99999;     // ms since the board was dealt in (newGame resets it)

/* Score labels fly to the meter they feed. Storing the destination at spawn
   time (rather than resolving it while drawing) keeps the arc stable even if
   the layout reflows mid-flight. */
/* v2 (ANALYSIS UI #11), the parts that keep the user's per-tile delivery (one
   +1 per paid tile, the label IS the payout — deliberately not one +N per
   group): a label fades faster as it lands, and ducks while it crosses a
   meter's "fill/target" caption so that text is never buried under flying
   digits. It still lands on the ring's centre, above its caption. */
function popAlpha(p, k, lx, ly) {
  let a = Math.min(1, p.t / 0.12) * (1 - k * k * 0.8);
  for (let i = 0; i < T.colors.length; i++) {
    const [cx, cy] = hudRingPos(i);
    if (Math.abs(ly - (cy + RING_R + 10)) < 10 && Math.abs(lx - cx) < 26) { a *= 0.25; break; }
  }
  return a;
}

function pushPop(q, r, n, ci) {
  const [sx, sy] = boardPix(q, r);
  const [tx, ty] = hudRingPos(ci);
  pops.push({
    sx, sy, tx, ty, n, c: ci, t: 0,
    // sideways bow so several labels in flight don't overlap into one blob
    bow: (Math.sin(q * 3.1 + r * 5.3) * 0.5 + 0.5) * 44 - 22,
    landed: false,
  });
}

/* HUD geometry is set by layout() (HUD_SCORE_Y, HUD_RING_Y, RING_R), so what
   layout reserves and what drawHud paints can never drift apart. */
function hudRingR() { return RING_R; }
function hudCaptionBottom() { return HUD_RING_Y + RING_R + 17; }

function hudRingPos(i) {
  if (LANDSCAPE) {
    // stacked under the score in the left column, right next to the board
    const top = HUD_METER_TOP, bottom = H - 8;
    const h = (bottom - top) / T.colors.length;
    return [HUD_COL - RING_R - 14, top + h * (i + 0.5) - 3];
  }
  const spacing = Math.min((TRAY_X1 - TRAY_X0) / 3, 124);
  return [BX + (i - 1) * spacing, HUD_RING_Y];
}
// the reward mark rides the ring at twelve o'clock, where the arc completes
function hudRewardPos(i) {
  const [x, y] = hudRingPos(i);
  return [x, y - RING_R];
}

const GOLD = '#d7a332';
// the score's size (before its payout bump and before shrink-to-fit), in both layouts
function hudScoreBase() {
  if (LANDSCAPE) return Math.min(40, HUD_COL / 4.6);
  return Math.round(Math.max(32, Math.min(44, RING_R * 1.75)) * (T.mono ? 0.9 : 1));
}

function hudFont(weight, size) {
  return T.mono ? `${Math.min(weight, 700)} ${size}px ui-monospace, Menlo, monospace`
                : `${weight} ${size}px ${T.font || '"Avenir Next", "Helvetica Neue", sans-serif'}`;
}
// a string's width in a font; the test stub has no metrics, so estimate there
// (digits 0.56 em, separators narrower; a monospace face is 0.6 em throughout)
function textWidth(text, font) {
  ctx.font = font;
  const m = ctx.measureText && ctx.measureText(text);
  if (m && typeof m.width === 'number') return m.width;
  const px = parseFloat(/(\d+(?:\.\d+)?)px/.exec(font)[1]);
  let em = 0;
  for (const ch of text) em += T.mono ? 0.6 : (ch === ',' || ch === ' ' ? 0.26 : ch === '/' ? 0.34 : 0.56);
  return em * px;
}

/* The score line (user 2026-09-26: "very cluttered. just have 0/5,000. dont show
   highscore - and have the bar below it"): ONE line, "score / target", left-
   aligned over the target bar. The displayed score (scoreShow, so it counts up
   as the labels land, the payout pulse on it) is big and bold; " / target" is
   smaller and muted on the same baseline. The line is sized from hudScoreBase
   and shrunk only as far as the WIDEST line it may have to show ("12,345 /
   15,000", or the current one if wider) needs to fit — before the theme and
   mute buttons in portrait, inside the HUD column in landscape — and that size
   is cached per label and layout, so it never changes from one score to the
   next. The best score lives on the menu and the game-over plaque only. */
let scoreLineCache = null;
function hudScoreLine() {
  const label = goalLabel(), cut = label.indexOf(' / ');
  const big = label.slice(0, cut), small = label.slice(cut);
  const base = hudScoreBase();
  const x = LANDSCAPE ? 8 : TRAY_X0 + 12;
  const limit = LANDSCAPE ? HUD_COL - 4 : W - TRAY_X0 - (THEME_LOCK ? 56 : 108);   // the mute button's left edge, less a gap
  const cacheKey = [big.length, small, base, x, limit, themeName].join('|');
  if (!scoreLineCache || scoreLineCache.key !== cacheKey) {
    let size = Math.round(base), smallSize, bigW, width;
    for (;;) {
      smallSize = Math.max(10, Math.round(size * 0.52));
      bigW = textWidth(big, hudFont(800, size));
      const widest = Math.max(bigW, textWidth('12,345', hudFont(800, size)));
      const smallW = textWidth(small.length > 9 ? small : ' / 15,000', hudFont(700, smallSize));
      width = widest + size * 0.12 + smallW;
      if (x + width <= limit || size <= 12) break;   // 12 px is the floor: below it nothing reads anyway
      size--;
    }
    scoreLineCache = { key: cacheKey, size, smallSize, bigW, gap: size * 0.12,
      width: bigW + size * 0.12 + textWidth(small, hudFont(700, smallSize)) };
  }
  const c = scoreLineCache;
  return { big, small, x, y: HUD_SCORE_Y, size: c.size, smallSize: c.smallSize, bigW: c.bigW, width: c.width, limit,
    drawSize: Math.round(c.size * (1 + scorePulse * 0.12 * MOTION)),   // the payout pulse, on the number only
    smallX: x + c.bigW + c.gap, smallY: HUD_SCORE_Y + (c.size - c.smallSize) * 0.36 };   // same baseline
}

function drawHud() {
  // ---- one line: the displayed score, big, then " / target" small and muted on the same baseline ----
  const L = hudScoreLine();
  ctx.save();
  ctx.textBaseline = 'middle';
  ctx.fillStyle = T.hudInk || T.ink;                 // a look whose line sits on a dark desk, not on a card, has its own (light) ink
  if (T.style === 'wire') { ctx.shadowColor = T.ink; ctx.shadowBlur = 8; }
  ctx.font = hudFont(800, L.drawSize);
  ctx.textAlign = 'center';                          // the pulse grows about the number's own centre
  ctx.fillText(L.big, L.x + L.bigW / 2, L.y);
  ctx.shadowBlur = 0;
  if (bestGlow > 0) {                                // v3: a new best — the number itself goes gold for a breath
    ctx.globalAlpha = Math.min(1, bestGlow * 2.2);
    ctx.fillStyle = GOLD;
    ctx.fillText(L.big, L.x + L.bigW / 2, L.y);
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = T.hudInkSoft || T.inkSoft;
  ctx.font = hudFont(700, L.smallSize);
  ctx.textAlign = 'left';
  ctx.fillText(L.small, L.smallX, L.smallY);
  ctx.restore();

  drawGoalBar();

  // ---- one meter per colour: symbol-led ring, reward on top, level badge ----
  const n = T.colors.length;
  const r = RING_R;
  for (let i = 0; i < n; i++) {
    const [cx, cy] = hudRingPos(i);
    const target = levelTarget(levelShow[i]);
    const frac = Math.max(0, Math.min(1, fillShow[i] / target));
    const flash = colourFlash[i];
    const tick = colourTick[i];
    const col = T.colors[i];
    if (T.skin && T.skin.meter) {                // v3: a painted theme draws the whole meter
      const ready = frac >= 0.75 ? 0.5 + 0.5 * Math.sin(shakeClock * 0.008) : 0;
      if (skinPaint('meter', { i, cx, cy, r, frac, flash, tick, ready, level: levelShow[i], fill: fillShow[i], target })) continue;
    }
    const bump = 1 + (flash * 0.10 + tick * 0.06) * MOTION;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(bump, bump);
    // face disc — the meter reads as a badge of its colour
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = T.style === 'wire' ? col + '14' : T.card;
    if (T.style !== 'wire') { ctx.shadowColor = T.cardShadow; ctx.shadowBlur = 6; ctx.shadowOffsetY = 2; }
    ctx.fill();
    ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    // track
    const lw = Math.max(4, r * 0.24);
    ctx.beginPath();
    ctx.arc(0, 0, r - lw / 2, 0, Math.PI * 2);
    ctx.strokeStyle = T.style === 'wire' ? T.ringTrack : col + '2e';
    ctx.lineWidth = lw;
    ctx.stroke();
    // progress
    if (frac > 0) {
      ctx.beginPath();
      ctx.arc(0, 0, r - lw / 2, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2);
      ctx.strokeStyle = col;
      ctx.lineWidth = lw + flash * 2 + tick * 1.6;
      ctx.lineCap = 'round';
      if (T.style === 'wire') { ctx.shadowColor = col; ctx.shadowBlur = 8 + flash * 20 + tick * 8; }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    // the colour's own symbol leads the meter
    drawGlyph((T.symbols || SYMBOLS)[i], 0, 1, r * 0.42, col);
    ctx.restore();

    // reward: the merge powerup this meter pays out, waiting at twelve o'clock
    const [rx, ry] = hudRewardPos(i);
    // neon's dim fill needs a bigger, brighter badge to read (C-polish refine list)
    const rs = Math.max(7, r * (T.style === 'wire' ? 0.54 : 0.46)) * (1 + flash * 0.35 * MOTION);
    ctx.save();
    const ready = frac >= 0.75 ? 0.5 + 0.5 * Math.sin(shakeClock * 0.008) : 0;
    if (ready > 0 && T.style !== 'wire') {
      ctx.globalAlpha = 0.18 + ready * 0.2;
      hexPath(rx, ry, rs * 1.45);
      ctx.fillStyle = col; ctx.fill();
    }
    ctx.globalAlpha = (T.style === 'wire' ? 0.82 : 0.62) + (T.style === 'wire' ? 0.18 : 0.38) * Math.max(frac, flash);
    // a card-coloured collar so the badge sits cleanly on top of the ring
    hexPath(rx, ry, rs * 1.12);
    ctx.fillStyle = T.style === 'wire' ? T.bg : T.card;
    ctx.fill();
    drawTile(rx, ry, rs, i, { merge: true, ghost: false, badge: true });
    ctx.restore();

    // level: a small ink badge at the lower right of the ring
    const lx = cx + r * 0.74, ly = cy + r * 0.74;
    const lr = Math.max(7, r * 0.38);
    ctx.save();
    ctx.beginPath();
    ctx.arc(lx, ly, lr, 0, Math.PI * 2);
    ctx.fillStyle = T.style === 'wire' ? T.bg : T.ink;
    ctx.fill();
    if (T.style === 'wire') { ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.stroke(); }
    else if (T.badgeRim) { ctx.strokeStyle = T.badgeRim; ctx.lineWidth = Math.max(1.6, lr * 0.22); ctx.stroke(); }   // a dark desk: the badge rides the ring's edge, so a light rim keeps it off the desk
    ctx.fillStyle = T.style === 'wire' ? col : T.card;
    ctx.font = hudFont(800, Math.round(lr * 1.25 * (1 + flash * 0.25)));
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(levelShow[i]), lx, ly + 0.5);
    // fill / target — how far to the reward (drawn on the desk, so it takes the HUD's own ink)
    ctx.fillStyle = T.hudInkSoft || T.inkSoft;
    ctx.font = hudFont(700, 11);
    ctx.fillText(fillShow[i] + '/' + target, cx, cy + r + 10);
    ctx.restore();
  }
  ctx.textAlign = 'left';
  drawMeterPops();
}

/* The target bar's geometry, shared by layout (which reserves its row), the
   draw, the celebration burst and the tests, so none of them can disagree.
   Directly under the score line and as wide as the HUD block: the tray well's
   width in portrait, the HUD column in landscape. Its label IS the score line
   above it (hudScoreLine), so it carries no text or icon of its own. */
function goalBarRect() {
  const h = 7;
  const x = LANDSCAPE ? 8 : TRAY_X0 + 12;
  const w = (LANDSCAPE ? HUD_COL - 4 : TRAY_X1 - 12) - x;
  return { x, y: HUD_GOAL_Y - h / 2, w, h, cx: x + w / 2, cy: HUD_GOAL_Y };
}

/* The target bar. Reads ONLY the display values (goalFill, goalPulse,
   goalFlash, goalHold) — never score or goalsReached — so it advances in step
   with the flying labels, like the score line above it. A crossing: the bar is
   held full and lit for GOAL_HOLD_MS while the flash fades, the burst rings out
   and the chime plays; then it restarts on the new segment. Reduced motion:
   the fill jumps, and there is no pulse. */
function drawGoalBar() {
  const b = goalBarRect();
  // v3: a painted theme draws its own bar, from the same display values
  if (skinPaint('goalBar', b, { fill: goalFill, pulse: REDUCED ? 0 : goalPulse, flash: goalFlash, held: goalHold > 0 })) { drawGoalSweep(b); return; }
  drawGoalBarFlat(b);
  drawGoalSweep(b);
}
function drawGoalBarFlat(b) {
  const col = T.goal || GOLD;
  const pulse = REDUCED ? 0 : goalPulse;
  const h = b.h * (1 + pulse * 0.45);
  const y = b.cy - h / 2;
  const lit = goalFlash > 0.02;
  ctx.save();
  // the crossing's flash: a bright band over the whole row, fading out
  if (goalFlash > 0) {
    const x0 = b.x - 12, x1 = b.x + b.w + 12;
    ctx.globalAlpha = 0.45 * goalFlash;
    ctx.fillStyle = col;
    roundRectPath(x0, b.cy - 15, x1 - x0, 30, 15);
    if (T.style === 'wire') { ctx.shadowColor = col; ctx.shadowBlur = 30 * goalFlash; }
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 0.5 * goalFlash * goalFlash;
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  // track
  roundRectPath(b.x, y, b.w, h, h / 2);
  ctx.fillStyle = T.ringTrack;
  ctx.fill();
  // fill: a filled bar never reads narrower than it is tall (a dot, not a sliver)
  if (goalFill > 0) {
    const w = Math.max(h, b.w * goalFill);
    roundRectPath(b.x, y, w, h, h / 2);
    ctx.fillStyle = col;
    if (T.style === 'wire') { ctx.shadowColor = col; ctx.shadowBlur = 6 + pulse * 10 + goalFlash * 22; }
    ctx.fill();
    ctx.shadowBlur = 0;
    if (pulse > 0 || lit) {                       // a brief lift on each increase, white-hot at a crossing
      ctx.globalAlpha = Math.min(1, pulse * 0.35 + goalFlash * 0.7);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  ctx.restore();
}

// fixed-size ring-burst pool: payout ticks, placement thunk, level-up, deny, a target reached
const BURST_R = { tick: [0.4, 1.05], place: [0.32, 0.85], level: [0.7, 2.1], deny: [0.28, 0.7], over: [0.7, 2.8], goal: [0.6, 3.4],
  tier1: [0.5, 1.5], tier2: [0.7, 2.5], tier3: [0.8, 3.6], mergeDone: [0.6, 2.2], reward: [0.4, 1.3], best: [0.3, 1.7], combo: [0.9, 3.0], fete: [0.6, 3.2] };
const BURST_BIG = { level: 1, over: 1, goal: 1, tier2: 1, tier3: 1, mergeDone: 1, best: 1, fete: 1 };
function drawBursts() {
  for (const b of bursts) {
    if (!b.active) continue;
    const p = Math.min(1, b.age / b.dur);
    const [r0, r1] = BURST_R[b.kind] || [0.3, 1];
    const r = Math.max(1, S * (r0 + (r1 - r0) * p * (REDUCED ? 0.55 : 1)));
    const alpha = Math.pow(1 - p, 1.3);
    const col = b.c === -1 ? T.inkSoft : b.c === -2 ? GOLD : b.c === -3 ? (T.goal || GOLD) : T.colors[b.c];
    const big = BURST_BIG[b.kind] === 1;
    ctx.globalAlpha = alpha * (big ? 0.9 : 0.6);
    ctx.beginPath();
    ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = col;
    ctx.lineWidth = (big ? 4.5 : 2.2) * (1 - p * 0.4);
    if (T.style === 'wire') { ctx.shadowColor = col; ctx.shadowBlur = 14 * alpha; }
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}

// per-tile jitter while a group is tensing to pay out — phase leans on
// neighbouring q/r so the wobble propagates through the shape instead of
// each tile jittering on its own (which read as noise, not "shaking together")
function tileWobble(t) {
  if (t.shake <= 0) return [0, 0];
  const k = t.shake * MOTION;
  return [
    Math.sin(shakeClock * 0.5 + t.q * 0.45 + t.r * 0.25) * S * 0.12 * k,
    Math.cos(shakeClock * 0.42 + t.r * 0.45 + t.q * 0.25) * S * 0.1 * k,
  ];
}
// landing gets a modest pop; a payout punches harder (t.punch) so scoring
// outranks a plain, unmatched drop
function tilePopScale(t) {
  if (t.born <= 0) return 1;
  const amp = (0.14 + t.punch * 0.22) * MOTION;
  return 1 + Math.sin((1 - t.born) * Math.PI) * amp;
}


// the matched group tenses as one shape: an outline traces exactly the
// tiles the piece connected (only edges facing outside the group draw),
// so the player reads the shape, not just a blur of jittering hexes
function drawGroupOutline() {
  const pulse = 0.5 + 0.5 * Math.sin(shakeClock * 0.02);
  for (const t of board.values()) {
    if (t.shake <= 0) continue;
    const [wx, wy] = tileWobble(t);
    const [px0, py0] = boardPix(t.q, t.r);
    const cx = px0 + wx, cy = py0 + wy;
    const col = T.colors[t.c];
    for (let i = 0; i < 6; i++) {
      const [dq, dr] = DIRS[i];
      const n = board.get(key(t.q + dq, t.r + dr));
      if (n && n.c === t.c && n.shake > 0) continue;   // interior edge, skip
      // flat-top tile: the edge facing DIRS[i] runs between corners i and i+1
      // (v1 used pointy-top corners here, so the outline sat 30 degrees off)
      const [ax, ay] = flatCorner(cx, cy, S * 0.96, i);
      const [bx, by] = flatCorner(cx, cy, S * 0.96, i + 1);
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.strokeStyle = col;
      ctx.lineCap = 'round';
      if (T.style === 'wire') {
        ctx.lineWidth = 2.6 + pulse * 1.8 * MOTION;
        ctx.globalAlpha = 0.85;
        ctx.shadowColor = col;
        ctx.shadowBlur = 6 + pulse * 10 * MOTION;
      } else {
        ctx.lineWidth = 4.4 + pulse * 2.2 * MOTION;
        ctx.globalAlpha = 0.5 + pulse * 0.22 * MOTION;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }
  }
}

/* The group a hovering powerup would swallow, traced as ONE silhouette: only
   the edges facing outside the group are stroked, so it reads as the connected
   shape about to be taken rather than a pile of separate hex outlines. Kept
   apart from drawGroupOutline() on purpose — that one is keyed to the scoring
   shake and speaks a different visual language (a wave that has already been
   earned); this is a promise about a move not yet made. */

/* ---------- v2 polish: presentation helpers (display only, never touch rules) ---------- */
function roundRectPath(x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
// corner k of a FLAT-top tile (0 deg = right, clockwise on screen)
function flatCorner(cx, cy, s, k) {
  const a = Math.PI / 3 * k;
  return [cx + s * Math.cos(a), cy + s * Math.sin(a)];
}
/* Deal-in: each empty cell scales in, staggered by ring distance from the
   centre. Returns 0..1. Reduced motion keeps only a short fade. */
function dealK(q, r) {
  if (dealClock >= 99999) return 1;
  const d = (Math.abs(q) + Math.abs(r) + Math.abs(q + r)) / 2;
  if (REDUCED) return Math.min(1, dealClock / 220);
  const u = Math.max(0, Math.min(1, (dealClock - d * 55) / 240));
  return 1 - Math.pow(1 - u, 3);
}
// the board's raised card: a pointy-top hex with rounded corners
function drawBoardCard() {
  const R0 = CARD_K * S;
  const grow = (dealClock >= 99999 || REDUCED) ? 1 : 0.965 + 0.035 * Math.min(1, dealClock / 260);
  const rc = S * 1.1;
  const pts = [];
  for (let k = 0; k < 6; k++) {
    const a = -Math.PI / 2 + Math.PI / 3 * k;
    pts.push([BX + Math.cos(a) * R0 * grow, BY + Math.sin(a) * R0 * grow]);
  }
  ctx.save();
  ctx.beginPath();
  for (let k = 0; k < 6; k++) {
    const p0 = pts[k], p1 = pts[(k + 1) % 6];
    const mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2;
    if (k === 0) ctx.moveTo(mx, my);
    const p2 = pts[(k + 2) % 6];
    ctx.arcTo(p1[0], p1[1], (p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, rc);
  }
  ctx.closePath();
  ctx.fillStyle = T.card;
  ctx.shadowColor = T.cardShadow;
  ctx.shadowBlur = T.style === 'wire' ? 26 : 22;
  ctx.shadowOffsetY = T.style === 'wire' ? 0 : 7;
  ctx.fill();
  ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  ctx.strokeStyle = T.cardEdge;
  ctx.lineWidth = T.style === 'wire' ? 1.5 : 1;
  ctx.stroke();
  ctx.restore();
}
// the tray: a recessed rounded well close under (or beside) the board
function drawTrayPanel() {
  const x = TRAY_X0, w = TRAY_X1 - TRAY_X0;
  const y = LANDSCAPE ? TRAY_TOP : TRAY_TOP;
  const h = (LANDSCAPE ? TRAY_BOTTOM : TRAY_BOTTOM) - y;
  ctx.save();
  roundRectPath(x, y, w, h, 18);
  ctx.fillStyle = T.trayPanel;
  ctx.fill();
  if (T.style === 'wire') {
    ctx.strokeStyle = T.trayEdge; ctx.lineWidth = 1.5; ctx.stroke();
  } else {
    // inner top shade: reads as a shallow well, the card above reads raised
    ctx.clip();
    ctx.strokeStyle = 'rgba(90,70,40,0.10)';
    ctx.lineWidth = 6;
    roundRectPath(x - 1, y + 1.5, w + 2, h + 6, 19);
    ctx.stroke();
  }
  ctx.restore();
}

/* Groups read as groups while playing: every tile that has a same-colour
   neighbour gets a full-size hex backing in a tint of its colour. Full-size
   hexes tessellate, so a connected group becomes ONE joined shape with a rim,
   and a lone tile (which scores nothing) stays a loose scrap. One path per
   colour, filled once, so overlapping edges never double the alpha. */
function drawGroupMats() {
  if (!board.size) return;
  const n = T.colors.length;
  const paths = [];
  for (let i = 0; i < n; i++) paths.push([]);
  for (const t of board.values()) {
    let joined = false;
    for (const [dq, dr] of DIRS) {
      const nb = board.get(key(t.q + dq, t.r + dr));
      if (nb && nb.c === t.c) { joined = true; break; }
    }
    if (joined) paths[t.c].push(t);
  }
  ctx.save();
  for (let ci = 0; ci < n; ci++) {
    if (!paths[ci].length) continue;
    ctx.beginPath();
    for (const t of paths[ci]) {
      const [x, y] = boardPix(t.q, t.r);
      const s = S * 1.0 + 0.6;
      for (let k = 0; k < 6; k++) {
        const [px, py] = flatCorner(x, y, s, k);
        if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
    }
    ctx.fillStyle = T.colors[ci];
    ctx.globalAlpha = T.matAlpha != null ? T.matAlpha : T.style === 'wire' ? 0.22 : 0.62;
    ctx.fill();
  }
  ctx.restore();
}
/* While a piece hovers a legal spot, the groups it would pay out are traced
   as one silhouette (existing tiles + the ghost), in their colour. Never for a
   merge powerup: the user removed exactly that swallowed-group outline on
   2026-09-01 — a powerup keeps only its legal-cell glow and the "+N". */
function drawPreviewOutline(piece) {
  const pv = drag && drag.preview;
  if (!pv || !pv.gained || piece.merge) return;
  const col = new Map();
  for (const k of pv.cells) { const t = board.get(k); if (t) col.set(k, t.c); }
  for (const c of piece.cells) {
    const k = key(drag.hover[0] + c.dq, drag.hover[1] + c.dr);
    if (pv.cells.has(k)) col.set(k, c.c);
  }
  const pulse = 0.5 + 0.5 * Math.sin(shakeClock * 0.01);
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineWidth = Math.max(2.5, S * 0.13);
  for (const [k, c] of col) {
    const [q, r] = k.split(',').map(Number);
    const [cx, cy] = boardPix(q, r);
    ctx.strokeStyle = T.colors[c];
    ctx.globalAlpha = 0.75 + pulse * 0.2 * MOTION;
    if (T.style === 'wire') { ctx.shadowColor = T.colors[c]; ctx.shadowBlur = 8; }
    for (let i = 0; i < 6; i++) {
      const nk = key(q + DIRS[i][0], r + DIRS[i][1]);
      if (col.get(nk) === c) continue;           // interior edge
      const [ax, ay] = flatCorner(cx, cy, S * 1.02, i);
      const [bx, by] = flatCorner(cx, cy, S * 1.02, i + 1);
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
    }
  }
  ctx.restore();
}
// "+N" riding above the piece in hand: what this drop pays, before it drops
function drawPayoutPill(piece) {
  const pv = drag && drag.preview;
  if (!pv || !pv.gained) return;
  let minY = Infinity, sumX = 0;
  for (const c of piece.cells) {
    const [x, y] = hexToPixel(c.dq - drag.grabDq, c.dr - drag.grabDr, S);
    minY = Math.min(minY, y); sumX += x;
  }
  const cx = drag.x + sumX / piece.cells.length;
  const label = '+' + pv.gained;
  const size = Math.round(Math.max(15, Math.min(22, S * 0.72)));
  ctx.save();
  ctx.font = hudFont(800, size);
  const mt = ctx.measureText && ctx.measureText(label), tw = (mt && mt.width) || label.length * size * 0.6;
  const h = size + 10, w = Math.max(h, tw + 18);
  let cy = drag.y - S * DRAG_LIFT + minY - S * 0.9 - h / 2 - 6;
  cy = Math.max(h / 2 + 2, cy);
  const x = Math.max(2, Math.min(W - w - 2, cx - w / 2));
  const one = pv.colours.size === 1 ? T.colors[[...pv.colours][0]] : null;
  roundRectPath(x, cy - h / 2, w, h, h / 2);
  if (T.style === 'wire') {
    ctx.fillStyle = '#000'; ctx.fill();
    ctx.strokeStyle = one || T.ink; ctx.lineWidth = 2;
    ctx.shadowColor = one || T.ink; ctx.shadowBlur = 10; ctx.stroke(); ctx.shadowBlur = 0;
    ctx.fillStyle = one || T.ink;
  } else {
    ctx.shadowColor = 'rgba(60,40,20,0.25)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3;
    ctx.fillStyle = one || T.ink; ctx.fill();
    ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    ctx.fillStyle = '#fffaf2';
  }
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(label, x + w / 2, cy + 1);
  ctx.restore();
}
// the cells refusing the drop, tinted red (clashCells)
function drawClash() {
  if (!drag || !drag.clash || !drag.clash.length) return;
  ctx.save();
  for (const [q, r] of drag.clash) {
    const [x, y] = boardPix(q, r);
    hexPath(x, y, S * 0.92);
    ctx.globalAlpha = 0.34;
    ctx.fillStyle = CLASH;
    ctx.fill();
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = CLASH;
    ctx.lineWidth = Math.max(2, S * 0.1);
    if (T.style === 'wire') { ctx.shadowColor = CLASH; ctx.shadowBlur = 8; }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
  ctx.restore();
}
const CLASH = '#e8322a';

// game over explains itself: every tray piece that fits nowhere is struck out
function drawNoFit(i) {
  const [x, y] = traySlotPos(i);
  const r = Math.max(13, Math.min(18, S * 0.62));
  ctx.save();
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = T.style === 'wire' ? 'rgba(0,0,0,0.85)' : 'rgba(251,247,238,0.92)';
  ctx.fill();
  ctx.strokeStyle = T.ink; ctx.lineWidth = 2.6;
  if (T.style === 'wire') { ctx.shadowColor = T.ink; ctx.shadowBlur = 8; }
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - r * 0.62, y + r * 0.62); ctx.lineTo(x + r * 0.62, y - r * 0.62);
  ctx.lineCap = 'round'; ctx.stroke();
  ctx.restore();
}

/* v2 (UI #12): a powerup waiting in the tray glints now and then, so it reads
   as special rather than as one more tile (its mark alone read as a snowflake).
   Slow and small; under reduced motion it holds a faint steady glint. */
function drawSparkle(i) {
  const piece = tray[i];
  const [x, y] = traySlotPos(i);
  const s = trayScale(piece);
  const t = ((shakeClock / 2400) + i * 0.37) % 1;
  const k = REDUCED ? 0.5 : (t < 0.4 ? Math.sin(t / 0.4 * Math.PI) : 0);
  if (k <= 0) return;
  const gx = x + s * 0.62, gy = y - s * 0.62, gr = s * (0.16 + 0.22 * k);
  ctx.save();
  ctx.globalAlpha = 0.95 * k;
  ctx.fillStyle = T.style === 'wire' ? T.colors[piece.cells[0].c] : '#fffaf0';
  if (T.style === 'wire') { ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 8; }
  ctx.beginPath();
  for (let j = 0; j < 8; j++) {
    const a = Math.PI / 4 * j, rr = j % 2 ? gr * 0.28 : gr;
    const px = gx + Math.cos(a) * rr, py = gy + Math.sin(a) * rr;
    if (j) ctx.lineTo(px, py); else ctx.moveTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/* ---------- v3 reward feedback: what it draws ---------- */
// ease-out with a small overshoot, 0 -> 1
function backOut(k) { const c = 1.9, u = k - 1; return 1 + (c + 1) * u * u * u + c * u * u; }
function fxColour(c) { return c === -2 ? GOLD : c === -3 ? (T.goal || GOLD) : c >= 0 && c < T.colors.length ? T.colors[c] : T.ink; }
// the rim that carries a callout's number over tiles of any colour
function calloutRim() { return T.calloutRim || (T.style === 'wire' ? T.bg : T.plaqueBg || '#fffaf0'); }

/* A group's total: "+N" in the group's colour, rimmed so it reads over the
   tiles. It pops in with a small overshoot, holds, then lifts and fades. For a
   multi-group placement each callout also carries its place in the chain as
   pips (one, two, three), so a double and a triple are seen as well as heard. */
function drawCallouts() {
  if (!callouts.length) return;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  for (const c of callouts) {
    if (!c.fired) continue;
    const hold = CALLOUT_HOLD[c.tier];
    let scale = 1, alpha = 1, lift = (c.t / (CALLOUT_IN + hold + CALLOUT_OUT)) * S * 0.3 * MOTION;
    if (c.t < CALLOUT_IN) {
      const k = c.t / CALLOUT_IN;
      scale = REDUCED ? 1 : 0.45 + 0.55 * backOut(k);
      alpha = Math.min(1, k * 2.4);
    } else if (c.t > CALLOUT_IN + hold) {
      const k = Math.min(1, (c.t - CALLOUT_IN - hold) / CALLOUT_OUT);
      scale = 1 - 0.1 * k;
      alpha = 1 - k * k;
      lift += k * k * S * 0.9 * MOTION;
    }
    const size = Math.max(9, Math.round(S * CALLOUT_SIZE[c.tier] * calloutScale(c) * scale));
    const label = calloutText(c), col = fxColour(c.c), x = c.x, y = c.y - lift;
    ctx.globalAlpha = alpha;
    ctx.font = (T.mono ? `700 ${size}px ui-monospace, Menlo, monospace` : `800 ${size}px ${T.font || '"Avenir Next", sans-serif'}`);
    if (c.tier >= 3) {                       // a huge one (and a target's number) wears a gold outer rim
      ctx.lineWidth = Math.max(4, size * 0.34);
      ctx.strokeStyle = c.tier === 4 ? T.ink : GOLD;
      ctx.strokeText(label, x, y);
    }
    ctx.lineWidth = Math.max(3, size * 0.2);
    ctx.strokeStyle = calloutRim();
    if (T.style === 'wire') { ctx.shadowColor = col; ctx.shadowBlur = 12; }
    ctx.strokeText(label, x, y);
    ctx.shadowBlur = 0;
    ctx.fillStyle = col;
    ctx.fillText(label, x, y);
    if (c.of > 1) {                          // its place in the chain: one, two or three pips under the number
      const pr = Math.max(2.2, size * 0.085), gap = pr * 3.1, py = y + size * 0.66;
      for (let i = 0; i <= c.idx; i++) {
        const px = x + (i - c.idx / 2) * gap;
        ctx.beginPath(); ctx.arc(px, py, pr + 1.4, 0, Math.PI * 2); ctx.fillStyle = calloutRim(); ctx.fill();
        ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill();
      }
    }
  }
  ctx.restore();
}

// a tool charge in flight: a gold spark on a shallow arc from the meter or the target bar to its button
function drawChargeBeams() {
  if (!chargeBeams.length) return;
  const col = T.goal || GOLD;
  ctx.save();
  ctx.lineCap = 'round';
  for (const b of chargeBeams) {
    const t = Math.min(1, b.t), e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const bow = Math.min(60, Math.hypot(b.tx - b.sx, b.ty - b.sy) * 0.22) * MOTION;
    const at = k => {
      const u = 1 - k, mx = (b.sx + b.tx) / 2 - bow, my = (b.sy + b.ty) / 2;
      return [u * u * b.sx + 2 * u * k * mx + k * k * b.tx, u * u * b.sy + 2 * u * k * my + k * k * b.ty];
    };
    const [hx, hy] = at(e);
    if (!REDUCED) {
      const [qx, qy] = at(Math.max(0, e - 0.16));
      ctx.strokeStyle = T.plaqueBg || T.bg; ctx.lineWidth = 8; ctx.globalAlpha = 0.5;
      ctx.beginPath(); ctx.moveTo(qx, qy); ctx.lineTo(hx, hy); ctx.stroke();
      ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.globalAlpha = 0.9;
      ctx.beginPath(); ctx.moveTo(qx, qy); ctx.lineTo(hx, hy); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = T.plaqueBg || T.bg;
    ctx.beginPath(); ctx.arc(hx, hy, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(hx, hy, 5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

// a target reached: the board card takes a gold wash that is gone in GOAL_WASH_MS — never long enough to hide a move
function drawGoalWash() {
  if (goalWash <= 0) return;
  ctx.save();
  ctx.globalAlpha = (REDUCED ? 0.12 : 0.24) * goalWash * goalWash;
  ctx.fillStyle = T.goal || GOLD;
  ctx.beginPath();
  ctx.arc(BX, BY, CARD_HW * S * 0.98, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
// ...and a shine crosses the full bar, over whichever bar the theme painted
function drawGoalSweep(b) {
  if (goalSweep <= 0 || REDUCED) return;
  const k = 1 - goalSweep, w = b.w * 0.22, x = b.x - w + (b.w + w) * k;
  const x0 = Math.max(b.x, x), x1 = Math.min(b.x + b.w, x + w);
  if (x1 <= x0) return;
  ctx.save();
  ctx.globalAlpha = 0.75 * Math.sin(k * Math.PI);
  ctx.fillStyle = '#ffffff';
  roundRectPath(x0, b.cy - b.h * 0.9, x1 - x0, b.h * 1.8, b.h * 0.9);
  ctx.fill();
  ctx.restore();
}

// the meter's own moment when its displayed level crosses: a flash over the ring, and the new level popping out of it
function drawMeterPops() {
  for (let i = 0; i < meterPop.length; i++) {
    const m = meterPop[i];
    if (m <= 0) continue;
    const [cx, cy] = hudRingPos(i), r = RING_R, k = 1 - m, col = T.colors[i];
    ctx.save();
    ctx.globalAlpha = 0.6 * m * m;
    ctx.fillStyle = T.style === 'wire' ? col : '#ffffff';
    ctx.beginPath(); ctx.arc(cx, cy, r * (1 + 0.22 * k * MOTION), 0, Math.PI * 2); ctx.fill();
    const size = Math.max(10, Math.round(r * 1.5 * (REDUCED ? 1 : 0.5 + 0.5 * backOut(Math.min(1, k / 0.3)))));
    ctx.globalAlpha = Math.min(1, m * 2.2);
    ctx.font = hudFont(800, size);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(3, size * 0.2);
    ctx.strokeStyle = calloutRim();
    ctx.strokeText(String(levelShow[i]), cx, cy - k * r * 0.5 * MOTION);
    ctx.fillStyle = col;
    ctx.fillText(String(levelShow[i]), cx, cy - k * r * 0.5 * MOTION);
    ctx.restore();
  }
}

function render() {
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const sk = T.skin || null;
  const L = sk ? layoutInfo() : null;
  let boardOk = false;                 // a painted board carries its own empty cells
  if (sk) {
    /* v3: a painted theme. The window-wide backdrop is on #bg, so the card is
       cleared to transparent; the chrome and the board come from the cached
       static layer (or, where no layer could be made, straight from the hooks). */
    if (sk.backdrop) ctx.clearRect(0, 0, W, H);
    else { ctx.fillStyle = T.bg; ctx.fillRect(0, 0, W, H); }
    let panelsOk = !!sk.panels; boardOk = !!sk.board;
    if (staticLayer) ctx.drawImage(staticLayer, 0, 0, W, H);
    else { panelsOk = skinPaint('panels', L); boardOk = skinPaint('board', L); }
    if (!boardOk) drawBoardCard();                  // the card first and the tray over its shadow, in the flat renderer's own order (paper takes this path: it has a skin, but no panel or board hook)
    if (!panelsOk) drawTrayPanel();
    skinPaint('ambient', shakeClock, L);
  } else {
    ctx.fillStyle = T.bg;
    ctx.fillRect(0, 0, W, H);
    drawBoardCard();
    drawTrayPanel();
  }
  drawHud();

  // empty cells — deal in from the centre at the start of a run (a painted board carries its own)
  for (const [q, r] of CELLS) {
    if (boardOk) break;
    if (board.has(key(q, r))) continue;
    const [x, y] = boardPix(q, r);
    const k = dealK(q, r);
    if (k <= 0) continue;
    ctx.globalAlpha = Math.min(1, k * 1.4);
    hexPath(x, y, S * 0.9 * (REDUCED ? 1 : 0.55 + 0.45 * k));
    ctx.fillStyle = T.cell;
    ctx.fill();
    if (T.cellEdge) {
      ctx.strokeStyle = T.cellEdge;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  /* While a powerup is in hand, every cell it may legally land on breathes in
     its own colour, and the one under the finger lifts out of the set. This is
     the whole affordance for the placement rule — without it the restriction
     reads as the game arbitrarily refusing drops. */
  if (drag && drag.mergeCells && tray[drag.slot]) {
    const col = T.colors[tray[drag.slot].cells[0].c];
    const pulse = 0.5 + 0.5 * Math.sin(shakeClock * 0.004);
    ctx.save();
    for (const [q, r] of drag.mergeCells) {
      const hov = drag.hover && drag.hover[0] === q && drag.hover[1] === r;
      const [x, y] = boardPix(q, r);
      hexPath(x, y, S * 0.9);
      ctx.fillStyle = col;
      // globalAlpha silently ignores values above 1, so every one of these is clamped
      // v2 (UI #12): ~35% of the powerup's own colour — v1's 12% read as disabled grey-blue
      ctx.globalAlpha = Math.min(1, (hov ? 0.52 : 0.32) + pulse * 0.08 * MOTION);
      ctx.fill();
      ctx.strokeStyle = col;
      ctx.globalAlpha = Math.min(1, (hov ? 0.90 : 0.50) + pulse * 0.18 * MOTION);
      ctx.lineWidth = hov ? 3.2 : 2;
      if (T.style === 'wire') { ctx.shadowColor = col; ctx.shadowBlur = 5 + pulse * 8 * MOTION; }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  }

  // groups read as groups: same-colour neighbours share one backing shape
  drawGroupMats();

  // ghost preview of where the dragged piece would land
  if (drag && drag.hover) {
    const piece = tray[drag.slot];
    for (const c of piece.cells) {
      const [x, y] = boardPix(drag.hover[0] + c.dq, drag.hover[1] + c.dr);
      drawTile(x, y, S, c.c, { ghost: true, merge: !!piece.merge });
    }
    drawPreviewOutline(piece);
  }
  drawClash();

  // the shape of what's about to pay, drawn under the tiles
  drawGroupOutline();

  // placed tiles
  const kickY = boardKickY();                  // v3: a big payout makes the tiles hop once
  for (const t of board.values()) {
    const [wx, wy] = tileWobble(t);
    const [bx, by] = boardPix(t.q, t.r);
    let x = bx + wx, y = by + wy + kickY;
    if (t.nudge > 0) {                         // v3: a same-colour neighbour leans toward the piece that just landed
      const e = Math.sin((1 - t.nudge) * Math.PI) * S * 0.09 * MOTION;
      x += t.nx * e; y += t.ny * e;
    }
    // a slow synced breathing (not just position jitter) on top of the pop,
    // so a tensing tile reads as more than jitter
    if (failShake > 0) {                      // synced jolt: same offset for all
      x += Math.sin(shakeClock * 0.09) * S * 0.16 * failShake * MOTION;
      y += Math.cos(shakeClock * 0.075) * S * 0.12 * failShake * MOTION;
    }
    const tense = t.shake > 0 ? 1 + (0.5 + 0.5 * Math.sin(shakeClock * 0.02)) * 0.05 * MOTION : 1;
    if (t.land > 0 && !REDUCED) {
      // v3: squash-and-settle — flattest on the frame it lands, one small rebound, done in LAND_MS
      const k = 1 - t.land, e = Math.exp(-4.5 * k) * Math.cos(k * Math.PI * 2.2) * 0.17;
      ctx.save();
      ctx.translate(x, y + S * 0.4 * e);
      ctx.scale(1 + e * 0.55, 1 - e);
      drawTile(0, 0, S * tilePopScale(t) * tense, t.c,
        { matched: t.shake > 0, v: (t.vShow != null ? t.vShow : t.v), valued: !!t.merged, merge: false });
      ctx.restore();
      continue;
    }
    drawTile(x, y, S * tilePopScale(t) * tense, t.c,
      { matched: t.shake > 0, v: (t.vShow != null ? t.vShow : t.v), valued: !!t.merged, merge: false });
  }

  /* The swallowed-group outline that used to draw here was REMOVED at the
     user's request (2026-09-01) — the breathing legal-cell highlights carry
     the affordance alone now. mergeGroupAt still exists: placeMerge and the
     canPlace gate depend on it; only the preview border is gone. */

  // tiles being swallowed: they have already left the board, so this is purely
  // the visual of them sliding in and shrinking away
  for (const m of mergeAnim) {
    if (m.t <= 0) {                       // still waiting its turn: sit and tense
      ctx.save();
      drawTile(m.x, m.y, S * 1.04, m.c, { v: m.v });
      ctx.restore();
      continue;
    }
    // ease-IN so it hangs then snaps away, which is what sells the pull
    const k = m.t * m.t;
    const x = m.x + (m.tx - m.x) * k;
    const y = m.y + (m.ty - m.y) * k;
    ctx.save();
    ctx.globalAlpha = 1 - k * k;
    drawTile(x, y, S * (1 - k * 0.66), m.c, { v: m.v });
    ctx.restore();
  }

  drawGoalWash();                                // v3: a target reached — the board's brief gold wash
  drawBursts();
  drawParts();                                   // v3: the theme's own particles, over the board, under the labels

  // score labels: pop in at the tile, then arc up into their colour's meter
  for (const p of pops) {
    const e = p.t < 0.18 ? 0 : (p.t - 0.18) / 0.82;      // hang, then launch
    const k = e * e * (3 - 2 * e);                        // smoothstep flight
    // quadratic bezier with a lifted, bowed control point
    const cx = (p.sx + p.tx) / 2 + p.bow * MOTION;
    const cy = Math.min(p.sy, p.ty) - 34 * MOTION;   // a short hop: the meters sit right on the board
    const u = 1 - k;
    const lx = u * u * p.sx + 2 * u * k * cx + k * k * p.tx;
    const ly = u * u * p.sy + 2 * u * k * cy + k * k * p.ty;
    const growIn = Math.min(1, p.t / 0.12);
    const shrink = 1 - k * 0.45;                          // recedes as it lands
    const scale = growIn * shrink;
    const label = '+' + p.n;
    const size = Math.max(1, Math.round((T.mono ? 17 : 19) * scale));
    ctx.font = (T.mono ? `700 ${size}px ui-monospace, Menlo, monospace` : `800 ${size}px ${T.font || '"Avenir Next", sans-serif'}`);
    ctx.textAlign = 'center';
    ctx.globalAlpha = popAlpha(p, k, lx, ly);
    ctx.lineWidth = Math.max(2, size * 0.24);
    ctx.strokeStyle = T.colors[p.c];
    if (T.style === 'wire') { ctx.shadowColor = T.colors[p.c]; ctx.shadowBlur = 10; }
    ctx.strokeText(label, lx, ly);
    ctx.shadowBlur = 0;
    ctx.fillStyle = T.popInk || T.ink;
    ctx.fillText(label, lx, ly);
    ctx.globalAlpha = 1;
  }
  drawCallouts();                                // v3: the group totals, over the per-tile labels, under the hand

  // tray pieces (the recessed panel itself is painted under the HUD)
  for (let i = 0; i < 3; i++) {
    const piece = tray[i];
    if (!piece || piece.hidden || (drag && drag.slot === i) || snapBack[i]) continue;
    // game over explains itself: a piece that fits nowhere is faded, jolts with
    // the board, and is struck out (M4)
    const dead = state === 'over' && !fitsSomewhere(piece);
    ctx.save();
    if (dead) {
      ctx.globalAlpha = 0.4; TILE_ALPHA = 0.4;
      ctx.translate(Math.sin(shakeClock * 0.09 + i) * S * 0.12 * failShake * MOTION, 0);
    }
    const spin = rotAnim[i];
    // v3: a fresh hand deals in like the board's cells do — scale up and fade in, slot by slot
    const inK = trayInK(i);
    if (inK < 1) TILE_ALPHA *= Math.min(1, inK * 1.4);        // (both renderers read TILE_ALPHA; it is reset below)
    const bump = trayScale(piece) * (1 + tapFlash[i] * 0.14 * MOTION) * (REDUCED ? 1 : 0.55 + 0.45 * inK);
    if (spin) {
      // mid-swing: every colour arcs from its old seat to its new one
      const k = Math.min(1, spin.t / ROT_MS);
      const e = 1 - Math.pow(1 - k, 3);
      let ccx = 0, ccy = 0;
      for (const c of piece.cells) {
        const [x, y] = trayCellPos(piece, c, i);
        ccx += x / piece.cells.length;
        ccy += y / piece.cells.length;
      }
      for (const m of spin.moves) {
        const [fx, fy] = trayCellPos(piece, { dq: m.fromDq, dr: m.fromDr }, i);
        const [tx2, ty2] = trayCellPos(piece, m.cell, i);
        const [x, y] = arcLerp(ccx, ccy, fx, fy, tx2, ty2, e);
        drawTile(x, y, bump, m.cell.c, { merge: !!piece.merge });
      }
    } else {
      for (const c of piece.cells) {
        const [x, y] = trayCellPos(piece, c, i);
        drawTile(x, y, bump, c.c, { merge: !!piece.merge });
      }
    }
    ctx.restore();
    TILE_ALPHA = 1;
    if (dead) drawNoFit(i);
    else if (piece.merge) drawSparkle(i);
  }

  // after the band and its pieces, for the same paint-order reason as the
  // hints below — before them it was silently buried under the tray fillRect
  drawRotateBtn();
  drawToolBtn('undo');
  drawToolBtn('deal');
  drawBeams();
  drawChargeBeams();                             // v3: tool charges flying to their buttons

  /* First-run demo, drawn AFTER the tray so it is not painted over by the tray
     band — the tap lesson sits directly on a slot, and the first version of
     this was invisible for exactly that reason. */
  /* Never two dots at once. The guided placements come first; then the merge
     lesson OUTRANKS the swap lesson (v2 Q1) — in v1 it deferred to it, and the
     swap lesson never ended without a tap, so the merge lesson never showed. */
  if (state === 'playing' && !drag) {
    if (hintOn && hintStep < HINT_MERGE_STEP) drawDragHint();
    else if (mergeGuideTarget()) drawMergeGuide();
    else if (tapHintShowing()) drawTapHint();
  }

  // rejected pieces easing back into the tray — a real "no", not a silent snap
  for (let i = 0; i < 3; i++) {
    const sb = snapBack[i];
    const piece = tray[i];
    if (!sb || !piece) continue;
    const p = Math.min(1, sb.t / sb.dur);
    const ease = 1 - (1 - p) * (1 - p) * (1 - p);
    const [targetX, targetY] = trayCellPos(piece, { dq: sb.grabDq, dr: sb.grabDr }, i);
    const wag = REDUCED ? 0 : Math.sin(p * Math.PI * 5) * (1 - p) * 8;
    const ax = sb.x + (targetX - sb.x) * ease + wag;
    const ay = sb.y + (targetY - sb.y) * ease;
    const scale = S + (TRAY_S - S) * ease;
    for (const c of piece.cells) {
      const [x, y] = hexToPixel(c.dq - sb.grabDq, c.dr - sb.grabDr, scale);
      drawTile(ax + x, ay + y, scale, c.c, { dragging: p < 0.5, merge: !!piece.merge });
    }
  }

  // the piece in hand
  if (drag) {
    const piece = tray[drag.slot];
    for (const c of piece.cells) {
      const [x, y] = liftedCellPos(drag.x, drag.y, c, drag.grabDq, drag.grabDr);
      drawTile(x, y, S, c.c, { dragging: true, merge: !!piece.merge });
    }
    drawPayoutPill(piece);
  }
  skinPaint('overlay', shakeClock, L);
}

/* Level-up delivery: an energy streak from the colour's ring to the tray slot
   where the powerup will materialise, so the spawn feels EARNED by the meter
   rather than appearing from nowhere. Display-only. Cased like every outline
   in this game (rim + colour core) so it reads on both themes; under REDUCED
   the trail collapses to just the head dot — the information survives, the
   motion shrinks. */
function drawBeams() {
  for (const b of beams) {
    const t = Math.min(1, b.t);
    const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;   // easeInOutQuad
    const hx = b.sx + (b.tx - b.sx) * e;
    const hy = b.sy + (b.ty - b.sy) * e;
    const col = T.colors[b.c];
    ctx.save();
    if (!REDUCED) {
      const tail = Math.max(0, e - 0.22);
      const tx0 = b.sx + (b.tx - b.sx) * tail;
      const ty0 = b.sy + (b.ty - b.sy) * tail;
      ctx.lineCap = 'round';
      ctx.strokeStyle = T.plaqueBg || T.bg;      // contrasting rim under the core
      ctx.lineWidth = 10;
      ctx.globalAlpha = 0.5;
      ctx.beginPath(); ctx.moveTo(tx0, ty0); ctx.lineTo(hx, hy); ctx.stroke();
      ctx.strokeStyle = col;
      ctx.lineWidth = 5.5;
      ctx.globalAlpha = 0.9;
      ctx.beginPath(); ctx.moveTo(tx0, ty0); ctx.lineTo(hx, hy); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(hx, hy, 6.5 + 2.5 * Math.sin(b.t * 12), 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

let devFrozen = false;          // DEV only (?juice=...&at=ms): the clock is stopped on a moment, for a capture
function update(dt) {
  if (devFrozen) return;
  shakeClock += dt;
  if (dealClock < 99999) dealClock += dt;
  tallyClock += dt;
  // pay out any tiles whose turn has come
  while (shakeQueue.length && shakeQueue[0].at <= tallyClock) {
    const s0 = shakeQueue.shift();
    if (board.has(key(s0.tile.q, s0.tile.r))) s0.tile.shake = 1;
  }
  let paid = 0;
  while (tally.length && tally[0].at <= tallyClock) {
    const entry = tally.shift();
    const t = entry.tile;
    if (!board.has(key(t.q, t.r))) { groupTick(entry.grp, 0); continue; }   // tile vanished (new game)
    /* Logic settles NOW — score, fill, level, the granted powerup and the
       analytics event never wait on an animation (the game-over re-check
       depends on that). The VISIBLE side — counter bump, ring bump, flash,
       ring burst, level-up chime, the powerup appearing — all fire when the
       flying label lands; see the pops loop below. */
    const worth = settleTile(t);                  // a merged tile pays its whole value
    const ci = t.c;
    t.shake = 0;
    t.born = 1;                                   // pops as it pays
    t.punch = 1;                                   // payout punch outranks a plain landing
    const [px, py] = hexToPixel(t.q, t.r, 1);
    pushPop(t.q, t.r, worth, ci);
    const [bx, by] = boardPix(t.q, t.r);
    spawnBurst(bx, by, ci, 'tick');
    /* v3: the payout climbs the scale along its group (it used to restart at the
       bottom note every frame), and the 2nd and 3rd group of one placement start
       higher; then the group's last tile closes it (groupTick -> groupPaid). */
    const grp = entry.grp;
    sfx.tick(grp ? grp.idx * 2 + grp.ticks++ : paid++);
    groupTick(grp, worth);
  }
  /* v2 (Q5): a slot held empty for a forecast level-up. The grant normally
     fills it mid-payout; if that payout has finished and it is still empty
     (a merge swallowed the queued tiles, so the level-up never came), deal it
     now, so no slot is ever left empty for longer than its own payout. */
  for (let i = reservedSlots.length - 1; i >= 0; i--) {
    const rs = reservedSlots[i];
    if (tray[rs.slot] !== null) reservedSlots.splice(i, 1);
    else if (tallyClock >= rs.until) { reservedSlots.splice(i, 1); refillSlot(rs.slot); }
  }
  for (const t of board.values()) {
    if (t.shake > 0 && !tally.some(e => e.tile === t)) t.shake = Math.max(0, t.shake - dt * 0.006);
    if (t.born > 0) t.born = Math.max(0, t.born - dt * (0.0042 - t.punch * 0.0014));
    if (t.land > 0) t.land = Math.max(0, t.land - dt / LAND_MS);
    if (t.nudge > 0) t.nudge = Math.max(0, t.nudge - dt / NUDGE_MS);
  }
  if (btnSpin > 0) btnSpin = Math.max(0, btnSpin - dt * 0.004);
  for (const kind of TOOL_KINDS) {
    if (toolFlash[kind] > 0) toolFlash[kind] = Math.max(0, toolFlash[kind] - dt * 0.003);
    if (toolShake[kind] > 0) toolShake[kind] = Math.max(0, toolShake[kind] - dt * 0.004);
  }
  for (let i = 0; i < 3; i++) if (trayIn[i]) { trayIn[i].t += dt; if (trayIn[i].t >= TRAY_IN_MS) trayIn[i] = null; }
  updateParts(dt);
  updateJuice(dt);
  for (let i = 0; i < colourFlash.length; i++) {
    if (colourFlash[i] > 0) colourFlash[i] = Math.max(0, colourFlash[i] - dt * 0.0016);
    if (colourTick[i] > 0) colourTick[i] = Math.max(0, colourTick[i] - dt * 0.006);
  }
  if (scorePulse > 0) scorePulse = Math.max(0, scorePulse - dt * 0.0045);
  for (const p of pops) {
    p.t += dt * 0.0016;
    if (!p.landed && p.t >= 1) {
      /* The label landing IS the payout, as far as the player's eyes go: only
         now do the displayed score and this colour's displayed bar advance
         (user 2026-09-01 — before this, both jumped at placement while the
         label was still mid-flight, so the flight delivered nothing). */
      p.landed = true;
      scoreShow += p.n;
      fillShow[p.c] += p.n;
      colourTick[p.c] = 1;
      scorePulse = 1;
      // the target bar follows the displayed score: a tiny pulse per landing,
      // and the celebration when the DISPLAYED score crosses a target
      if (!REDUCED) goalPulse = 1;
      if (!bestCrowned && best > 0 && scoreShow > best && state === 'playing') fxBest();   // v3: once a run
      while (scoreShow >= bridgeGoalTarget(goalShow + 1)) { goalShow++; celebrateGoal(); }
      while (fillShow[p.c] >= levelTarget(levelShow[p.c])) {
        fillShow[p.c] -= levelTarget(levelShow[p.c]);
        levelShow[p.c] += 1;
        colourFlash[p.c] = 1;
        const [rx, ry] = hudRingPos(p.c);
        spawnBurst(rx, ry, p.c, 'level');
        sfx.levelUp();
        // the powerup this crossing earned: send the beam that delivers it
        // (never a target's reward — that one flies from the bar, see celebrateGoal)
        const gi = pendingGrants.findIndex(pg => pg.ci === p.c && !pg.goal);
        if (gi !== -1) spawnBeam(p.c, pendingGrants.splice(gi, 1)[0].slot);
        fxLevelShown(p.c);         // v3: the meter's own moment; the swap charge it earned flies to its button
      }
    }
  }
  pops = pops.filter(p => p.t < 1.05);

  /* The target bar's fill eases toward the displayed fraction over
     GOAL_TWEEN_MS (ease-out cubic; a landing mid-tween restarts it from where
     the fill is). After a crossing the full bar is held for GOAL_HOLD_MS, then
     restarts from empty on the new segment. Under REDUCED it simply jumps. */
  if (goalPulse > 0) goalPulse = Math.max(0, goalPulse - dt * 0.005);
  if (goalFlash > 0) goalFlash = Math.max(0, goalFlash - dt * 0.0013);
  if (goalHold > 0) {
    goalHold -= dt;
    if (goalHold <= 0) { goalHold = 0; goalFill = 0; goalTween = null; }
  } else {
    const frac = goalFrac();
    if (REDUCED) { goalFill = frac; goalTween = null; }
    else {
      if (!goalTween || goalTween.to !== frac) goalTween = { from: goalFill, to: frac, t: 0 };
      goalTween.t += dt;
      const k = Math.min(1, goalTween.t / GOAL_TWEEN_MS);
      goalFill = goalTween.from + (goalTween.to - goalTween.from) * (1 - Math.pow(1 - k, 3));
    }
  }

  // grant beams: ring -> tray slot; landing materialises the hidden powerup
  for (const b of beams) {
    b.t += dt / BEAM_MS;
    if (b.t >= 1 && !b.done) {
      b.done = true;
      const piece = tray[b.slot];
      if (piece && piece.merge && piece.hidden) {
        piece.hidden = false;
        tapFlash[b.slot] = 1;
        spawnBurst(b.tx, b.ty, b.c, 'level');
        sfx.tick(0);
        if (JUICE) { themeFx('reward', b.tx, b.ty, b.c, 1); sfx.charge(); buzz(10); }   // v3: the powerup arrived
        activateMergeHint(b.slot);   // first two deliveries teach the placement
      }
    }
  }
  beams = beams.filter(b => b.t < 1.1);

  // the merge lesson runs until its powerup is picked up or stops existing
  if (mergeHintSlot !== -1) {
    const hp = tray[mergeHintSlot];
    if (!hp || !hp.merge || hp.hidden) mergeHintSlot = -1;
    else mergeHintClock += dt;
  }

  // the swap hint's on-screen time runs only while it is really showing
  if (tapHintShowing()) {
    tapStepShown += dt;
    if (tapStepShown >= SWAP_HINT_MS) swapHintOn = false;   // retired, silently
  }

  /* The tutorial's free merge: granted once the third payout has landed, and
     its lesson re-armed if the player picked it up and put it back. */
  if (hintOn && hintStep === HINT_MERGE_STEP && state === 'playing') {
    if (tutMergePending) {
      if (tally.length === 0 && pops.every(p => p.landed)) grantTutorialMerge();
    } else if (tutMergeSlot !== -1 && mergeHintSlot === -1 && !drag) {
      const p = tray[tutMergeSlot];
      if (p && p.merge && !p.hidden) { mergeHintSlot = tutMergeSlot; mergeHintSeen = true; mergeHintCache = null; }
    }
  }

  // swallowed tiles slide into the powerup and shrink out
  if (hintOn || swapHintOn) hintClock += dt;
  for (const m of mergeAnim) {
    m.age += dt;
    m.t = Math.max(0, Math.min(1, (m.age - m.delay) / (m.dur || MERGE_FLIGHT)));
    /* Arrival = collision: the counter ticks up by what flew in, and the
       powerup takes a very tiny punch-scale-and-back plus a blink of shake.
       Display only — tile.v was settled at placement, so game rules never
       wait on the animation. */
    if (m.t >= 1 && !m.done) {
      m.done = true;
      if (m.to) {
        m.to.vShow = Math.min(m.to.v, (m.to.vShow || 1) + m.v);
        m.to.born = Math.max(m.to.born, 0.4);
        m.to.punch = 0.6;
        m.to.shake = Math.max(m.to.shake, 0.45);
        sfx.tick(m.idx || 0);
        spawnBurst(m.tx, m.ty, m.c, 'tick');
        if (m.last) fxMergeDone(m.to, m.tx, m.ty, m.c, m.total || m.to.v || 1);   // v3: the merge is complete
      }
    }
  }
  mergeAnim = mergeAnim.filter(m => m.t < 1);
  for (const b of bursts) {
    if (!b.active) continue;
    b.age += dt;
    if (b.age >= b.dur) b.active = false;
  }
  for (let i = 0; i < 3; i++) {
    const sb = snapBack[i];
    if (!sb) continue;
    sb.t += dt;
    if (sb.t >= sb.dur) snapBack[i] = null;
  }
  if (failShake > 0) failShake = Math.max(0, failShake - dt * 0.0022);
  for (let i = 0; i < tapFlash.length; i++) {
    if (tapFlash[i] > 0) tapFlash[i] = Math.max(0, tapFlash[i] - dt * 0.005);
    if (rotAnim[i]) {
      rotAnim[i].t += dt;
      if (rotAnim[i].t >= ROT_MS) rotAnim[i] = null;
    }
  }
  if (overAt && tallyClock >= overAt) {          // guard state: a restart or Escape may have moved on
    overAt = 0;
    if (state === 'over') showOver();
  }
  /* `pendingOver` is a request to re-check, not a verdict. It is latched inside
     place() so the ripple can finish first — but the payout itself can level a
     colour, and grantMerge then drops a SINGLE-CELL powerup into the tray, which
     fits wherever one cell is free. Committing to the latched flag ended runs
     that still had a legal move. Re-ask now that the tray has settled. */
  if (pendingOver && tally.length === 0 && state === 'playing') {
    pendingOver = false;
    /* v2 (Q5): a powerup owed for want of a free slot must not be lost to a
       game over — in v1 it would have been sitting in the tray. With no move
       left, every piece in hand is dead, so taking one's slot costs nothing. */
    for (let i = 0; i < owedMerges.length && !anyMoveLeft(); i++) {
      const p = mergePiece(owedMerges[i]);
      const dead = tray.findIndex(t => t === null || !t.merge);
      if (dead === -1 || !fitsSomewhere(p)) continue;
      owedMerges.splice(i--, 1);
      tray[dead] = p;
      tapFlash[dead] = 1;
      activateMergeHint(dead);
    }
    if (!anyMoveLeft()) gameOver();
  }
}

// ---------- input ----------
function localPoint(e) {
  const r = cvs.getBoundingClientRect();
  return [e.clientX - r.left, e.clientY - r.top];
}
function slotAt(px, py) {
  if (LANDSCAPE) {                     // right-hand column, slots stacked by Y
    if (px < TRAY_X0 - 6) return -1;
    if (py >= TRAY_BOTTOM - TRAY_RAIL) return -1;          // the rotate button's rail
    const i = Math.floor((py - TRAY_TOP) / ((TRAY_BOTTOM - TRAY_TOP - TRAY_RAIL) / 3));
    return i >= 0 && i < 3 ? i : -1;
  }
  if (py < TRAY_TOP - 10) return -1;
  if (px >= TRAY_X1 - TRAY_RAIL) return -1;            // the rotate button's rail
  const i = Math.floor((px - TRAY_X0) / ((TRAY_X1 - TRAY_X0 - TRAY_RAIL) / 3));
  return i >= 0 && i < 3 ? i : -1;
}

cvs.addEventListener('pointerdown', (e) => {
  if (typeof focus === 'function') focus();
  if (state !== 'playing') return;
  e.preventDefault();
  const [px, py] = localPoint(e);
  for (const kind of TOOL_KINDS) if (toolBtnHit(kind, px, py)) { useTool(kind); return; }
  const slot = slotAt(px, py);
  if (slot >= 0) pickUp(slot, px, py);
});
cvs.addEventListener('pointermove', (e) => {
  if (!drag) return;
  e.preventDefault();
  const [px, py] = localPoint(e);
  dragTo(px, py);
});
cvs.addEventListener('pointerup', (e) => { e.preventDefault(); drop(); });
cvs.addEventListener('pointercancel', () => { drag = null; });
if (typeof addEventListener !== 'undefined') addEventListener('blur', () => { drag = null; });

// ---------- shell ----------
const menuEl = document.getElementById('menu');
const overEl = document.getElementById('over');
const themeBtn = document.getElementById('themeBtn');
const muteBtn = document.getElementById('muteBtn');
const MUTE_ICONS = {
  on: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.2h3.6L12.4 5v14l-4.8-4.2H4z"/>' +
    '<path d="M15.6 8.6a4.8 4.8 0 0 1 0 6.8M18.2 6a8.4 8.4 0 0 1 0 12" stroke="currentColor" stroke-width="1.9" ' +
    'stroke-linecap="round" fill="none"/></svg>',
  off: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.2h3.6L12.4 5v14l-4.8-4.2H4z"/>' +
    '<path d="M15.8 9.4l5 5M20.8 9.4l-5 5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" fill="none"/></svg>',
};
function syncMuteButton() {
  if (!muteBtn) return;
  muteBtn.innerHTML = muted ? MUTE_ICONS.off : MUTE_ICONS.on;
  muteBtn.setAttribute?.('aria-pressed', String(muted));
  muteBtn.setAttribute?.('aria-label', muted ? 'Unmute sound' : 'Mute sound');
}
const ACTION_ICONS = {
  play: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.2v13.6L19 12z"/></svg>',
  /* the rewarded Continue: "watch a video and the middle of the board is cleared". A flat-top board outline whose centre is open and bright
     (the ring around it tinted), three small tiles flying out of the centre, each behind a short motion tick. Wordless, currentColor. */
  rescue: '<svg class="ico rescueIcon" viewBox="0 0 32 32" aria-hidden="true">' +
    '<path d="M31 16L23.5 28.99L8.5 28.99L1 16L8.5 3.01L23.5 3.01ZM22 16L19 21.2L13 21.2L10 16L13 10.8L19 10.8Z" fill="currentColor" fill-rule="evenodd" opacity=".2"/>' +
    '<path d="M31 16L23.5 28.99L8.5 28.99L1 16L8.5 3.01L23.5 3.01Z" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linejoin="round"/>' +
    '<path d="M19 7.5L17.5 10.1L14.5 10.1L13 7.5L14.5 4.9L17.5 4.9ZM26.36 20.25L24.86 22.85L21.86 22.85L20.36 20.25L21.86 17.65L24.86 17.65ZM11.64 20.25L10.14 22.85L7.14 22.85L5.64 20.25L7.14 17.65L10.14 17.65Z" fill="currentColor"/>' +
    '<path d="M16 14.2L16 12.2M17.56 16.9L19.29 17.9M14.44 16.9L12.71 17.9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  loading: '<svg class="ico busyIcon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2.5" opacity=".25"/><path d="M12 4a8 8 0 0 1 8 8" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>',
  video: '<span class="videoBadge" aria-hidden="true"><svg class="ico" viewBox="0 0 28 20"><rect x="1" y="2" width="22" height="16" rx="4"/><path d="m10 6 7 4-7 4Z" fill="#ffda81"/><path d="m24 0 1.2 3.8L29 5l-3.8 1.2L24 10l-1.2-3.8L19 5l3.8-1.2Z"/></svg></span>'
};
function setPlayLoading(loading) {
  const button = document.getElementById('playBtn');
  button.disabled = loading;
  button.setAttribute?.('aria-busy', String(loading));
  button.innerHTML = loading ? ACTION_ICONS.loading : ACTION_ICONS.play;
}
function syncContinueButton() {
  const button = document.getElementById('continueBtn');
  if (!button) return;
  button.hidden = !canContinue(); button.disabled = adPending;
  button.setAttribute?.('aria-busy', String(adPending));
  button.innerHTML = adPending ? ACTION_ICONS.loading : ACTION_ICONS.rescue + ACTION_ICONS.video;
  document.getElementById('againBtn').classList.toggle('secondary', !button.hidden);
  paintShell();
}

function paintShell() {
  document.body.style.background = T.bg;
  T.colors.forEach((color, i) => document.body.style.setProperty?.('--tile-' + 'abc'[i], color));
  // v3: a painted theme may give the two chips and the plaques a body and an edge of their own
  for (const chip of [themeBtn, muteBtn]) {
    chip.style.color = T.chipInk || T.ink;
    chip.style.background = T.chipBg || 'transparent';
    chip.style.borderColor = T.chipEdge || 'currentColor';
  }
  themeBtn.style.display = THEME_LOCK ? 'none' : '';
  document.body.style.fontFamily = T.font || '';
  // the new-best number on the plaque: gold that reads on this theme's plaque (pale gold on a dark one)
  document.body.style.setProperty?.('--best-ink', T.bestInk || (T.style === 'wire' ? '#ffd23f' : '#8a5a00'));
  // a theme's own rules for the page chrome (plaques, buttons, chips): T.css, swapped whole with the theme
  const themeCss = document.getElementById('themeCss');
  if (themeCss) themeCss.textContent = T.css || '';
  for (const p of document.querySelectorAll('.plaque')) {
    p.style.background = T.plaqueBg;
    p.style.color = T.plaqueInk;
    p.style.border = T.plaqueEdge ? '3px solid ' + T.plaqueEdge : 'none';
  }
  for (const b of document.querySelectorAll('.btn')) {
    const secondary = b.classList.contains('secondary');
    b.style.background = secondary ? T.plaqueBg : T.btnBg;
    b.style.color = secondary ? T.plaqueInk : T.btnInk;
  }
  themeBtn.innerHTML = THEME_ICONS[themeName] || T.icon || THEME_ICONS.paper;
  syncMuteButton();
}

function setTheme(name) {
  if (THEME_LOCK) return;                        // v3: a locked build shows one look
  if (!Object.prototype.hasOwnProperty.call(THEMES, name)) return;
  themeName = name;
  T = THEMES[name];
  try { localStorage.setItem('scraps-theme', name); } catch (e) {}
  rebuildSkin();
  paintShell();
}
function cycleTheme() {
  const names = Object.keys(THEMES);
  setTheme(names[(names.indexOf(themeName) + 1) % names.length]);
}

/* v2 (ANALYSIS UI #13): Escape then Play used to restart the run. A run with
   at least one placement is now paused by the menu and resumed by Play; the
   boot run behind the first menu has none, so Play still deals a fresh one. */
let pausedRun = false;
function showMenu() {
  drag = null;
  pausedRun = state === 'playing' && placedCount > 0;
  state = 'menu';
  overEl.classList.remove('open');
  menuEl.classList.add('open');
  document.getElementById('menuBest').textContent = String(displayBest());
}
function showOver() {
  syncContinueButton();
  /* The plaque sits in the exact centre of the window in every layout, a portrait phone included (the user's ruling,
     2026-10-09: "the lose screen is centred, in every layout"). It used to ride high on a phone with inline styles;
     nothing positions it now but the overlay's own centring in the stylesheet. */
  overEl.classList.toggle('tall', !LANDSCAPE);   // portrait: the plaque spans the card, so no HUD edge peeks out beside it
  document.getElementById('overScore').textContent = fmtNum(score);
  document.getElementById('overBest').textContent = fmtNum(displayBest());
  document.getElementById('overBestRow').classList.toggle('newBest', newBestRun);   // gold crown for a new best
  // targets reached this run: shown only once there is one to show
  document.getElementById('overGoals').textContent = String(goalsReached);
  document.getElementById('overGoalsRow').hidden = goalsReached === 0;
  overEl.classList.add('open');
}
function hideOverlays() {
  menuEl.classList.remove('open');
  overEl.classList.remove('open');
}
function playNow() { hideOverlays(); newGame(); }
function resumeOrPlay() {
  if (pausedRun && state === 'menu') { pausedRun = false; hideOverlays(); state = 'playing'; return; }
  playNow();
}

document.getElementById('playBtn').addEventListener('click', () => resumeOrPlay());
document.getElementById('againBtn').addEventListener('click', () => playNow());
document.getElementById('continueBtn').addEventListener('click', watchAdToContinue);
themeBtn.addEventListener('click', cycleTheme);
muteBtn.addEventListener('click', () => setMuted(!muted));
document.addEventListener('keydown', (e) => {
  if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key.toLowerCase();
  if (k === 't') cycleTheme();
  if (k === 'r') playNow();
  if (k === 'm') setMuted(!muted);
  // v3: the tools, through the same function as their buttons (it refuses outside play)
  if (k === 's') useTool('swap');
  if (k === 'u') useTool('undo');
  if (k === 'n') useTool('deal');
  if (e.key === 'Escape' && state !== 'menu') showMenu();
});

// Wavedash build: the developer URL setup was removed here


// Only presentation coordinates, palette and the host integration are adapted.
let bridgeLayout={width:420,height:880,size:400/14,centerX:210,centerY:466,trayY:762,trayRatio:.7,slots:[100,210,320],chargeY:180,toolsY:822,scoreY:90,goalY:144};
let bridgePainter=host.drawTile||null;
let bridgeOverVisible=false;
let bridgeParticleOrigin=-1;
let bridgeParticlePainter=null;
let bridgeTonePainter=null;
let bridgeSoundEvent='';
for(const name of Object.keys(sfx)){
  const original=sfx[name];
  sfx[name]=function(...args){const previous=bridgeSoundEvent;bridgeSoundEvent=name;try{return original.apply(this,args);}finally{bridgeSoundEvent=previous;}};
}
const bridgeOriginalBlip=blip;
blip=function(freq,dur,type,vol,delay){
  if(!bridgeTonePainter)return bridgeOriginalBlip(freq,dur,type,vol,delay);
  const context=ac();if(!context||muted)return;
  if(bridgeTonePainter(context,freq,dur,type,vol,delay,bridgeSoundEvent)===false)bridgeOriginalBlip(freq,dur,type,vol,delay);
};
const bridgeSourceSkin=T.skin;
const bridgeSourceSpawn=spawnPart,bridgeSourceBurst=spawnBurst;
const bridgeColorContexts=new WeakMap();
function bridgeTintStyle(value,c){
  if(typeof value!=='string')return value;
  let channels,alpha=1;
  if(/^#[\da-f]{6}$/i.test(value))channels=[1,3,5].map(i=>parseInt(value.slice(i,i+2),16));
  else if(/^rgba?\(/.test(value)){const v=value.match(/[\d.]+/g).map(Number);channels=v.slice(0,3);alpha=v[3]??1;}
  else return value;
  const level=(Math.max(...channels)+Math.min(...channels))/510;
  const base=T.colors[c].slice(1).match(/../g).map(n=>parseInt(n,16));
  const tint=level<.27?base.map(n=>n*.48):level>.84?base.map(n=>n+(255-n)*.58):level>.65?base.map(n=>n+(255-n)*.25):base;
  return `rgba(${tint.map(Math.round).join(',')},${alpha})`;
}
function bridgeColorContext(g,c){
  let list=bridgeColorContexts.get(g);if(!list){list=[];bridgeColorContexts.set(g,list);}
  if(!list[c]){const methods=new Map();list[c]=new Proxy(g,{get(target,prop){const v=Reflect.get(target,prop,target);if(typeof v!=='function')return v;if(!methods.has(prop))methods.set(prop,v.bind(target));return methods.get(prop);},set(target,prop,value){return Reflect.set(target,prop,(prop==='fillStyle'||prop==='strokeStyle')?bridgeTintStyle(value,c):value,target);}});}
  return list[c];
}
spawnPart=function(p){if(bridgeParticleOrigin>=0)p.originColor=bridgeParticleOrigin;bridgeSourceSpawn(p);};
spawnBurst=function(x,y,c,kind,power){bridgeSourceBurst(x,y,c<0&&bridgeParticleOrigin>=0?bridgeParticleOrigin:c,kind,power);};
const bridgeParticleSkin=bridgeSourceSkin?{
  emit(kind,x,y,c,power){const previous=bridgeParticleOrigin;bridgeParticleOrigin=c>=0&&c<3?c:previous;try{bridgeSourceSkin.emit?.(kind,x,y,c,power);}finally{bridgeParticleOrigin=previous;}},
  particle(g,p,k){bridgeParticlePainter?.(g,p,k);}
}:null;
function bridgeSetTheme(value){
  T={...T,skin:bridgeParticleSkin,colors:value.colors||['#f45d68','#f5c367','#79b9dc'],bg:value.background||'#231e32',ink:value.light||'#f6f1e7',inkSoft:value.muted||'#b1a0bf',plaqueBg:value.background||'#231e32',plaqueInk:value.light||'#f6f1e7',calloutRim:value.background||'#231e32',popInk:value.light||'#f6f1e7',valueInk:value.tileInk||'#ffffff',goal:value.colors?.[1]||'#f5c367',font:'SPORE, sans-serif',style:'minimal',mono:false};
}
bridgeSetTheme(host);
// This edition has two helpers; undo is not stocked or rewarded.
function bridgeGoalTarget(index){return index<=0?0:index<=5?[200,500,1000,2000,5000][index-1]:(index-4)*5000;}
function bridgeGoalCount(value){return value>=5000?5+Math.floor((value-5000)/5000):[200,500,1000,2000].filter(target=>value>=target).length;}
TOOL_START.swap=3;tools.swap=3;
TOOL_START.undo=0;TOOL_MAX.undo=0;tools.undo=0;
goalTools=function(){grantTool('deal',TOOL_REFILL.deal,'goal');};
canUndo=function(){return false;};
const bridgeSourceSendCharge=sendCharge,bridgeSourceToolArrive=toolArrive,bridgeSourceDrawCharges=drawChargeBeams;
function bridgeTrayAt(value,i){return value.trayPositions?.[i]||[value.slots[i],value.trayY];}
function bridgeMeterAt(value,i){return value.meterPositions?.[i]||[value.slots[i],value.chargeY+3];}
function bridgeToolAt(value,i){return value.toolPositions?.[i]||[[100,210,320][i],value.toolsY+16];}
sendCharge=function(kind,from){const previous=chargeBeams.length;bridgeSourceSendCharge(kind,from);if(chargeBeams.length>previous){const c=[0,1,2].find(i=>{const p=bridgeMeterAt(bridgeLayout,i);return Math.hypot(p[0]-from[0],p[1]-from[1])<1;});if(c!==undefined)chargeBeams[chargeBeams.length-1].originColor=c;}};
toolArrive=function(kind){const beam=chargeBeams.find(b=>b.kind===kind&&b.done&&!b.colorDelivered);if(beam)beam.colorDelivered=true;const previous=bridgeParticleOrigin;bridgeParticleOrigin=beam?.originColor??previous;try{bridgeSourceToolArrive(kind);}finally{bridgeParticleOrigin=previous;}};
function bridgeBeamTrail(x0,y0,x1,y1,color,rimWidth,coreWidth){
  ctx.lineCap='round';ctx.strokeStyle='#ffffff';ctx.lineWidth=rimWidth;ctx.globalAlpha=1;
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();
  ctx.strokeStyle=color;ctx.lineWidth=coreWidth;ctx.globalAlpha=.9;
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();
}
drawChargeBeams=function(){
  if(!chargeBeams.length)return;ctx.save();
  for(const b of chargeBeams){
    const progress=b.t*1.16,e=Math.min(1,progress);
    const bow=Math.min(60,Math.hypot(b.tx-b.sx,b.ty-b.sy)*.22)*MOTION;
    const at=k=>{const u=1-k,mx=(b.sx+b.tx)/2-bow,my=(b.sy+b.ty)/2;return [u*u*b.sx+2*u*k*mx+k*k*b.tx,u*u*b.sy+2*u*k*my+k*k*b.ty];};
    const [hx,hy]=at(e),color=b.originColor>=0?T.colors[b.originColor]:(T.goal||GOLD);
    if(!REDUCED){const [qx,qy]=at(Math.max(0,Math.min(1,progress-.16)));bridgeBeamTrail(qx,qy,hx,hy,color,8,4);}
    ctx.globalAlpha=1;ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(hx,hy,7,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=color;ctx.beginPath();ctx.arc(hx,hy,5,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
};
drawBeams=function(){
  for(const b of beams){
    if(b.done)continue;
    const progress=b.t*1.22,e=Math.min(1,progress);
    const hx=b.sx+(b.tx-b.sx)*e,hy=b.sy+(b.ty-b.sy)*e,color=T.colors[b.c];
    ctx.save();
    if(!REDUCED){const tail=Math.max(0,Math.min(1,progress-.22));bridgeBeamTrail(b.sx+(b.tx-b.sx)*tail,b.sy+(b.ty-b.sy)*tail,hx,hy,color,10,5.5);}
    ctx.globalAlpha=1;ctx.fillStyle=color;ctx.beginPath();ctx.arc(hx,hy,6.5+2.5*Math.sin(b.t*12),0,Math.PI*2);ctx.fill();ctx.restore();
  }
};
layout=function(){
  W=bridgeLayout.width;H=bridgeLayout.height;S=bridgeLayout.size;BX=bridgeLayout.centerX;BY=bridgeLayout.centerY;
  TRAY_Y=TRAY_CY=bridgeLayout.trayY;TRAY_S=S*bridgeLayout.trayRatio;TRAY_HALF=bridgeLayout.trayHalfHeight||55;
  const positions=[0,1,2].map(i=>bridgeTrayAt(bridgeLayout,i));
  TRAY_TOP=Math.min(...positions.map(p=>p[1]))-TRAY_HALF;TRAY_BOTTOM=Math.max(...positions.map(p=>p[1]))+TRAY_HALF;
  TRAY_X0=Math.min(...positions.map(p=>p[0]))-58;TRAY_X1=Math.max(...positions.map(p=>p[0]))+58+TRAY_RAIL;
  LANDSCAPE=false;RING_R=3;HUD_RING_Y=bridgeLayout.chargeY+3;HUD_SCORE_Y=bridgeLayout.scoreY;HUD_GOAL_Y=bridgeLayout.goalY;
  DPR=Math.min(globalThis.devicePixelRatio||1,2);
  cvs.width=Math.max(1,Math.round(W*DPR));cvs.height=Math.max(1,Math.round(H*DPR));
  cvs.style.width=W+'px';cvs.style.height=H+'px';ctx.setTransform(DPR,0,0,DPR,0,0);
};
traySlotPos=i=>bridgeTrayAt(bridgeLayout,i);
// One shared radius for all eleven shapes, sized to fit the widest/tallest trio.
// The bounding half-extents are 2.5 radii horizontally and 1.5*sqrt(3) vertically.
trayScale=()=>Math.min(TRAY_S,(bridgeLayout.trayHalfWidth||50)/2.5,(bridgeLayout.trayHalfHeight||55)/(1.5*SQ3));
hudRingPos=i=>bridgeMeterAt(bridgeLayout,i);
hudRewardPos=i=>hudRingPos(i);
hudScoreLine=()=>({x:bridgeLayout.scoreX??210,bigW:0,y:bridgeLayout.scoreY});
goalBarRect=()=>({x:(bridgeLayout.goalX??210)-64,y:bridgeLayout.goalY-2,cx:bridgeLayout.goalX??210,cy:bridgeLayout.goalY,w:128,h:4});
toolBtnPos=kind=>bridgeToolAt(bridgeLayout,kind==='undo'?0:kind==='swap'?1:2);
rotateBtnPos=()=>toolBtnPos('swap');
// Desktop demonstrations follow the pointer, just like real mouse input.
const bridgeSourceDragHintPath=dragHintPath,bridgeSourceMergeGuidePath=mergeGuidePath,bridgeSourceLiftedCellPos=liftedCellPos;
dragHintPath=function(slot){const path=bridgeSourceDragHintPath(slot);if(path&&bridgeLayout.mode==='desktop')path.ty-=S*DRAG_LIFT;return path;};
mergeGuidePath=function(){const path=bridgeSourceMergeGuidePath();if(path&&bridgeLayout.mode==='desktop')path.ty-=S*DRAG_LIFT;return path;};
liftedCellPos=function(px,py,cell,q,r){if(bridgeLayout.mode!=='desktop')return bridgeSourceLiftedCellPos(px,py,cell,q,r);const [x,y]=hexToPixel(cell.dq-q,cell.dr-r,S);return [px+x,py+y];};
drawTile=function(x,y,s,ci,opts){if(bridgePainter)bridgePainter(ctx,x,y,s,ci,opts||{});};
const bridgeOriginalShowOver=showOver;
showOver=function(){bridgeOriginalShowOver();bridgeOverVisible=true;};

// Preserve local tile feedback. Only whole-board kick/failShake translations
// are excluded so the lattice itself does not jump relative to its backdrop.
function bridgeTilePose(tile){
  const [wx,wy]=tileWobble(tile),[bx,by]=boardPix(tile.q,tile.r);
  let x=bx+wx,y=by+wy;
  if(tile.nudge>0){const e=Math.sin((1-tile.nudge)*Math.PI)*S*.09*MOTION;x+=tile.nx*e;y+=tile.ny*e;}
  const tense=tile.shake>0?1+(.5+.5*Math.sin(shakeClock*.02))*.05*MOTION:1;
  let sx=tilePopScale(tile)*tense,sy=sx;
  if(tile.land>0&&!REDUCED){const k=1-tile.land,e=Math.exp(-4.5*k)*Math.cos(k*Math.PI*2.2)*.17;y+=S*.4*e;sx*=1+e*.55;sy*=1-e;}
  return {x,y,sx,sy,value:tile.vShow!=null?tile.vShow:tile.v,valued:!!tile.merged};
}
function bridgeTrayPose(slot,cell){
  const piece=tray[slot];if(!piece)return null;
  let [x,y]=trayCellPos(piece,cell,slot);
  const spin=rotAnim[slot];
  if(spin){
    let cx=0,cy=0;for(const c of piece.cells){const p=trayCellPos(piece,c,slot);cx+=p[0]/piece.cells.length;cy+=p[1]/piece.cells.length;}
    const move=spin.moves.find(m=>m.cell===cell);
    if(move){const from=trayCellPos(piece,{dq:move.fromDq,dr:move.fromDr},slot),to=trayCellPos(piece,cell,slot),k=Math.min(1,spin.t/ROT_MS),e=1-Math.pow(1-k,3);[x,y]=arcLerp(cx,cy,from[0],from[1],to[0],to[1],e);}
  }
  const dead=state==='over'&&!fitsSomewhere(piece),inK=trayInK(slot);
  if(dead)x+=Math.sin(shakeClock*.09+slot)*S*.12*failShake*MOTION;
  return {x,y,scale:trayScale(piece)/S*(1+tapFlash[slot]*.14*MOTION)*(REDUCED?1:.55+.45*inK),alpha:(dead?.4:1)*Math.min(1,inK*1.4),c:cell.c,hidden:!!piece.hidden||!!snapBack[slot]||(drag&&drag.slot===slot),dead};
}
function bridgePreview(piece,q,r){
  return previewGain(piece,q,r);
}
// Larger floating totals, without the original chain-position dots.
for(let i=0;i<CALLOUT_SIZE.length;i++)CALLOUT_SIZE[i]*=1.2;
calloutBox=function(c){
  const size=S*CALLOUT_SIZE[c.tier]*calloutScale(c);
  return [calloutText(c).length*size*.6,size*1.1];
};
drawCallouts=function(){
  if(!callouts.length)return;
  ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
  for(const c of callouts){
    if(!c.fired)continue;
    const hold=CALLOUT_HOLD[c.tier];
    let scale=1,alpha=1,lift=c.t/(CALLOUT_IN+hold+CALLOUT_OUT)*S*.3*MOTION;
    if(c.t<CALLOUT_IN){const k=c.t/CALLOUT_IN;scale=REDUCED?1:.45+.55*backOut(k);alpha=Math.min(1,k*2.4);}
    else if(c.t>CALLOUT_IN+hold){const k=Math.min(1,(c.t-CALLOUT_IN-hold)/CALLOUT_OUT);scale=1-.1*k;alpha=1-k*k;lift+=k*k*S*.9*MOTION;}
    const size=Math.max(9,Math.round(S*CALLOUT_SIZE[c.tier]*calloutScale(c)*scale));
    const label=calloutText(c),col=fxColour(c.c),x=c.x,y=c.y-lift;
    ctx.globalAlpha=alpha;ctx.font=T.mono?`700 ${size}px ui-monospace, Menlo, monospace`:`800 ${size}px ${T.font||'sans-serif'}`;
    if(c.tier>=3){ctx.lineWidth=Math.max(4,size*.34);ctx.strokeStyle=c.tier===4?T.ink:'#ffffff';ctx.strokeText(label,x,y);}
    ctx.lineWidth=Math.max(3,size*.2);ctx.strokeStyle=calloutRim();
    ctx.strokeText(label,x,y);ctx.fillStyle=col;ctx.fillText(label,x,y);
  }
  ctx.restore();
};
// Keep the glint at the upper-right face edge, including deal-in scale.
drawSparkle=function(slot){
  const piece=tray[slot];if(!piece?.merge)return;
  const pose=bridgeTrayPose(slot,piece.cells[0]);if(!pose||pose.hidden)return;
  const phase=((shakeClock/2400)+slot*.37)%1;
  const strength=REDUCED?.5:phase<.4?Math.sin(phase/.4*Math.PI):0;
  if(strength<=0)return;
  const radius=S*pose.scale*(.16+.22*strength)*2;
  ctx.save();ctx.translate(pose.x+S*pose.scale*.55,pose.y-S*pose.scale*.8);ctx.globalAlpha=.95*strength*pose.alpha;
  ctx.fillStyle='#ffffff';ctx.beginPath();
  for(let i=0;i<8;i++){
    const angle=i*Math.PI/4,radiusAt=i%2?radius*.28:radius;
    const x=Math.cos(angle)*radiusAt,y=Math.sin(angle)*radiusAt;
    if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);
  }
  ctx.closePath();ctx.fill();ctx.restore();
};
// The original effects cache pixel coordinates. Rebase them when our responsive
// layout changes, without restarting flights or dropping their pending rewards.
let bridgeLayoutReady=false;
function bridgeSetLayout(value){
  const old={...bridgeLayout},next={...bridgeLayout,...value};
  if(bridgeLayoutReady){
    const ratio=next.size/old.size;
    const boardPoint=(x,y)=>[next.centerX+(x-old.centerX)*ratio,next.centerY+(y-old.centerY)*ratio];
    const anchors=[
      [[old.scoreX??210,old.scoreY],[next.scoreX??210,next.scoreY]],
      [[old.goalX??210,old.goalY],[next.goalX??210,next.goalY]],
      ...[0,1,2].flatMap(i=>[
        [bridgeMeterAt(old,i),bridgeMeterAt(next,i)],
        [bridgeTrayAt(old,i),bridgeTrayAt(next,i)],
        [bridgeToolAt(old,i),bridgeToolAt(next,i)]
      ])
    ];
    const closest=(x,y)=>anchors.reduce((a,b)=>Math.hypot(x-b[0][0],y-b[0][1])<Math.hypot(x-a[0][0],y-a[0][1])?b:a);
    const uiPoint=(x,y)=>{const [from,to]=closest(x,y);return [x+to[0]-from[0],y+to[1]-from[1]];};
    const belongsToBoard=(x,y)=>{
      const dx=Math.max(0,Math.abs(x-old.centerX)-7*old.size);
      const dy=Math.max(0,Math.abs(y-old.centerY)-4.5*Math.sqrt(3)*old.size);
      const [anchor]=closest(x,y);
      return Math.hypot(dx,dy)<=Math.hypot(x-anchor[0],y-anchor[1]);
    };
    const freePoint=(x,y)=>belongsToBoard(x,y)?boardPoint(x,y):uiPoint(x,y);
    const move=(item,x,y,project)=>{const p=project(item[x],item[y]);item[x]=p[0];item[y]=p[1];};
    for(const p of pops){move(p,'sx','sy',boardPoint);[p.tx,p.ty]=bridgeMeterAt(next,p.c);}
    for(const b of beams){move(b,'sx','sy',uiPoint);[b.tx,b.ty]=bridgeTrayAt(next,b.slot);}
    for(const b of chargeBeams){move(b,'sx','sy',uiPoint);[b.tx,b.ty]=bridgeToolAt(next,b.kind==='undo'?0:b.kind==='swap'?1:2);}
    for(const m of mergeAnim){move(m,'x','y',boardPoint);move(m,'tx','ty',boardPoint);if(m.visualStart)move(m.visualStart,'x','y',boardPoint);}
    for(const group of new Set(tally.map(entry=>entry.grp).filter(Boolean)))move(group,'x','y',boardPoint);
    for(const c of callouts)move(c,'x','y',boardPoint);
    for(const f of fxTimers)move(f,'x','y',freePoint);
    for(const b of bursts)if(b.active)move(b,'x','y',freePoint);
    for(const p of parts){
      const before=[p.x,p.y],after=freePoint(p.x,p.y);
      p.x=after[0];p.y=after[1];
      const onBoard=belongsToBoard(before[0],before[1]);
      if(onBoard){p.vx*=ratio;p.vy*=ratio;p.g*=ratio;p.size*=ratio;}
    }
    for(const sb of snapBack)if(sb)move(sb,'x','y',freePoint);
  }
  Object.assign(bridgeLayout,next);layout();bridgeLayoutReady=true;
}
function bridgeRenderEffects(){
  ctx.setTransform(DPR,0,0,DPR,0,0);ctx.clearRect(0,0,W,H);ctx.globalAlpha=1;ctx.shadowBlur=0;
  drawGroupOutline();drawGoalWash();drawBursts();drawParts();
  // This loop is the original render()'s per-tile payout flight, unchanged.
  for(const p of pops){
    const e=p.t<.18?0:(p.t-.18)/.82,k=e*e*(3-2*e);
    const cx=(p.sx+p.tx)/2+p.bow*MOTION,cy=Math.min(p.sy,p.ty)-34*MOTION,u=1-k;
    const lx=u*u*p.sx+2*u*k*cx+k*k*p.tx,ly=u*u*p.sy+2*u*k*cy+k*k*p.ty;
    const growIn=Math.min(1,p.t/.12),shrink=1-k*.45,scale=growIn*shrink,label='+'+p.n;
    const size=Math.max(1,Math.round((T.mono?17:19)*scale));
    ctx.font=T.mono?`700 ${size}px ui-monospace, Menlo, monospace`:`800 ${size}px ${T.font||'"Avenir Next", sans-serif'}`;
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.globalAlpha=popAlpha(p,k,lx,ly);ctx.lineWidth=Math.max(2,size*.24);ctx.strokeStyle=T.colors[p.c];
    ctx.strokeText(label,lx,ly);ctx.fillStyle=T.popInk||T.ink;ctx.fillText(label,lx,ly);ctx.globalAlpha=1;
  }
  drawCallouts();drawBeams();drawChargeBeams();
  if(state==='playing'&&!drag){if(hintOn&&hintStep<HINT_MERGE_STEP)drawDragHint();else if(mergeGuideTarget())drawMergeGuide();else if(tapHintShowing())drawTapHint();}
  for(let i=0;i<3;i++){
    const sb=snapBack[i],piece=tray[i];if(!sb||!piece)continue;
    const p=Math.min(1,sb.t/sb.dur),e=1-Math.pow(1-p,3),target=trayCellPos(piece,{dq:sb.grabDq,dr:sb.grabDr},i);
    const wag=REDUCED?0:Math.sin(p*Math.PI*5)*(1-p)*8,ax=sb.x+(target[0]-sb.x)*e+wag,ay=sb.y+(target[1]-sb.y)*e,s=S+(trayScale(piece)-S)*e;
    for(const c of [...piece.cells].sort((a,b)=>(a.dr+a.dq/2)-(b.dr+b.dq/2))){const [x,y]=hexToPixel(c.dq-sb.grabDq,c.dr-sb.grabDr,s);drawTile(ax+x,ay+y,s,c.c,{dragging:p<.5,merge:!!piece.merge});}
  }
  for(let i=0;i<3;i++){const p=tray[i];if(!p||p.hidden||(drag&&drag.slot===i)||snapBack[i])continue;if(state==='over'&&!fitsSomewhere(p))drawNoFit(i);else if(p.merge)drawSparkle(i);}
}

best=loadBest();loadMute();loadTutorial();layout();hideOverlays();newGame();
return {
  canvas:cvs,
  setPainter(fn){bridgePainter=fn;},
  setParticlePainter(fn){bridgeParticlePainter=fn;},
  setTonePainter(fn){bridgeTonePainter=fn;},
  setTheme:bridgeSetTheme,
  setLayout:bridgeSetLayout,
  reset(){bridgeOverVisible=false;hideOverlays();newGame();},
  update(dt){update(Math.min(64,dt));},
  renderEffects:bridgeRenderEffects,
  get board(){return board;},get tray(){return tray;},get score(){return score;},get displayedScore(){return scoreShow;},get best(){return best;},
  get state(){return state;},get overVisible(){return bridgeOverVisible;},get placedCount(){return placedCount;},get undoSnapshot(){return undoSnap;},get tools(){return tools;},
  get towers(){return colourLevel.map((level,c)=>({level,fill:colourFill[c],target:levelTarget(level)}));},
  get displayedTowers(){return levelShow.map((level,c)=>({level,fill:fillShow[c],target:levelTarget(level),flash:colourFlash[c],tick:colourTick[c],pop:meterPop[c]}));},
  get goal(){return bridgeGoalTarget(goalHold>0?goalShow:goalShow+1);},get goalsReached(){return goalsReached;},
  get visual(){return {clock:shakeClock,scorePulse,bestGlow,goalPulse,goalFlash,goalHold,goalFill,dealClock,mergeAnim,failShake};},
  get tutorial(){return {active:hintOn,step:hintStep,mergeSlot:tutMergeSlot,swap:swapHintOn};},
  get sound(){return {get muted(){return muted;},unlock:ac,toggle(){setMuted(!muted);return muted;},effects:sfx};},
  canPlace,preview:bridgePreview,fits:fitsSomewhere,toolState:toolBtnState,
  tilePose:bridgeTilePose,trayPose:bridgeTrayPose,dealFactor:dealK,
  beginPick(slot,x,y){pickUp(slot,x,y);return !!drag;},
  movePick(x,y,hover){if(!drag)return;drag.moved=Math.max(drag.moved,Math.hypot(x-drag.x0,y-drag.y0));drag.x=x;drag.y=y;drag.hover=hover;drag.preview=hover?previewGain(tray[drag.slot],hover[0],hover[1]):null;},
  cancelPick(){drag=null;},
  resolveAnchor(q,r,x,y,slot){
    const piece=tray[slot];if(!piece)return null;
    const lifted=[q,r],guide=guidedTarget(slot);
    if(guide&&hexDist(lifted,guide)<=1)return guide;
    return canPlace(piece,q,r)?lifted:null;
  },
  releasePick(hover,heldX,heldY,pivotX,pivotY,moved,heldScale=1){
    if(!drag)return false;const before=placedCount;
    const [gx,gy]=hexToPixel(drag.grabDq,drag.grabDr,S);
    drag.x=heldX+(gx-pivotX)*heldScale;drag.y=heldY+(gy-pivotY)*heldScale+S*DRAG_LIFT;drag.moved=moved;drag.hover=hover;drop();return placedCount!==before;
  },
  keyboardPlace(slot,q,r){if(state!=='playing'||!tray[slot]||tray[slot].hidden||!canPlace(tray[slot],q,r))return false;drag=null;place(slot,q,r);return true;},
  useTool,
  legalMergeCells(c){return mergeTargets(c);},
  constants:{TARGET_STEP,TOOL_START,TOOL_MAX,TOOL_REFILL,MERGE_STAGGER,MERGE_FLIGHT,BEAM_MS,SHAKE_MS,TALLY_STEP,SHAKE_LEAD,ROT_MS,SNAPBACK_MS,TRAY_IN_MS,TRAY_IN_STAGGER,GAMEOVER_HOLD,TAP_SLOP}
};

}
