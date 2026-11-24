// Cache DOM references once; only write values that actually changed.
export function createHudView(game, core, sound, motion, highlight='#f5c367') {
  const get = id => document.getElementById(id);
  const score = get('score'), goal = get('goal-target'), soundButton = get('sound');
  const goalProgress=get('goal-progress'),goalProgressFill=get('goal-progress-fill');
  const meters = [0, 1, 2].map(c => ({
    node: get('meter-' + c), track: get('meter-' + c).querySelector('.charge-track'), caption: get('meter-' + c).querySelector('.charge-caption'),
    bar: get('charge-' + c), level: get('level-' + c),
  }));
  for(const meter of meters){
    meter.gain=document.createElement('i');meter.gain.className='charge-gain';
    meter.gain.setAttribute('aria-hidden','true');meter.track.insertBefore(meter.gain,meter.bar);
  }
  const tools = ['undo', 'swap', 'deal'].map(kind => ({
    kind, node: get(kind), icon: get(kind).querySelector('.tool-icon, svg'), count: get(kind + '-count'), value: get(kind + '-count').querySelector('b'),
  }));
  const styles = new WeakMap();
  const texts = new WeakMap(), attributes = new WeakMap();
  let lastScore, lastGoal, scoreFit=1, scoreFitDirty=true;
  const scene=document.getElementById('scene-ui'),scoreboard=score.parentElement,pause=get('pause');
  document.fonts?.ready.then(()=>{scoreFitDirty=true;});
  function fitScore(){
    const width=score.scrollWidth;
    if(!width)return;
    let available=scoreboard.clientWidth;
    if(scene.dataset.layout==='mobile'){
      const center=scoreboard.offsetLeft+scoreboard.clientWidth/2;
      const pauseRight=pause.parentElement.offsetLeft+pause.offsetWidth;
      const goalLeft=scoreboard.offsetLeft+scoreboard.clientWidth-goal.parentElement.offsetWidth;
      available=Math.max(0,2*Math.min(center-pauseRight-8,goalLeft-center-8));
    }
    scoreFit=Math.min(1,available/(width*(1+.12*motion)));
    scoreFitDirty=false;
  }
  function style(node, name, value) {
    let cache = styles.get(node);
    if (!cache) { cache = {}; styles.set(node, cache); }
    if (cache[name] !== value) { cache[name] = value; node.style[name] = value; }
  }
  const text = (node, value) => { value = String(value); if (texts.get(node) !== value) { texts.set(node, value); node.textContent = value; } };
  function attr(node, name, value) {
    value = String(value);
    let cache = attributes.get(node);
    if (!cache) { cache = {}; attributes.set(node, cache); }
    if (cache[name] !== value) { cache[name] = value; node.setAttribute(name, value); }
  }
  return {
    setHighlight(color){highlight=color;},
    invalidateScoreFit(){scoreFitDirty=true;for(const meter of meters)meter.trackWidth=undefined;},
    update() {
      const visual = core.visual;
      const progress=Math.max(0,Math.min(1,visual.goalFill));
      style(goalProgressFill,'transform',`scaleX(${progress})`);
      attr(goalProgress,'aria-valuenow',Math.round(progress*100));
      if (lastScore !== game.displayedScore) { lastScore = game.displayedScore; text(score, lastScore.toLocaleString('ru-RU')); scoreFitDirty=true; }
      if (lastGoal !== game.goal) { lastGoal = game.goal; text(goal, lastGoal.toLocaleString('ru-RU')); scoreFitDirty=true; }
      if(scoreFitDirty)fitScore();
      style(score, 'transform', `scale(${scoreFit * (1 + visual.scorePulse * .12 * motion)})`);
      style(score, 'color', visual.bestGlow > 0 ? highlight : '');
      game.displayedTowers.forEach((tower, c) => {
        const meter = meters[c];
        const fraction=Math.max(0,Math.min(1,tower.fill/tower.target)),previous=meter.previous;
        if(meter.trackWidth===undefined){const width=meter.track.clientWidth;if(width>24)meter.trackWidth=width;}
        const trackWidth=meter.trackWidth||86;
        const visibleFraction=value=>value>0?(24/(trackWidth-24))+(1-24/(trackWidth-24))*value:0;
        const nextWidth=`calc((100% - 24px) * ${visibleFraction(fraction)})`;
        if(previous&&(previous.level!==tower.level||tower.fill<previous.fill)){
          meter.fillAnimation?.cancel();meter.fillAnimation=null;
          style(meter.bar,'width',nextWidth);
        }else if(previous&&tower.fill>previous.fill){
          const currentWidth=getComputedStyle(meter.bar).width;
          meter.fillAnimation?.cancel();
          style(meter.bar,'width',nextWidth);
          const animation=meter.bar.animate([{width:currentWidth},{width:nextWidth}],{duration:300,easing:'linear'});
          meter.fillAnimation=animation;
          animation.onfinish=()=>{if(meter.fillAnimation===animation)meter.fillAnimation=null;};
        }else if(!previous){style(meter.bar,'width',nextWidth);}
        style(meter.gain,'width',`max(0px, calc((100% - 24px) * ${visibleFraction(fraction)} - 1px))`);
        meter.previous={fill:tower.fill,level:tower.level,fraction};
        text(meter.level, tower.level);
        attr(meter.level, 'aria-label', 'Уровень ' + tower.level);
        attr(meter.node, 'aria-valuenow', tower.fill); attr(meter.node, 'aria-valuemax', tower.target);
        attr(meter.node, 'aria-valuetext', `${tower.fill} из ${tower.target}, уровень ${tower.level}`);
        style(meter.bar, 'transform', 'none');
        const meterScale=`scale(${1 + (tower.flash * .10 + tower.tick * .06) * motion})`;
        style(meter.track, 'transform', meterScale);
        style(meter.caption, 'transform', meterScale);
        style(meter.level, 'transform', `scale(${1 + tower.pop * .2 * motion})`);
      });
      for (const tool of tools) {
        const state = core.toolState(tool.kind), disabled = game.state !== 'playing';
        if (tool.node.disabled !== disabled) tool.node.disabled = disabled;
        if (tool.usable !== state.usable) { tool.usable = state.usable; tool.node.classList.toggle('unavailable', !state.usable); }
        if(tool.value)text(tool.value,state.shown);else text(tool.count,state.shown);
        if(tool.kind!=='undo')attr(tool.node,'aria-label',`${tool.kind==='swap'?'Переставить цвета в фигурах':'Новая раздача'}: ${state.n} из ${state.max}`);
        style(tool.icon, 'transform', `translateX(${Math.sin(visual.clock * .05) * state.shake * 4 * motion}px) rotate(${tool.kind === 'swap' ? state.spin * 180 : state.use * 22}deg)`);
        style(tool.count, 'transform', `scale(${1 + state.pip * .25 * motion})`);
        style(tool.node, 'filter', state.flash > 0 ? `brightness(${1 + state.flash * .7})` : '');
      }
      attr(soundButton, 'aria-pressed', sound.muted);
      attr(soundButton, 'aria-label', sound.muted ? 'Включить звук' : 'Выключить звук');
    },
  };
}
