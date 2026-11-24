import {CELLS,key,hexToPixel,pixelToHex} from './model.mjs';
import {Game} from './original-game.mjs';
import {calculateLayout,SCENE_WIDTH,TRAY_SLOTS,DRAG_SETTINGS} from './mobile-layout.mjs';
import {createHudView} from './hud-view.mjs';
import {toggleFullscreen} from './mobile-fullscreen.mjs';
import {VISUAL_THEME,VISUAL_THEMES,getNextTheme,getEngineTheme} from './visual-theme.mjs';
import {createThemeAssetLoader} from './theme-assets.mjs';
import {createParticlePainter} from './particle-painter.mjs';
import {createSoftGlassPalette,createWoodGlassPalette,createWarmCeramicPalette,createSoftOriginalPalette} from './sound-palette.mjs';
import {readLeaderboard,submitLeaderboardScore} from './vk-leaderboard.mjs';
let visualTheme=VISUAL_THEME;
try{localStorage.removeItem('hex-unlocked-themes');}catch{}
try{const saved=localStorage.getItem('hex-visual-theme'),unlocked=JSON.parse(localStorage.getItem('hex-unlocked-themes')||'[]');if(saved==='warm-flat-test'||(['pearl','monochrome'].includes(saved)&&Array.isArray(unlocked)&&unlocked.includes(saved)))visualTheme=VISUAL_THEMES[saved];}catch{}
const {Application,Assets,Container,Sprite,Graphics,Text,Rectangle}=PIXI;
const W=SCENE_WIDTH,CENTER={x:W/2,y:466},SLOTS=TRAY_SLOTS;
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches,MOTION=REDUCED?.32:1;
applyPageTheme(visualTheme);
const $=id=>document.getElementById(id),game=new Game(getEngineTheme(visualTheme)),core=game.engine,sound=core.sound;
let resultPreviousBest=game.best;
let resultPopBuffer=null;
function playResultPop(index){
  if(sound.muted)return;const context=sound.unlock();if(!context)return;
  if(!resultPopBuffer||resultPopBuffer.sampleRate!==context.sampleRate){
    resultPopBuffer=context.createBuffer(1,Math.ceil(context.sampleRate*.08),context.sampleRate);
    const samples=resultPopBuffer.getChannelData(0);for(let i=0;i<samples.length;i++)samples[i]=(Math.random()*2-1)*Math.pow(1-i/samples.length,3);
  }
  const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain(),now=context.currentTime;
  source.buffer=resultPopBuffer;filter.type='bandpass';filter.frequency.value=1100+(index%3)*240;filter.Q.value=.7;
  gain.gain.setValueAtTime(.09,now);gain.gain.exponentialRampToValueAtTime(.001,now+.08);
  source.connect(filter);filter.connect(gain);gain.connect(context.destination);source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};source.start(now);
}
const soundPalettes=[{id:'original',name:'исходные',paint:null},{id:'soft-glass',name:'мягкое стекло',paint:createSoftGlassPalette()},{id:'wood-glass',name:'дерево и стекло',paint:createWoodGlassPalette()},{id:'warm-ceramic',name:'тёплая керамика',paint:createWarmCeramicPalette()},{id:'soft-original',name:'мягкие тона',paint:createSoftOriginalPalette()}];
let soundPaletteIndex=4;
try{const saved=globalThis.localStorage.getItem('hex-sound-palette-v5'),index=soundPalettes.findIndex(p=>p.id===saved);if(index>=0)soundPaletteIndex=index;}catch{}
function syncSoundPalette(){
  const palette=soundPalettes[soundPaletteIndex],button=$('sound-palette');
  core.setTonePainter(palette.paint);button.textContent=String(soundPaletteIndex+1);
  button.title=`Звуки ${soundPaletteIndex+1}: ${palette.name}`;
  button.dataset.palette=palette.id;button.removeAttribute('aria-pressed');
  button.setAttribute('aria-label',`${button.title}. Переключить на следующий набор`);
}
syncSoundPalette();
const hudView=createHudView(game,core,sound,MOTION,visualTheme.colors[1]);
let H=880,S=400/14,TRAY_Y=762,chargeY=180,toolsY=822;
let app,root,backdrop,boardShadow,introLayer,boardLayer,previewLayer,legalLayer,trayLayer,dragLayer,geometry,textures,drag=null;
let trayViews=[],trayRefs=[],introViews=[],boardViews=new Map(),mergeViews=new Map(),tileImages=[];
let overShown=false,lastPreview='',lastViewport=null,resizeFrame=0;
let paused=false,introFinished=false,resumeRevealClock=null,hudFadeStarted=null;
function showHudAfterReveal(){
  const duration=REDUCED?0:300;hudFadeStarted=duration?performance.now():null;trayLayer.alpha=duration?0:1;trayLayer.visible=true;
  for(const node of [$('scene-ui'),core.canvas]){node.style.visibility='';if(duration)node.animate([{opacity:0},{opacity:1}],{duration,easing:'ease-out'});}
}
function revealFactor(q,r,clock){if(REDUCED)return Math.min(1,clock/220);const d=(Math.abs(q)+Math.abs(r)+Math.abs(q+r))/2,u=clamp((clock-d*55)/240,0,1);return 1-Math.pow(1-u,3);}
function resumeGame(){paused=false;$('pause-dialog').close();$('pause').focus();}
function pauseGame(){if(paused||$('dialog').open||game.state!=='playing')return;cancelDrag();paused=true;const dialog=$('pause-dialog');dialog.classList.remove('entering','resuming');dialog.showModal();void dialog.offsetWidth;dialog.classList.add('entering');}
function resumeAnimated(){const dialog=$('pause-dialog');if(dialog.classList.contains('resuming')||dialog.classList.contains('leaving'))return;dialog.classList.remove('entering');dialog.classList.add('resuming');setTimeout(()=>{dialog.classList.remove('resuming');resumeGame();},REDUCED?0:150);}
let currentLayout=null;
const trayPosition=slot=>currentLayout?.trayPositions[slot]||[SLOTS[slot],TRAY_Y];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const point=(q,r)=>{const p=hexToPixel(q,r,S);return{x:CENTER.x+p.x,y:CENTER.y+p.y};};
function clear(layer){for(const child of layer.removeChildren())child.destroy({children:true});}
function pointer(e){const r=app.canvas.getBoundingClientRect();return{x:(e.clientX-r.left-root.x)/root.scale.x,y:(e.clientY-r.top-root.y)/root.scale.y};}
function tileInk(c){return visualTheme.id==='monochrome'&&c===2?'#ffffff':visualTheme.tileInk;}
function label(text,size=S*.71){const node=new Text({text:String(text),style:{fontFamily:'SPORE, sans-serif',fontWeight:'700',fontSize:size,fill:visualTheme.tileInk}});node.anchor.set(.5);return node;}
function outline(x,y,r,color,alpha=.6){const pts=[];for(let i=0;i<6;i++)pts.push(x+Math.cos(i*Math.PI/3)*r,y+Math.sin(i*Math.PI/3)*r);return new Graphics().poly(pts).stroke({color,alpha,width:1.5,join:'round'});}
function addBonusMark(node){
  node.addChild(new Graphics().circle(0,0,S*.29).stroke({color:0xffffff,width:S*.15}));
}
function paintBonusMark(g,x,y,size){
  g.save();g.strokeStyle='#ffffff';g.lineWidth=size*.15;
  g.beginPath();g.arc(x,y,size*.29,0,Math.PI*2);g.stroke();g.restore();
}
function makeTile(c,value=1,merge=false,valued=false,withShadow=true){
  const node=new Container(),face=new Sprite(withShadow?textures.shadowTiles[c]:textures.tiles[c]);
  face.anchor.set(geometry.tile.anchor.x,geometry.tile.anchor.y);face.width=face.height=geometry.placement.spriteLogicalWidth*S/geometry.board.latticeRadius;
  if(withShadow){
    // Shadow and face share one texture, avoiding overlapping translucent quads.
    face.anchor.set((8+64*geometry.tile.anchor.x)/80,(8+64*geometry.tile.anchor.y)/80);
    face.width=face.height=face.width*80/64;
  }
  node.addChild(face);node.face=face;node.withShadow=withShadow;node.valueLabel=null;node.valueShown=null;node.colorShown=null;
  if(merge)addBonusMark(node);
  syncTile(node,c,value,valued);return node;
}
function syncTile(node,c,value=1,valued=false){
  const colorChanged=c!==node.colorShown;
  if(colorChanged){node.face.texture=node.withShadow?textures.shadowTiles[c]:textures.tiles[c];node.colorShown=c;}
  const visible=valued||value>1;
  let created=false;
  if(visible&&!node.valueLabel){node.valueLabel=label(value);node.valueLabel.y=-1;node.addChild(node.valueLabel);created=true;}
  if(node.valueLabel){if(created||colorChanged)node.valueLabel.style.fill=tileInk(c);node.valueLabel.visible=visible;if(node.valueShown!==value)node.valueLabel.text=String(value);}
  node.valueShown=value;
}
function pivot(piece){const ps=piece.cells.map(c=>hexToPixel(c.dq,c.dr,S));return{x:(Math.min(...ps.map(p=>p.x))+Math.max(...ps.map(p=>p.x)))/2,y:(Math.min(...ps.map(p=>p.y))+Math.max(...ps.map(p=>p.y)))/2};}
function makeHeld(piece){
  const node=new Container(),p=pivot(piece);
  for(const c of [...piece.cells].sort((a,b)=>hexToPixel(a.dq,a.dr,S).y-hexToPixel(b.dq,b.dr,S).y)){const tile=makeTile(c.c,1,piece.merge),at=hexToPixel(c.dq,c.dr,S);tile.position.set(at.x-p.x,at.y-p.y);node.addChild(tile);}
  return node;
}
function renderBoard(){
  let departing=null;
  for(const [k,entry] of boardViews)if(game.board.get(k)!==entry.ref){
    // Build this lookup only when board ownership changes, not on idle frames.
    if(!departing){
      departing=new Map();
      for(const motion of core.visual.mergeAnim)if(!mergeViews.has(motion)){
        const cell=pixelToHex(motion.x-CENTER.x,motion.y-CENTER.y,S);departing.set(key(cell.q,cell.r),motion);
      }
    }
    const motion=departing.get(k),node=entry.node;
    if(motion){
      // Reuse the last rendered object: no reset of position, scale or label.
      motion.visualStart={x:node.x,y:node.y,sx:node.scale.x,sy:node.scale.y,alpha:node.alpha};
      mergeViews.set(motion,node);
    }else node.destroy({children:true});
    boardViews.delete(k);
  }
  for(const [k,t] of game.board){
    let entry=boardViews.get(k);if(!entry){const node=makeTile(t.c,t.vShow??t.v,false,!!t.merged);boardLayer.addChild(node);entry={ref:t,node};boardViews.set(k,entry);}
    const pose=core.tilePose(t),node=entry.node;syncTile(node,t.c,pose.value,pose.valued);node.position.set(pose.x,pose.y);const reveal=resumeRevealClock===null?1:revealFactor(t.q,t.r,resumeRevealClock);node.visible=reveal>0;node.alpha=Math.min(1,reveal*1.4);node.scale.set(pose.sx*(REDUCED?1:.55+.45*reveal),pose.sy*(REDUCED?1:.55+.45*reveal));node.zIndex=pose.y;
  }
}
function rebuildTray(force=false){
  for(let slot=0;slot<3;slot++){
    if(!force&&trayViews[slot]&&trayRefs[slot]===game.tray[slot])continue;
    if(trayViews[slot])trayViews[slot].destroy({children:true});
    const holder=new Container({sortableChildren:true});holder.position.set(...trayPosition(slot));holder.eventMode='static';holder.cursor='grab';const halfW=(currentLayout?.trayHalfWidth||50)+3,halfH=(currentLayout?.trayHalfHeight||55)+3;holder.hitArea=new Rectangle(-halfW,-halfH,halfW*2,halfH*2);holder.on('pointerdown',event=>beginDrag(slot,event.nativeEvent));
    holder.tiles=[];const piece=game.tray[slot];if(piece)for(const cell of piece.cells){const node=makeTile(cell.c,1,!!piece.merge);holder.addChild(node);holder.tiles.push({node,cell});}
    trayViews[slot]=holder;trayRefs[slot]=piece;trayLayer.addChild(holder);
  }
}
function renderTray(){
  if(game.tray.some((p,i)=>p!==trayRefs[i]))rebuildTray();
  for(let slot=0;slot<3;slot++){
    const holder=trayViews[slot],piece=game.tray[slot],[slotX,slotY]=trayPosition(slot);holder.position.set(slotX,slotY);holder.visible=!!piece&&!piece.hidden;
    if(!piece)continue;
    for(const entry of holder.tiles){const pose=core.trayPose(slot,entry.cell);entry.node.visible=!pose.hidden;entry.node.position.set(pose.x-slotX,pose.y-slotY);entry.node.zIndex=pose.y;entry.node.scale.set(pose.scale);entry.node.alpha=pose.alpha;syncTile(entry.node,pose.c);}
  }
}
function renderMerges(){
  const motions=core.visual.mergeAnim;if(!motions.length&&!mergeViews.size)return;
  const current=new Set(motions);
  for(const [motion,node] of mergeViews)if(!current.has(motion)){node.destroy({children:true});mergeViews.delete(motion);}
  for(const motion of motions){
    let node=mergeViews.get(motion);if(!node){node=makeTile(motion.c,motion.v);boardLayer.addChild(node);mergeViews.set(motion,node);}
    const start=motion.visualStart||{x:motion.x,y:motion.y,sx:1,sy:1,alpha:1};
    // Anticipation grows continuously from the displayed scale. Flight starts
    // at that same scale, instead of jumping from1.04 back to1.
    const anticipation=clamp(Math.min(motion.age||0,motion.delay||0)/90,0,1),ease=1-Math.pow(1-anticipation,3);
    const sx=start.sx+(1.04-start.sx)*ease,sy=start.sy+(1.04-start.sy)*ease;
    if(motion.t<=0){node.position.set(start.x,start.y);node.scale.set(sx,sy);node.alpha=start.alpha;}
    else{const k=motion.t*motion.t;node.position.set(start.x+(motion.tx-start.x)*k,start.y+(motion.ty-start.y)*k);node.scale.set(sx*(1-k*.66),sy*(1-k*.66));node.alpha=start.alpha*(1-k*k);}
    node.zIndex=node.y;
  }
}
function updateHUD(){
  hudView.update();
  if(core.overVisible&&!overShown){overShown=true;showResultLeaderboard();}
}
function pickCandidate(origin){
  const next=pixelToHex(origin.x-CENTER.x,origin.y-CENTER.y,S);
  if(drag.candidate){const old=drag.candidate,a=point(old.q,old.r),b=point(next.q,next.r);if(Math.hypot(origin.x-a.x,origin.y-a.y)<=Math.hypot(origin.x-b.x,origin.y-b.y)+3)return old;}
  return next;
}
function preview(hover){
  const signature=hover?'valid:'+key(hover[0],hover[1]):'invalid:'+key(drag.candidate?.q,drag.candidate?.r);if(signature===lastPreview)return;lastPreview=signature;clear(previewLayer);
  drag.hover=hover;drag.preview=hover?game.preview(drag.piece,hover[0],hover[1]):null;
  if(hover)for(const c of drag.piece.cells){const p=point(hover[0]+c.dq,hover[1]+c.dr),node=makeTile(c.c,1,drag.piece.merge,false,false);node.position.set(p.x,p.y);node.zIndex=p.y;node.alpha=.4;previewLayer.addChild(node);}
  else if(drag.candidate)for(const c of drag.piece.cells){const p=point(drag.candidate.q+c.dq,drag.candidate.r+c.dr);previewLayer.addChild(outline(p.x,p.y,S*.93,0xe8322a,.55));}
  if(drag.preview)$('status').textContent=drag.preview.gained?`+${drag.preview.gained}`:'Отпусти, чтобы поставить';else $('status').textContent='Здесь фигура не помещается';
}
function poseDrag(){
  if(!drag||drag.keyboard)return;
  const touchProgress=clamp((performance.now()-drag.pressedAt)/DRAG_SETTINGS.tapDuration,0,1),touchEase=1-Math.pow(1-touchProgress,3);
  if(!drag.active){
    if((drag.moved||0)<core.constants.TAP_SLOP){
      drag.node.position.set(drag.homeX,drag.homeY-(drag.direct?0:DRAG_SETTINGS.minLift*touchEase));drag.node.scale.set(drag.direct?drag.startScale:drag.startScale+(1.06-drag.startScale)*touchEase);
      core.movePick(drag.pointer.x,drag.pointer.y,null);return;
    }
    drag.active=true;drag.began=performance.now();
  }
  const travelled=clamp((drag.start.y-drag.pointer.y)/DRAG_SETTINGS.liftDistance,0,1),smooth=travelled*travelled*(3-2*travelled),lift=DRAG_SETTINGS.minLift+(DRAG_SETTINGS.maxLift-DRAG_SETTINGS.minLift)*smooth;
  const k=clamp((performance.now()-drag.began)/115,0,1),e=drag.direct?1-Math.pow(1-k,3):touchEase;
  const heldScale=drag.startScale+(1.06-drag.startScale)*e;
  drag.node.scale.set(heldScale);
  if(drag.direct)drag.node.position.set(drag.pointer.x-drag.gripX,drag.pointer.y-drag.gripY);
  else drag.node.position.set(drag.homeX+(drag.pointer.x-drag.start.x)*DRAG_SETTINGS.horizontalFactor,drag.homeY+(drag.pointer.y-drag.start.y)-lift*e);
  const origin={x:drag.node.x-drag.pivot.x*heldScale,y:drag.node.y-drag.pivot.y*heldScale};drag.candidate=pickCandidate(origin);
  const at=core.resolveAnchor(drag.candidate.q,drag.candidate.r,drag.pointer.x,drag.pointer.y,drag.slot);
  preview(at);core.movePick(drag.pointer.x,drag.pointer.y,at);
}
function beginDrag(slot,e){
  const source=game.tray[slot];if(paused||drag||game.state!=='playing'||!source||source.hidden||$('dialog').open||e.button>0)return;
  e.preventDefault();sound.unlock();app.canvas.focus({preventScroll:true});const p=pointer(e);
  if(!core.beginPick(slot,p.x,p.y))return;
  const piece=structuredClone(source),node=makeHeld(piece),[slotX,slotY]=trayPosition(slot);
  const direct=e.pointerType!=='touch',startScale=Math.max(.01,core.trayPose(slot,source.cells[0]).scale);
  node.position.set(slotX,slotY);node.scale.set(startScale);dragLayer.addChild(node);
  drag={slot,piece,node,pivot:pivot(piece),pointer:p,start:{...p},began:performance.now(),gripX:p.x-slotX,gripY:p.y-slotY,homeX:slotX,homeY:slotY,direct,startScale,active:false,pointerId:e.pointerId,candidate:null,hover:null};lastPreview='';
  drag.pressedAt=drag.began;
  if(piece.merge)for(const [q,r] of core.legalMergeCells(piece.cells[0].c)){const p=point(q,r),node=makeTile(piece.cells[0].c,1,false,false,false);node.position.set(p.x,p.y);legalLayer.addChild(node);}
  try{app.canvas.setPointerCapture(e.pointerId);}catch{}
  poseDrag();
}
function removeDrag(){
  const old=drag;drag=null;clear(previewLayer);clear(legalLayer);lastPreview='';
  if(old){
    old.node.destroy({children:true});
    if(!old.keyboard&&app.canvas.hasPointerCapture(old.pointerId))app.canvas.releasePointerCapture(old.pointerId);
  }
  return old;
}
function cancelDrag(){if(!drag)return;core.cancelPick();removeDrag();$('status').textContent='';}
function finishDrag(e){
  if(!drag||drag.keyboard||e.pointerId!==drag.pointerId)return;
  moveDrag(e);
  const d=drag,moved=d.moved||0;
  if(moved<core.constants.TAP_SLOP&&performance.now()-d.pressedAt>=DRAG_SETTINGS.tapDuration){cancelDrag();renderTray();return;}
  core.releasePick(d.hover,d.node.x,d.node.y,d.pivot.x,d.pivot.y,moved,d.node.scale.x);removeDrag();renderBoard();renderTray();updateHUD();
}
function moveDrag(event){
  if(!drag||drag.keyboard||event.pointerId!==drag.pointerId)return;
  drag.pointer=pointer(event);
  drag.moved=Math.max(drag.moved||0,Math.hypot(drag.pointer.x-drag.start.x,drag.pointer.y-drag.start.y));
  poseDrag();
}
function showHelp(){
  if($('pause-dialog').open)$('pause-dialog').close();
  cancelDrag();$('dialog-title').textContent='Каждый цвет — свой заряд';
  $('dialog-content').innerHTML='<p><strong>Соединяй гексы одного цвета.</strong><br>Группа даёт сумму значений своих плиток. Очки волной пополняют полоску цвета.</p><p><strong>Полный заряд даёт слияние ✦</strong><br>Оно собирает соседние группы своего цвета в одну плитку и освобождает место.</p><p>Короткое касание фигуры переставляет её цвета по кругу. Смена цвета не создаёт новые цвета.</p><p>За каждый цветовой уровень — заряд смены цветов. За каждые 5 000 очков — слияние, отмена и новая раздача.</p>';
  $('dialog-primary').textContent='Понятно';$('dialog-primary').onclick=()=>$('dialog').close();$('dialog-secondary').hidden=true;$('dialog').showModal();
}
function showResultLeaderboard(){
  if(paused||!$('main-menu-screen').hidden)return;
  cancelDrag();paused=true;
  const menu=$('main-menu-screen');menu.style.visibility='hidden';menu.style.backgroundColor=visualTheme.background;menu.classList.add('result-transition');menu.hidden=false;
  menu.contentWindow.postMessage({type:'hex-theme-sync',id:visualTheme.id},location.origin);
  menu.contentWindow.postMessage({type:'hex-menu-session',canResume:false},location.origin);
  const best=resultPreviousBest,score=game.score;
  submitLeaderboardScore(score);
  menu.contentWindow.postMessage({type:'hex-result-show',score,best,newRecord:score>best&&score>0},location.origin);
}
function reset(){if(paused)resumeGame();cancelDrag();resultPreviousBest=game.best;game.reset();overShown=false;clearViews();renderBoard();rebuildTray();updateHUD();try{localStorage.removeItem('hex-unlocked-themes');}catch{}$('main-menu-screen').contentWindow?.postMessage('hex-reset-demo-purchases',location.origin);if(['pearl','monochrome'].includes(visualTheme.id))switchTheme('classic');}
function clearViews(){for(const e of boardViews.values())e.node.destroy({children:true});boardViews.clear();for(const node of mergeViews.values())node.destroy({children:true});mergeViews.clear();clear(previewLayer);clear(legalLayer);}
function useTool(kind){if(paused||drag||$('dialog').open)return;sound.unlock();core.useTool(kind);renderBoard();renderTray();updateHUD();}
function keyboard(e){
  if(paused)return;
  if($('dialog').open||e.repeat||e.target.closest?.('button')||e.ctrlKey||e.metaKey||e.altKey)return;
  const k=e.key.toLowerCase();
  if(['s','n'].includes(k)){e.preventDefault();useTool(k==='s'?'swap':'deal');return;}
  if(k==='m'){sound.toggle();updateHUD();return;}if(k==='r'){reset();return;}if(e.key==='Escape'){cancelDrag();return;}
  if(['1','2','3'].includes(k)&&game.state==='playing'){
    e.preventDefault();cancelDrag();const slot=Number(k)-1,source=game.tray[slot];if(!source||source.hidden)return;
    const [x,y]=trayPosition(slot),p={x,y};if(!core.beginPick(slot,p.x,p.y))return;
    const piece=structuredClone(source),node=makeHeld(piece);dragLayer.addChild(node);drag={slot,piece,node,pivot:pivot(piece),keyboard:true,candidate:{q:0,r:0}};lastPreview='';keyboardPose();return;
  }
  if(!drag?.keyboard)return;
  const shifts={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
  if(shifts[e.key]){e.preventDefault();drag.candidate.q=clamp(drag.candidate.q+shifts[e.key][0],-5,5);drag.candidate.r=clamp(drag.candidate.r+shifts[e.key][1],-5,5);keyboardPose();}
  if(e.key==='Enter'){e.preventDefault();if(!drag.preview){sound.effects.deny();return;}const d=drag;core.keyboardPlace(d.slot,d.candidate.q,d.candidate.r);removeDrag();renderBoard();renderTray();updateHUD();}
}
function keyboardPose(){const p=point(drag.candidate.q,drag.candidate.r);drag.node.position.set(p.x+drag.pivot.x,p.y+drag.pivot.y-78);drag.node.scale.set(1.06);const at=game.canPlace(drag.piece,drag.candidate.q,drag.candidate.r)?[drag.candidate.q,drag.candidate.r]:null;preview(at);core.movePick(p.x,p.y,at);}
function buildIntro(){
  clear(introLayer);introViews=[];
  const side=64*S/geometry.board.latticeRadius;
  for(const [q,r0] of CELLS){
    const g=new Sprite(textures.introCells[((q-r0)%3+3)%3]);g.anchor.set(.5);g.width=g.height=side;
    const holder=new Container(),p=point(q,r0);holder.position.set(p.x,p.y);holder.addChild(g);introLayer.addChild(holder);introViews.push({q,r:r0,g:holder});
  }
}
function renderIntro(){
  const clock=resumeRevealClock??core.visual.dealClock,dealing=clock<460;backdrop.visible=!dealing;introLayer.visible=dealing;
  boardShadow.alpha=clamp(clock/460,0,1)*(visualTheme.id==='pearl'?.5:1);
  if(!dealing)return;for(const t of introViews){const k=resumeRevealClock===null?core.dealFactor(t.q,t.r):revealFactor(t.q,t.r,clock);t.g.visible=!game.board.has(key(t.q,t.r))&&k>0;t.g.alpha=Math.min(1,k*1.4);t.g.scale.set(REDUCED?1:.55+.45*k);}
}
function scheduleResize(){
  if(resizeFrame)return;
  resizeFrame=requestAnimationFrame(()=>{resizeFrame=0;resize();});
}
function positionHUD(layout,ui){
  const desktop=layout.mode==='desktop';
  const place=(node,x,y,width)=>{node.style.left=x+'px';node.style.top=y+'px';node.style.width=width+'px';node.style.right='auto';};
  const score=ui.querySelector('.scoreboard'),header=ui.querySelector('.header-divider'),divider=ui.querySelector('.tray-divider'),tools=ui.querySelector('.tools');
  place(score,desktop?layout.scoreX-140:0,layout.scoreTop,desktop?280:layout.width);
  for(let i=0;i<3;i++){
    const [x,y]=layout.meterPositions[i];place($('meter-'+i),x,y-24,desktop?250:86);
  }
  if(desktop){
    const trayX=layout.trayPositions[0][0];
    place(header,layout.scoreX-105,layout.centerY-125,210);
    place(divider,trayX-132,layout.centerY+345,264);
    place(tools,trayX-132,layout.toolsY,264);
  }else{
    place(header,24,layout.chargeY-15,372);place(divider,24,layout.toolsY-20,372);place(tools,62,layout.toolsY,296);
  }
  // Tool positions are shared with reward flights in the original effects layer.
  header.hidden=true;
  const progressWidth=layout.width-48;
  const progressLeft=(layout.width-progressWidth)/2;
  place(score,desktop?layout.scoreX-100:progressLeft,desktop?layout.scoreTop:12,desktop?200:progressWidth);
  const progressTop=desktop?layout.scoreTop+84:2*layout.meterPositions[0][1]-(layout.centerY-layout.boardHeight/2)-4.4;
  place($('goal-progress'),desktop?layout.scoreX-100:progressLeft,progressTop,desktop?200:progressWidth);
  const topbar=ui.querySelector('.topbar');
  if(desktop){topbar.style.left=(layout.meterPositions[0][0]-143)+'px';topbar.style.top=(layout.scoreTop-52)+'px';}
  else{score.style.top=(progressTop/2-33)+'px';topbar.style.left=(progressLeft-18)+'px';topbar.style.top=(progressTop/2-28)+'px';}
  place(tools,0,0,layout.width);tools.style.height=layout.height+'px';
  divider.hidden=true;$('undo').hidden=true;
  for(const [kind,index] of [['swap',1],['deal',2]]){
    const [x,y]=layout.toolPositions[index];place($(kind),x-38,y-16,76);
  }
  ui.style.setProperty('--goal-size',desktop?'17px':'15px');
}
function resize(){
  if(!app)return;
  const host=$('game'),width=host.clientWidth,height=host.clientHeight;
  if(width<=0||height<=0)return;
  const css=getComputedStyle(host),top=parseFloat(css.paddingTop)||0,bottom=parseFloat(css.paddingBottom)||0;
  // Browser chrome can jitter by1 CSS px. Compare against the last APPLIED
  // geometry so tiny changes do not rebuild the scene or accumulate drift.
  if(lastViewport&&width===lastViewport.width&&Math.abs(height-lastViewport.height)<=1&&top===lastViewport.top&&bottom===lastViewport.bottom)return;
  lastViewport={width,height,top,bottom};cancelDrag();
  app.renderer.resize(width,height);
  const layout=calculateLayout(width,height,top,bottom,geometry.board);currentLayout=layout;
  H=layout.height;S=layout.size;CENTER.x=layout.centerX;CENTER.y=layout.centerY;
  TRAY_Y=layout.trayY;chargeY=layout.chargeY;toolsY=layout.toolsY;
  const {scale,scoreTop:scoreY,scoreSize,goalY,boardWidth,boardHeight}=layout;
  root.scale.set(scale);root.position.set(0,top);
  backdrop.width=boardWidth;backdrop.height=boardHeight;backdrop.position.set(CENTER.x,CENTER.y);
  boardShadow.width=boardWidth*512/448;boardShadow.height=boardHeight*564/500;boardShadow.position.copyFrom(backdrop.position);
  const ui=$('scene-ui');ui.style.left=root.x+'px';ui.style.top=root.y+'px';ui.style.width=layout.width+'px';ui.style.transform=`scale(${scale})`;ui.dataset.layout=layout.mode;
  for(const [name,value] of Object.entries({'scene-height':H,'topbar-y':14,'score-y':scoreY,'score-size':scoreSize,'goal-size':15,'charge-y':chargeY,'tools-y':toolsY,'header-divider-y':chargeY-15,'tray-divider-y':toolsY-20}))ui.style.setProperty('--'+name,value+'px');
  positionHUD(layout,ui);
  hudView.invalidateScoreFit();
  core.setLayout(layout);
  const overlay=core.canvas;overlay.style.left=root.x+'px';overlay.style.top=root.y+'px';overlay.style.transform=`scale(${scale})`;
  app.stage.hitArea=new Rectangle(0,0,width,height);clearViews();buildIntro();renderBoard();rebuildTray(true);renderTray();renderMerges();
}
const loadThemeAssets=createThemeAssetLoader(Assets);
// Decode images used by hidden UI before the loading screen is dismissed.
// Keep the Image objects alive so decoded artwork can be reused when menus open.
let preparedUiImages=[];
async function prepareUiImages(){
  const themes=['classic','warm-flat-test','pearl','monochrome'].map(id=>VISUAL_THEMES[id]);
  const paths=[...themes.flatMap(theme=>theme.tiles.map(src=>src.replace('assets/hex-','assets/pause-hex-'))),
    ...['volume-up-white','volume-up-dark','volume-off-white','volume-off-dark','restart-white','restart-dark','help-white','help-dark','lock-white','lock-dark','check-white','check-dark'].map(name=>`assets/icons/${name}-128.png`),
    'assets/icons/swap-arrows-128.png','assets/icons/deal-clover-128.png',
    ...['movement-arrow','movement-arrow-pearl','movement-arrow-monochrome'].map(name=>`assets/main-menu/${name}.png`)];
  const results=await Promise.allSettled(paths.map(async src=>{const image=new Image();image.src=src;await image.decode();return image;}));
  preparedUiImages=results.filter(result=>result.status==='fulfilled').map(result=>result.value);
  for(const result of results)if(result.status==='rejected')console.warn('Не удалось заранее подготовить изображение интерфейса',result.reason);
}

function waitForMenuReady(){
  const frame=$('main-menu-screen');
  return new Promise(resolve=>{
    let done=false,timer;
    function finish(){if(done)return;done=true;clearTimeout(timer);window.removeEventListener('message',onMessage);frame.removeEventListener('load',request);resolve();}
    function onMessage(event){if(event.origin===location.origin&&event.source===frame.contentWindow&&event.data?.type==='hex-menu-prepared')finish();}
    function request(){frame.contentWindow?.postMessage('hex-menu-prepare',location.origin);}
    window.addEventListener('message',onMessage);frame.addEventListener('load',request);timer=setTimeout(finish,5000);request();
  });
}
function applyPageTheme(theme){
  document.documentElement.dataset.visualTheme=theme.id;
  theme.tiles.forEach((src,i)=>document.documentElement.style.setProperty(`--pause-tile-${i}`,`url("${src.replace("assets/hex-","assets/pause-hex-")}")`));
  document.querySelector('meta[name="theme-color"]').content=theme.background;
}
function syncThemeButton(){
  const brown=visualTheme.id==='warm-flat-test',button=$('theme');
  button.setAttribute('aria-pressed',String(brown));
  button.setAttribute('aria-label',brown?'Вернуть основную тему':'Переключить на коричневую тему');
  button.title=brown?'Основная тема':'Коричневая тема';
}
async function switchTheme(requested){
  const button=$('theme');if(button.disabled)return;
  button.disabled=true;
  const next=typeof requested==='string'?VISUAL_THEMES[requested]:getNextTheme(visualTheme);if(!next||next.id===visualTheme.id){button.disabled=false;return;}
  try{
    const assets=await loadThemeAssets(next);
    cancelDrag();visualTheme=next;({textures,tileImages}=assets);core.setParticlePainter(createParticlePainter(assets.particleImages));
    try{localStorage.setItem('hex-visual-theme',next.id);}catch{} applyPageTheme(next);core.setTheme(getEngineTheme(next));
    hudView.setHighlight(next.colors[1]);
    backdrop.texture=textures.board;backdrop.width=currentLayout.boardWidth;backdrop.height=currentLayout.boardHeight;
    clearViews();buildIntro();renderIntro();renderBoard();rebuildTray(true);renderTray();renderMerges();core.renderEffects();updateHUD();syncThemeButton();
  }catch(error){
    console.error('Не удалось загрузить тему',error);$('status').textContent='Не удалось загрузить оформление. Попробуй ещё раз.';
  }finally{button.disabled=false;}
}
async function main(){
  $('pause').onclick=pauseGame;$('resume').onclick=resumeAnimated;$('main-menu').onclick=()=>{
    const dialog=$('pause-dialog'),gameHost=$('game');if(dialog.classList.contains('leaving'))return;
    dialog.classList.remove('entering');dialog.classList.add('leaving','menu-transition');gameHost.classList.add('leaving-to-menu','menu-transition');
    setTimeout(()=>{dialog.close();const menu=$('main-menu-screen');menu.style.visibility='hidden';menu.hidden=false;menu.contentWindow.postMessage({type:'hex-theme-sync',id:visualTheme.id},location.origin);menu.contentWindow.postMessage({type:'hex-menu-session',canResume:game.state==='playing'},location.origin);menu.contentWindow.postMessage('hex-menu-show',location.origin);dialog.classList.remove('leaving','menu-transition');},REDUCED?0:250);
  };
  $('pause-dialog').addEventListener('cancel',event=>{event.preventDefault();resumeAnimated();});
  $('pause-dialog').addEventListener('click',event=>{if(event.target!==event.currentTarget)return;const rect=event.currentTarget.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)resumeAnimated();});
  $('dialog').addEventListener('close',()=>{if(paused&&!$('pause-dialog').open)$('pause-dialog').showModal();});
  $('sound-palette').onclick=()=>{sound.unlock();soundPaletteIndex=(soundPaletteIndex+1)%soundPalettes.length;syncSoundPalette();try{globalThis.localStorage.setItem('hex-sound-palette-v5',soundPalettes[soundPaletteIndex].id);}catch{}};
  await document.fonts.load('700 20px SPORE');
  const [assets,meta]=await Promise.all([loadThemeAssets(visualTheme),fetch('assets/minimal-geometry.json').then(r=>{if(!r.ok)throw new Error('Не удалось загрузить сетку');return r.json();}),prepareUiImages(),waitForMenuReady()]);
  for(const id of ['classic','warm-flat-test','pearl','monochrome'])if(id!==visualTheme.id)loadThemeAssets(VISUAL_THEMES[id]).catch(error=>console.warn('Не удалось заранее загрузить тему',id,error));
  ({textures,tileImages}=assets);geometry=meta;core.setParticlePainter(createParticlePainter(assets.particleImages));
  core.setPainter((g,x,y,size,c,o)=>{
    const side=geometry.placement.spriteLogicalWidth*size/geometry.board.latticeRadius;g.save();g.drawImage(tileImages[c],x-geometry.tile.anchor.x*side,y-geometry.tile.anchor.y*side,side,side);
    if(o.merge)paintBonusMark(g,x,y,size);
    else if(o.valued||(o.v||1)>1){g.font=`700 ${Math.max(9,Math.round(size*.71))}px SPORE, sans-serif`;g.textAlign='center';g.textBaseline='middle';g.fillStyle=tileInk(c);g.fillText(String(o.v||1),x,y);}
    g.restore();
  });
  // Render at 2x even on 1x desktop displays, then downsample smooth diagonal edges.
  app=new Application();await app.init({width:W,height:H,backgroundAlpha:0,antialias:true,autoDensity:true,resolution:2,preference:'webgl',eventFeatures:{move:true,globalMove:true,click:true,wheel:false}});
  if(app.renderer.prepare?.upload){
    const warmup=new Container();for(const texture of [textures.board,textures.boardShadow,...textures.tiles,...textures.introCells,...textures.shadowTiles])warmup.addChild(new Sprite(texture));
    try{await app.renderer.prepare.upload(warmup);}catch(error){console.warn('Не удалось заранее подготовить текстуры',error);}finally{warmup.destroy({children:true});}
  }
  $('game').prepend(app.canvas);app.canvas.tabIndex=0;app.canvas.setAttribute('aria-label','Гексагональное поле и три фигуры');app.canvas.setAttribute('aria-describedby','accessible-instructions');
  root=new Container();app.stage.addChild(root);app.stage.eventMode='static';
  boardShadow=new Sprite(textures.boardShadow);boardShadow.anchor.set(.5);boardShadow.eventMode='none';root.addChild(boardShadow);
  backdrop=new Sprite(textures.board);backdrop.anchor.set(.5);root.addChild(backdrop);
  introLayer=new Container();boardLayer=new Container({sortableChildren:true});previewLayer=new Container({sortableChildren:true});legalLayer=new Container();trayLayer=new Container();dragLayer=new Container();
  for(const layer of [introLayer,boardLayer,legalLayer,previewLayer,trayLayer,dragLayer])root.addChild(layer);
  for(const layer of [introLayer,boardLayer,previewLayer,legalLayer,dragLayer])layer.eventMode='none';
  core.canvas.className='original-effects';core.canvas.setAttribute('aria-hidden','true');$('game').insertBefore(core.canvas,$('scene-ui'));
  app.stage.on('globalpointermove',event=>moveDrag(event.nativeEvent));
  app.canvas.addEventListener('pointerup',finishDrag);app.canvas.addEventListener('pointercancel',cancelDrag);app.canvas.addEventListener('lostpointercapture',()=>{if(drag&&!drag.keyboard)cancelDrag();});
  window.addEventListener('blur',cancelDrag);document.addEventListener('keydown',keyboard);
  $('restart').onclick=()=>{
    const dialog=$('pause-dialog'),gameHost=$('game');if(dialog.classList.contains('leaving')||dialog.classList.contains('resuming'))return;
    sound.unlock();dialog.classList.remove('entering');dialog.classList.add('leaving');gameHost.classList.add('leaving-to-menu');
    setTimeout(()=>{reset();introFinished=false;$('scene-ui').style.visibility='hidden';trayLayer.visible=false;core.canvas.style.visibility='hidden';renderIntro();dialog.classList.remove('leaving');gameHost.classList.remove('leaving-to-menu');},REDUCED?0:400);
  };$('undo').onclick=()=>useTool('undo');$('swap').onclick=()=>useTool('swap');$('deal').onclick=()=>useTool('deal');$('help').onclick=showHelp;$('sound').onclick=()=>{sound.toggle();updateHUD();};
  $('fullscreen').onclick=()=>toggleFullscreen();
  $('theme').onclick=()=>switchTheme();syncThemeButton();
  new ResizeObserver(scheduleResize).observe($('game'));resize();updateHUD();
  $('scene-ui').style.visibility='hidden';trayLayer.visible=false;core.canvas.style.visibility='hidden';renderIntro();
  // Fullscreen and safe-area changes can leave the host's border size intact.
  document.addEventListener('fullscreenchange',scheduleResize);
  document.addEventListener('webkitfullscreenchange',scheduleResize);
  window.addEventListener('resize',scheduleResize);
  let introReady=false;
  requestAnimationFrame(()=>{requestAnimationFrame(()=>{$('loading')?.remove();introReady=true;});});
  app.ticker.add(t=>{
    if(paused||!introReady)return;
    if(hudFadeStarted!==null){trayLayer.alpha=clamp((performance.now()-hudFadeStarted)/300,0,1);if(trayLayer.alpha>=1)hudFadeStarted=null;}
    game.update(Math.min(64,t.elapsedMS));if(drag&&game.state!=='playing')cancelDrag();renderIntro();renderBoard();renderTray();renderMerges();
    if(drag&&!drag.keyboard&&performance.now()-drag.began<Math.max(140,DRAG_SETTINGS.tapDuration+40))poseDrag();
    const pulse=.32+(.5+.5*Math.sin(core.visual.clock*.004))*.08*MOTION;for(const node of legalLayer.children)node.alpha=pulse;
    core.renderEffects();updateHUD();
    if(!introFinished&&core.visual.dealClock>=460){introFinished=true;showHudAfterReveal();}
  });
}
main().catch(error=>{console.error(error);const loading=$('loading');if(loading)loading.textContent='Не удалось загрузить игру. Обнови страницу.';});



