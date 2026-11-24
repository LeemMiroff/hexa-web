import {Game,CELLS,key,hexToPixel,pixelToHex} from './legacy-model.mjs';
import {Sound} from './audio.mjs';
const {Application,Assets,Container,Sprite,Graphics,Text,Rectangle}=PIXI;
const W=420,CENTER={x:210,y:466},SLOTS=[100,210,320];
let H=880,S=400/14,TRAY_Y=762,TRAY_SCALE=.7,chargeY=180;
const COLORS=[0xf45d68,0xf5c367,0x79b9dc],NAMES=['Красная','Жёлтая','Синяя'];
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=id=>document.getElementById(id),game=new Game(),sound=new Sound();
let app,root,backdrop,geometry,boardLayer,previewLayer,effectsLayer,trayLayer,dragLayer,textures,trayViews=[],drag=null;
let tweens=[],generation=0,lockedUntil=0,scoreShown=0,best=0,goal=500,goalCelebrated=0;
try{best=Number(localStorage.getItem('hex-towers-best'))||0;}catch{}
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const ease=t=>1-Math.pow(1-t,3);
function tween(target,to,duration=220,delay=0,done){
  const from={};for(const k in to)from[k]=target[k];
  tweens.push({target,to,from,duration:REDUCED?Math.min(duration,70):duration,delay,elapsed:0,done});
}
function later(fn,ms){const g=generation;setTimeout(()=>{if(generation===g)fn();},ms);}
function clearLayer(layer){for(const child of layer.removeChildren())child.destroy({children:true});}
function boardPoint(q,r){const p=hexToPixel(q,r,S);return{x:CENTER.x+p.x,y:CENTER.y+p.y};}
function pointFromEvent(e){const rect=app.canvas.getBoundingClientRect();return{x:(e.clientX-rect.left-root.x)/root.scale.x,y:(e.clientY-rect.top-root.y)/root.scale.y};}
function setStatus(text,color='#aa9ab7'){$('status').textContent=text;$('status').style.color=color;}
function normalHint(){return '';}
function makeLabel(text,size=17,color=0x252033){return new Text({text:String(text),style:{fontFamily:'Nunito, Trebuchet MS',fontSize:size,fontWeight:'900',fill:color}});}
function hexOutline(x,y,r,color,alpha=1,width=2){
  const pts=[];for(let i=0;i<6;i++){pts.push(x+Math.cos(i*Math.PI/3)*r,y+Math.sin(i*Math.PI/3)*r);}
  return new Graphics().poly(pts).stroke({color,alpha,width,join:'round'});
}
function makeTile(c,value=1,merge=false){
  const node=new Container(),face=new Sprite(textures.tile);
  face.anchor.set(geometry.tile.anchor.x,geometry.tile.anchor.y);
  face.width=face.height=geometry.placement.spriteLogicalWidth*S/geometry.board.latticeRadius;
  face.tint=COLORS[c];node.addChild(face);
  if(merge){node.addChild(hexOutline(0,0,S*.82,0xfff1cd,.7,1.2));const star=new Graphics().star(0,-.5,4,S*.36,S*.145,0).fill({color:0x272034,alpha:.85});node.addChild(star);}
  else if(value>1){const label=makeLabel(value,S*.71);label.anchor.set(.5);label.y=-1;node.addChild(label);}
  return node;
}
function piecePivot(piece){
  const ps=piece.cells.map(t=>hexToPixel(t.dq,t.dr,S));
  return{x:(Math.min(...ps.map(p=>p.x))+Math.max(...ps.map(p=>p.x)))/2,y:(Math.min(...ps.map(p=>p.y))+Math.max(...ps.map(p=>p.y)))/2};
}
function makePiece(piece){
  const node=new Container(),pivot=piecePivot(piece);
  for(const t of [...piece.cells].sort((a,b)=>hexToPixel(a.dq,a.dr,S).y-hexToPixel(b.dq,b.dr,S).y)){
    const p=hexToPixel(t.dq,t.dr,S),tile=makeTile(t.c,1,piece.merge);tile.position.set(p.x-pivot.x,p.y-pivot.y);node.addChild(tile);
  }
  return node;
}
function updateHUD(animate=true){
  if(!animate){scoreShown=game.score;$('score').textContent=game.score.toLocaleString('ru-RU');}
  $('goal-target').textContent=goal.toLocaleString('ru-RU');
  if(game.score>best){best=game.score;try{localStorage.setItem('hex-towers-best',String(best));}catch{}}
  $('score').title='Рекорд: '+best.toLocaleString('ru-RU');
  game.towers.forEach((t,c)=>{
    $('fill-'+c).textContent=t.fill;$('target-'+c).textContent=' / '+t.target;$('level-'+c).textContent='ур. '+t.level;
    const fill=$('charge-'+c),meter=$('meter-'+c);
    if(!animate)fill.classList.add('instant');
    fill.style.transform=`scaleX(${t.fill/t.target})`;
    if(!animate)requestAnimationFrame(()=>fill.classList.remove('instant'));
    meter.setAttribute('aria-valuenow',String(t.fill));meter.setAttribute('aria-valuemax',String(t.target));meter.setAttribute('aria-valuetext',`${t.fill} из ${t.target}, уровень ${t.level}`);
  });
  $('undo').disabled=!game.last;$('swap').disabled=game.over||game.tools.swap===0||game.tray.every(p=>p.merge);$('deal').disabled=game.over||game.tools.deal===0||game.tray.every(p=>p.merge);
  $('undo-count').textContent=game.last?'1':'0';$('swap-count').textContent=game.tools.swap;$('deal-count').textContent=game.tools.deal;
}
function renderBoard(){
  clearLayer(boardLayer);
  for(const tile of [...game.board.values()].sort((a,b)=>boardPoint(a.q,a.r).y-boardPoint(b.q,b.r).y)){
    const node=makeTile(tile.c,tile.v,false),p=boardPoint(tile.q,tile.r);node.position.set(p.x,p.y);node.label=key(tile.q,tile.r);boardLayer.addChild(node);
  }
}
function renderTray(animate=false){
  // Finish any old tray tweens before destroying their objects.
  const old=new Set(trayViews);tweens=tweens.filter(t=>!old.has(t.target)&&!old.has(t.target.parent));
  clearLayer(trayLayer);trayViews=[];
  game.tray.forEach((piece,i)=>{
    const holder=new Container();holder.position.set(SLOTS[i],TRAY_Y);holder.hitArea=new Rectangle(-53,-58,106,116);holder.eventMode='static';holder.cursor='grab';holder.on('pointerdown',e=>beginDrag(i,e.nativeEvent));
    const view=makePiece(piece);view.scale.set(TRAY_SCALE);holder.addChild(view);holder.pieceView=view;trayViews.push(holder);trayLayer.addChild(holder);
    if(animate){view.alpha=0;view.y=12;tween(view,{alpha:1,y:0},180,i*30);}
  });
}
function pickCandidate(origin){
  const next=pixelToHex(origin.x-CENTER.x,origin.y-CENTER.y,S);
  if(drag.candidate){const prev=drag.candidate,oldP=boardPoint(prev.q,prev.r),newP=boardPoint(next.q,next.r);if(Math.hypot(origin.x-oldP.x,origin.y-oldP.y)<=Math.hypot(origin.x-newP.x,origin.y-newP.y)+3)return prev;}
  return next;
}
function showPreview(q,r){
  const signature=key(q,r);if(drag.signature===signature)return;drag.signature=signature;
  clearLayer(previewLayer);
  const piece=drag.piece,preview=game.preview(piece,q,r);drag.preview=preview;
  for(const t of piece.cells){const at=boardPoint(q+t.dq,r+t.dr);if(preview){const node=makeTile(t.c,1,piece.merge);node.position.set(at.x,at.y);node.alpha=.45;previewLayer.addChild(node);}else{const g=hexOutline(at.x,at.y,S*.93,0xf9707d,.55,1.5);previewLayer.addChild(g);}}
  if(preview){
    const cells=new Map(preview.groups.flatMap(g=>g.cells.map(t=>[key(t.q,t.r),t])));
    for(const t of cells.values()){if(!game.board.has(key(t.q,t.r)))continue;const p=boardPoint(t.q,t.r);previewLayer.addChild(hexOutline(p.x,p.y,S*.89,COLORS[t.c],.6,1.5));}
    if(preview.gained){const words=piece.merge?'Слияние':`+${preview.gained}`;setStatus(words+' · заряд башни', '#e5d2ac');}
    else setStatus('Отпусти, чтобы поставить','#beb0cc');
  }else setStatus('Здесь фигура не помещается','#d88695');
}
function poseDrag(){
  if(!drag||drag.keyboard)return;
  const travelled=clamp((drag.start.y-drag.pointer.y)/235,0,1),smooth=travelled*travelled*(3-2*travelled),lift=78+28*smooth;
  const pickup=clamp((performance.now()-drag.began)/115,0,1),f=ease(pickup);
  drag.node.x=drag.pointer.x-drag.gripX;
  drag.node.y=drag.pointer.y+(drag.initialY-drag.start.y)*(1-f)-lift*f;
  drag.node.scale.set(TRAY_SCALE+(1.06-TRAY_SCALE)*f);
  const origin={x:drag.node.x-drag.pivot.x,y:drag.node.y-drag.pivot.y};drag.candidate=pickCandidate(origin);showPreview(drag.candidate.q,drag.candidate.r);
}
function beginDrag(slot,event){
  if(drag||game.over||performance.now()<lockedUntil||$('dialog').open||event.button>0)return;
  event.preventDefault();app.canvas.focus({preventScroll:true});sound.unlock();sound.lift();
  const pointer=pointFromEvent(event),piece=structuredClone(game.tray[slot]),node=makePiece(piece),pivot=piecePivot(piece);
  node.position.set(SLOTS[slot],TRAY_Y);node.scale.set(TRAY_SCALE);dragLayer.addChild(node);trayViews[slot].pieceView.alpha=.13;
  drag={slot,piece,node,pivot,pointer,start:{...pointer},gripX:pointer.x-SLOTS[slot],initialY:TRAY_Y,began:performance.now(),candidate:null,signature:null,pointerId:event.pointerId};
  try{app.canvas.setPointerCapture(event.pointerId);}catch{}
  poseDrag();
}
function clearDrag(){if(!drag)return;clearLayer(previewLayer);const old=drag;drag=null;return old;}
function cancelDrag(){
  const old=clearDrag();if(!old)return;
  const holder=trayViews[old.slot];tween(old.node,{x:SLOTS[old.slot],y:TRAY_Y,alpha:0},180,0,()=>old.node.destroy({children:true}));tween(old.node.scale,{x:TRAY_SCALE,y:TRAY_SCALE},180);if(holder)holder.pieceView.alpha=1;setStatus(normalHint());
}
function finishDrag(event){
  if(!drag||drag.keyboard||event.pointerId!==drag.pointerId)return;
  if(!drag.preview){sound.deny();cancelDrag();return;}
  const old=clearDrag(),at=old.candidate;old.node.destroy({children:true});commit(old.slot,at.q,at.r);
}
function floatText(text,x,y,color=0xf5c367){
  const label=makeLabel(text,27,color);label.anchor.set(.5);label.position.set(x,y);effectsLayer.addChild(label);tween(label,{y:y-34,alpha:0},780,100,()=>label.destroy());
}
function sparkle(x,y,c,count=8){
  for(let i=0;i<count;i++){const p=new Graphics().circle(0,0,2.4).fill(COLORS[c]);p.position.set(x,y);effectsLayer.addChild(p);const a=2*Math.PI*i/count;tween(p,{x:x+Math.cos(a)*32,y:y+Math.sin(a)*28,alpha:0},420,0,()=>p.destroy());}
}
const flights=[];
function flyCharge(tile,c,index=0){
  const from=boardPoint(tile.q,tile.r),to={x:SLOTS[c],y:chargeY+3};const bead=new Graphics().circle(0,0,3.1).fill(COLORS[c]);bead.position.set(from.x,from.y);bead.alpha=0;effectsLayer.addChild(bead);
  flights.push({node:bead,from,to,c,elapsed:-index*22,duration:480});
}
function animateResult(result){
  const placedKeys=new Set(result.placed.map(t=>key(t.q,t.r)));
  for(const node of boardLayer.children)if(placedKeys.has(node.label)){node.y-=6;node.scale.set(1.1);tween(node,{y:node.y+6},160);tween(node.scale,{x:1,y:1},180);}
  if(result.consumed.length){
    const to=boardPoint(result.placed[0].q,result.placed[0].r);
    result.consumed.forEach((tile,i)=>{const node=makeTile(tile.c,tile.v),p=boardPoint(tile.q,tile.r);node.position.set(p.x,p.y);effectsLayer.addChild(node);tween(node,{x:to.x,y:to.y,alpha:0},260,i*22,()=>node.destroy({children:true}));tween(node.scale,{x:.15,y:.15},260,i*22);});
    sound.merge();sparkle(to.x,to.y,result.placed[0].c,12);
  }else sound.land(result.placed.length);
  if(result.gained){
    const first=boardPoint(result.placed[0].q,result.placed[0].r);floatText('+'+result.gained,first.x,first.y-24);
    result.groups.forEach(group=>group.cells.slice(0,14).forEach((t,i)=>flyCharge(t,group.c,i)));
    later(()=>sound.reward(),90);
  }
  if(result.rewards.length){
    const color=result.rewards[0].c;setStatus(NAMES[color]+': фишка слияния!','#f5c367');
    for(const r of result.rewards){
      if(!REDUCED)$('meter-'+r.c).querySelector('.charge-track').animate([{filter:'brightness(1)',transform:'scale(1)'},{filter:'brightness(1.7)',transform:'scale(1.06)'},{filter:'brightness(1)',transform:'scale(1)'}],{duration:450,easing:'ease-out'});
      later(()=>sparkle(SLOTS[r.c],chargeY+3,r.c,6),350);
    }
    later(()=>sound.bonus(),400);
  }else setStatus(result.gained?`+${result.gained} · заряд пополнен`:normalHint());
  later(()=>{if(!drag&&!game.over)setStatus(normalHint());},2300);
  if(game.score>=goal&&goalCelebrated<goal){goalCelebrated=goal;later(()=>{floatText('Цель достигнута!',210,350);sound.bonus();},700);goal+=500;}
  if(result.over)later(()=>showGameOver(),950);
}
function commit(slot,q,r){
  const result=game.place(slot,q,r);if(!result){renderTray();sound.deny();setStatus(normalHint());return;}
  lockedUntil=performance.now()+145;renderBoard();renderTray(true);updateHUD();animateResult(result);
  if(navigator.vibrate&&!REDUCED)navigator.vibrate(result.rewards.length?[8,35,8]:8);
}
function showHelp(){
  cancelDrag();$('dialog-title').textContent='Каждый цвет — свой заряд';
  $('dialog-content').innerHTML='<p><strong>Соединяй гексы одного цвета.</strong><br>Группа даёт очки и заполняет полоску своего цвета. Обычные плитки остаются на поле.</p><p><strong>Полный заряд даёт слияние ✦</strong><br>Поставь его рядом с группой того же цвета: плитки соберутся в одну и освободят место.</p><p>Фигура поднимается над пальцем, а силуэт на поле показывает точное место установки.</p>';
  $('dialog-primary').textContent='Понятно';$('dialog-primary').onclick=()=>$('dialog').close();$('dialog-secondary').hidden=true;$('dialog').showModal();
}
function showGameOver(){
  if(!game.over)return;$('dialog-title').textContent='Места больше нет';$('dialog-content').innerHTML=`<div class="result">${game.score.toLocaleString('ru-RU')}</div><p>очков за эту партию<br>Рекорд: <strong>${best.toLocaleString('ru-RU')}</strong></p>`;
  $('dialog-primary').textContent='Ещё раз';$('dialog-primary').onclick=()=>{$('dialog').close();reset();};$('dialog-secondary').hidden=!game.last;$('dialog-secondary').onclick=()=>{$('dialog').close();undo();};$('dialog').showModal();sound.over();
}
function undo(){if(drag)cancelDrag();if(!game.undo())return;generation++;tweens=[];for(const f of flights)f.node.destroy();flights.length=0;clearLayer(effectsLayer);clearLayer(dragLayer);renderBoard();renderTray();updateHUD(false);sound.undo();setStatus('Последний ход отменён');}
function reset(){
  generation++;if(drag){const old=clearDrag();old.node.destroy({children:true});}tweens=[];flights.length=0;clearLayer(effectsLayer);clearLayer(dragLayer);game.reset();goal=500;goalCelebrated=0;lockedUntil=0;renderBoard();renderTray(true);updateHUD(false);setStatus(normalHint());
}
function useTool(kind){
  if(drag||performance.now()<lockedUntil||$('dialog').open)return;
  sound.unlock();const changed=kind==='swap'?game.swapColors():game.deal();if(!changed){sound.deny();return;}
  renderTray(true);updateHUD(false);sound.deal();setStatus(kind==='swap'?'Цвета сменились':'Новые фигуры готовы');if(game.over)showGameOver();
}
function keyboard(event){
  if($('dialog').open||event.target.closest?.('button')||event.altKey||event.ctrlKey||event.metaKey)return;
  const k=event.key;
  if(['1','2','3'].includes(k)&&!game.over){event.preventDefault();cancelDrag();const slot=Number(k)-1,piece=structuredClone(game.tray[slot]),node=makePiece(piece);dragLayer.addChild(node);drag={slot,piece,node,pivot:piecePivot(piece),keyboard:true,candidate:{q:0,r:0},signature:null};trayViews[slot].pieceView.alpha=.13;sound.lift();keyboardPose();return;}
  if(k==='Escape'){cancelDrag();return;}if(!drag?.keyboard)return;
  const moves={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
  if(moves[k]){event.preventDefault();drag.candidate.q=clamp(drag.candidate.q+moves[k][0],-5,5);drag.candidate.r=clamp(drag.candidate.r+moves[k][1],-5,5);keyboardPose();}
  if(k==='Enter'){event.preventDefault();if(!drag.preview){sound.deny();return;}const old=clearDrag();old.node.destroy({children:true});commit(old.slot,old.candidate.q,old.candidate.r);}
}
function keyboardPose(){const p=boardPoint(drag.candidate.q,drag.candidate.r);drag.node.position.set(p.x+drag.pivot.x,p.y+drag.pivot.y-72);drag.node.scale.set(1.06);showPreview(drag.candidate.q,drag.candidate.r);}
function resize(){
  if(!app)return;
  if(drag){const old=clearDrag();old.node.destroy({children:true});}
  // A resize establishes a fresh shared coordinate space for the PNG and every tile.
  tweens=[];flights.length=0;clearLayer(effectsLayer);clearLayer(dragLayer);
  const host=$('game');const width=host.clientWidth,height=host.clientHeight;app.renderer.resize(width,height);
  const computed=getComputedStyle(host),top=parseFloat(computed.paddingTop)||0,bottom=parseFloat(computed.paddingBottom)||0;
  const availableHeight=height-top-bottom;
  H=clamp(availableHeight/(width/W),740,1040);
  const scale=Math.min(width/W,availableHeight/H);root.scale.set(scale);root.position.set((width-W*scale)/2,top+(availableHeight-H*scale)/2);
  const compact=clamp((840-H)/100,0,1);
  chargeY=180-52*compact;TRAY_Y=H-(118-24*compact);TRAY_SCALE=.7-.06*compact;
  const boardTop=242-58*compact,boardBottom=TRAY_Y-(72-13*compact);
  const boardWidth=Math.min(400,(boardBottom-boardTop)*geometry.board.logicalWidth/geometry.board.logicalHeight);
  const boardHeight=boardWidth*geometry.board.logicalHeight/geometry.board.logicalWidth;
  S=geometry.board.latticeRadius*boardWidth/geometry.board.logicalWidth;
  CENTER.y=boardTop+boardHeight/2+(boardBottom-boardTop-boardHeight)*.3;
  backdrop.width=boardWidth;backdrop.height=boardHeight;backdrop.position.set(CENTER.x,CENTER.y);
  const ui=$('scene-ui');ui.style.left=root.x+'px';ui.style.top=root.y+'px';ui.style.transform=`scale(${scale})`;
  for(const [name,value] of Object.entries({'scene-height':H,'topbar-y':14-compact*8,'score-y':56-compact*16,'score-size':68-compact*20,'goal-size':16-compact*2,'charge-y':chargeY,'tools-y':H-(58-compact*12)}))ui.style.setProperty('--'+name,value+'px');
  app.stage.hitArea=new Rectangle(0,0,width,height);renderBoard();renderTray();
}
async function main(){
  await document.fonts.load('900 20px Nunito');
  const [board,tile,metadata]=await Promise.all([
    Assets.load('assets/board-minimal@2x.png'),Assets.load('assets/hex-neutral-rounded-64.png'),
    fetch('assets/minimal-geometry.json').then(response=>{if(!response.ok)throw new Error('Не удалось загрузить координаты поля');return response.json();})
  ]);
  textures={board,tile};geometry=metadata;
  app=new Application();await app.init({width:420,height:880,backgroundAlpha:0,antialias:true,autoDensity:true,resolution:Math.min(devicePixelRatio||1,2),preference:'webgl',eventFeatures:{move:true,globalMove:true,click:true,wheel:false}});
  $('game').prepend(app.canvas);app.canvas.tabIndex=0;app.canvas.setAttribute('aria-label','Гексагональное поле и три фигуры');app.canvas.setAttribute('aria-describedby','accessible-instructions');
  root=new Container();app.stage.addChild(root);app.stage.eventMode='static';
  backdrop=new Sprite(textures.board);backdrop.anchor.set(.5);root.addChild(backdrop);
  boardLayer=new Container();previewLayer=new Container();effectsLayer=new Container();trayLayer=new Container();dragLayer=new Container();
  for(const layer of [boardLayer,previewLayer,effectsLayer,trayLayer,dragLayer])root.addChild(layer);
  boardLayer.eventMode='none';previewLayer.eventMode='none';effectsLayer.eventMode='none';dragLayer.eventMode='none';
  app.stage.on('globalpointermove',e=>{if(drag&&!drag.keyboard&&e.pointerId===drag.pointerId){drag.pointer=pointFromEvent(e.nativeEvent);poseDrag();}});
  app.canvas.addEventListener('pointerup',finishDrag);app.canvas.addEventListener('pointercancel',cancelDrag);app.canvas.addEventListener('lostpointercapture',()=>{if(drag&&!drag.keyboard)cancelDrag();});
  window.addEventListener('blur',cancelDrag);document.addEventListener('keydown',keyboard);
  $('restart').onclick=()=>{sound.unlock();reset();};$('undo').onclick=undo;$('swap').onclick=()=>useTool('swap');$('deal').onclick=()=>useTool('deal');$('help').onclick=showHelp;
  $('sound').onclick=()=>{sound.toggle();syncSound();};
  function syncSound(){$('sound').setAttribute('aria-pressed',String(sound.muted));$('sound').setAttribute('aria-label',sound.muted?'Включить звук':'Выключить звук');}syncSound();
  new ResizeObserver(resize).observe($('game'));resize();updateHUD(false);$('loading').remove();
  app.ticker.add(ticker=>{
    const dt=Math.min(ticker.deltaMS,50);
    const active=tweens;tweens=[];
    for(const t of active){
      if(t.target.destroyed||t.target._destroyed)continue;t.elapsed+=dt;if(t.elapsed<t.delay){tweens.push(t);continue;}const p=clamp((t.elapsed-t.delay)/t.duration,0,1),f=ease(p);for(const k in t.to)t.target[k]=t.from[k]+(t.to[k]-t.from[k])*f;
      if(p<1)tweens.push(t);else t.done?.();
    }
    if(drag&&!drag.keyboard&&performance.now()-drag.began<140)poseDrag();
    for(let i=flights.length-1;i>=0;i--){const f=flights[i];f.elapsed+=dt;if(f.elapsed<0)continue;f.node.alpha=1;const p=clamp(f.elapsed/f.duration,0,1),e=ease(p);f.node.x=f.from.x+(f.to.x-f.from.x)*e+Math.sin(p*Math.PI)*22;f.node.y=f.from.y+(f.to.y-f.from.y)*e;f.node.scale.set(1-.45*p);if(p>=1){f.node.destroy();flights.splice(i,1);}}
    if(Math.abs(scoreShown-game.score)>.1){scoreShown+=(game.score-scoreShown)*(1-Math.exp(-dt/130));$('score').textContent=Math.round(scoreShown).toLocaleString('ru-RU');}else if(scoreShown!==game.score){scoreShown=game.score;$('score').textContent=game.score.toLocaleString('ru-RU');}
  });
}
main().catch(error=>{console.error(error);$('loading').innerHTML='Не удалось загрузить игру.<span style="font-size:12px;letter-spacing:0">Обнови страницу или проверь файлы прототипа.</span>';});