window.addEventListener('message',event=>{
  if(event.origin!==location.origin||event.source!==$('main-menu-screen').contentWindow)return;
  if(event.data?.type==='hex-result-ready'){$('main-menu-screen').style.visibility='';return;}
  if(event.data?.type==='hex-result-exit'){$('game').classList.add('leaving-to-menu','menu-transition');return;}
  if(event.data?.type==='hex-result-land'){$('main-menu-screen').classList.remove('result-transition');$('main-menu-screen').style.backgroundColor='';$('game').classList.remove('leaving-to-menu','menu-transition');return;}
  if(event.data?.type==='hex-result-tick'){sound.effects.tick(event.data.index||0);return;}
  if(event.data?.type==='hex-result-best'){sound.effects.best();return;}
  if(event.data?.type==='hex-ranking-request'){
    const {mode,requestId}=event.data;
    if(mode==='day'||mode==='all') readLeaderboard(mode).then(data=>{
      $('main-menu-screen').contentWindow?.postMessage({type:'hex-ranking-data',mode,requestId,data},location.origin);
    });
    return;
  }
  if(event.data?.type==='hex-result-pop'){playResultPop(Number(event.data.index)||0);return;}
  if(event.data?.type==='hex-menu-ready'){$('main-menu-screen').style.visibility='';$('game').classList.remove('leaving-to-menu','menu-transition');return;}
  if(event.data?.type==='hex-theme-select'){if(['classic','warm-flat-test','pearl','monochrome'].includes(event.data.id))switchTheme(event.data.id);return;}
  if(event.data?.type!=='hex-menu-play')return;
  $('main-menu-screen').hidden=true;
  sound.unlock();
  if(event.data.resume&&paused&&game.state==='playing'){
    resumeRevealClock=0;$('scene-ui').style.visibility='hidden';trayLayer.visible=false;core.canvas.style.visibility='hidden';renderIntro();renderBoard();
    const started=performance.now();function reveal(now){resumeRevealClock=Math.min(460,now-started);renderIntro();renderBoard();if(resumeRevealClock<460){requestAnimationFrame(reveal);return;}resumeRevealClock=null;renderIntro();renderBoard();showHudAfterReveal();paused=false;}
    requestAnimationFrame(reveal);return;
  }
  reset();
  introFinished=false;$('scene-ui').style.visibility='hidden';trayLayer.visible=false;core.canvas.style.visibility='hidden';renderIntro();
});

