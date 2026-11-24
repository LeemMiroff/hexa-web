const indicator=document.querySelector('.tab-indicator');let indicatorSide=0;let indicatorAnimation;
const ranking=document.querySelector('#ranking'),yourRow=document.querySelector('.your-row');
const rankingData={},rankingRequests={};
const menuScreen=document.querySelector('.screen');
let requestSequence=0;

function requestRanking(mode){
  if(window.parent===window)return;
  const requestId=++requestSequence;
  rankingRequests[mode]=requestId;
  window.parent.postMessage({type:'hex-ranking-request',mode,requestId},location.origin);
}

function rankingElement(tag,className,value){
  const element=document.createElement(tag);
  element.className=className;
  element.textContent=value;
  return element;
}

function show(mode){
  const data=rankingData[mode]??{};
  const rows=(data.rows??[]).map(({name,score,rank})=>{
    const row=rankingElement('div','row','');
    row.append(rankingElement('span','rank',rank),rankingElement('span','avatar',rank),
      rankingElement('span','name',name),rankingElement('strong','',score.toLocaleString('ru-RU')));
    return row;
  });
  const message=data.message??(data.rows?(rows.length?'':'Пока нет результатов'):
    window.parent===window?'Рейтинг доступен в ВК':'Загрузка рейтинга…');
  if(data.notice)rows.unshift(rankingElement('p','ranking-status',data.notice));
  if(message)rows.push(rankingElement('p','ranking-status',message));
  ranking.replaceChildren(...rows);
  if(menuScreen.classList.contains('result-transition'))return;
  const personal=data.personal;
  document.querySelector('.guest-name').textContent=personal?.name??(data.rows?'Вы':'Гость');
  document.querySelector('#place').textContent=personal?.rank??'—';
  document.querySelector('#score').textContent=personal?.score?.toLocaleString('ru-RU')??'—';
  document.querySelector('#movement').style.visibility='hidden';
}
let rankingRun=0,rankingAnimations=[],renderedMode='day';
window.addEventListener('message',event=>{
  if(event.origin!==location.origin||event.source!==window.parent||event.data?.type!=='hex-ranking-data')return;
  const {mode,requestId,data}=event.data;
  if(rankingRequests[mode]!==requestId)return;
  rankingData[mode]=data;
  if(renderedMode===mode&&!rankingAnimations.length)show(mode);
});
function interruptRanking(){
  rankingRun++;
  for(const row of ranking.querySelectorAll('.row')){const style=getComputedStyle(row);row.style.transform=style.transform;row.style.opacity=style.opacity;}
  const current=getComputedStyle(indicator).transform;indicatorAnimation?.cancel();indicator.style.transform=current;
  rankingAnimations.forEach(animation=>animation.cancel());rankingAnimations=[];
}
async function switchRanking(mode,offset=0,velocity=0){
  const next=mode==='all'?1:0;
  requestRanking(mode);
  if(next===indicatorSide)return;
  interruptRanking();const run=rankingRun;
  const direction=next>indicatorSide?-1:1,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,duration=reduced?0:Math.max(90,Math.min(220,(ranking.clientWidth-Math.min(ranking.clientWidth,Math.abs(offset)))/Math.max(.9,Math.abs(velocity))));
  const indicatorStart=indicator.style.transform,from=indicatorSide;indicatorSide=next;const distance=indicator.parentElement.clientWidth/2-2,pos=n=>'translateX('+(n*distance)+'px)';indicator.style.transform=pos(next);
  document.querySelectorAll('.tab').forEach(item=>{const active=item.dataset.mode===mode;item.classList.toggle('active',active);item.setAttribute('aria-selected',active)});
  if(!reduced)indicatorAnimation=indicator.animate([{transform:indicatorStart},{transform:pos(next)}],{duration:220,easing:'cubic-bezier(.2,.8,.2,1)'});
  const rows=[...ranking.querySelectorAll('.row')],width=ranking.clientWidth;
  if(mode===renderedMode){
    rankingAnimations=rows.map(row=>{const start={transform:row.style.transform,opacity:row.style.opacity};row.style.transform='';row.style.opacity='';return row.animate([start,{transform:'translateX(0)',opacity:1}],{duration:reduced?0:200,easing:'cubic-bezier(0,0,.2,1)'});});
  }else{
    rankingAnimations=rows.map(row=>row.animate([{transform:offset?`translateX(${offset}px)`:row.style.transform,opacity:row.style.opacity},{transform:`translateX(${direction*width}px)`,opacity:1}],{duration,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'}));
    try{await Promise.all(rankingAnimations.map(animation=>animation.finished));}catch{return;}
    if(run!==rankingRun)return;
    rankingAnimations.forEach(animation=>animation.cancel());show(mode);renderedMode=mode;ranking.scrollTop=0;
    rankingAnimations=[...ranking.querySelectorAll('.row')].slice(0,10).map((row,i)=>row.animate([{transform:'translateY(-28px)',opacity:0},{transform:'translateY(0)',opacity:1}],{duration:reduced?0:260,delay:reduced?0:i*25,easing:'cubic-bezier(.2,.8,.2,1)',fill:'backwards'}));
  }
  try{await Promise.all(rankingAnimations.map(animation=>animation.finished));}catch{return;}
  if(run===rankingRun){rankingAnimations.forEach(animation=>animation.cancel());rankingAnimations=[];show(mode);}
}
document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>switchRanking(tab.dataset.mode)));show('day');

window.addEventListener('message',async event=>{
  if(event.origin!==location.origin||event.source!==window.parent||event.data?.type!=='hex-result-show')return;
  const score=Math.max(0,Math.floor(Number(event.data.score)||0)),best=Math.max(0,Math.floor(Number(event.data.best)||0)),newRecord=Boolean(event.data.newRecord),screen=document.querySelector('.screen');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,firstResult=best===0;
  const dim=document.createElement('div');dim.className='result-dim';document.body.append(dim);
  const points=document.querySelector('#score'),place=document.querySelector('#place'),movement=document.querySelector('#movement');
  interruptRanking();
  indicatorSide=0;indicatorAnimation?.cancel();indicator.style.transform='translateX(0)';
  document.querySelectorAll('.tab').forEach(tab=>{const selected=tab.dataset.mode==='day';tab.classList.toggle('active',selected);tab.setAttribute('aria-selected',selected);});
  show('day');renderedMode='day';ranking.scrollTop=0;place.textContent='—';requestRanking('day');
  movement.style.visibility='hidden';points.textContent='0';yourRow.classList.remove('rise');yourRow.classList.add('result-centered','result-transition-row');
  const result=points.parentElement,scores=document.createElement('span'),bestLine=document.createElement('span'),scoreLine=document.createElement('span');
  scores.className='result-scores';bestLine.className=scoreLine.className='result-score-line';
  const bestLabel=document.createElement('span'),scoreLabel=document.createElement('span'),bestNumber=document.createElement('strong');
  bestLabel.className=scoreLabel.className='result-score-label';bestLabel.textContent='РЕКОРД';scoreLabel.textContent='РЕЗУЛЬТАТ';bestNumber.textContent=best.toLocaleString('ru-RU');
  if(!firstResult){
    bestLine.append(bestLabel,bestNumber);scoreLine.append(scoreLabel,points);scores.append(bestLine,scoreLine);result.append(scores);
    points.textContent=score.toLocaleString('ru-RU');
    const numberWidth=Math.max(points.offsetWidth,bestNumber.offsetWidth);scores.style.setProperty('--result-number-width',`${numberWidth+2}px`);points.textContent='0';
  }
  function animateFinalNumber(source){
    if(reduced)return null;
    const target=document.createElement('strong');target.className='result-score-target';target.textContent=source.textContent;result.append(target);
    const from=source.getBoundingClientRect(),to=target.getBoundingClientRect(),scale=19/15;
    const x=to.right-from.right,y=(to.top+to.height/2)-(from.top+from.height/2);
    target.remove();
    return source.animate([{transform:'translate(0,0) scale(1)'},{transform:`translate(${x}px,${y}px) scale(${scale})`}],{duration:350,easing:'cubic-bezier(.2,.8,.2,1)',fill:'forwards'});
  }
  let mergePromise=null;
  function mergeScores(){
    if(mergePromise)return mergePromise;
    mergePromise=(async()=>{
      const animations=reduced?[]:[bestLine.animate([{opacity:1},{opacity:0}],{duration:350,easing:'ease-out',fill:'forwards'}),scoreLabel.animate([{opacity:1},{opacity:1,offset:.35},{opacity:0}],{duration:350,easing:'ease-out',fill:'forwards'}),animateFinalNumber(points)];
      await Promise.all(animations.map(animation=>animation.finished));
      result.append(points);scores.remove();animations.forEach(animation=>animation.cancel());
    })();return mergePromise;
  }
  screen.classList.remove('leaving','returning');screen.classList.add('result-intro','result-transition');document.documentElement.classList.add('result-intro');
  const rect=yourRow.getBoundingClientRect(),offset=innerHeight/2-(rect.top+rect.height/2);
  yourRow.style.transform=`translateY(${offset}px)`;
  const drop=yourRow.animate([{transform:`translateY(${-rect.bottom-20}px)`},{transform:`translateY(${offset}px)`}],{duration:reduced?0:350,easing:'cubic-bezier(0,0,.2,1)'});
  window.parent.postMessage({type:'hex-result-ready'},location.origin);
  const started=performance.now(),duration=reduced?0:1500;let lastValue=-1,lastTick=-1,recordLabel;
  function celebrateRecord(){
    recordLabel=document.createElement('div');recordLabel.className='result-record result-record-floating';recordLabel.textContent='НОВЫЙ РЕКОРД';recordLabel.style.top=`${innerHeight/2-rect.height/2-48}px`;document.body.append(recordLabel);
    recordLabel.animate([{opacity:0,transform:'translate(-50%,12px) scale(.8)'},{opacity:1,transform:'translate(-50%,0) scale(1)'}],{duration:reduced?0:300,easing:'cubic-bezier(0,0,.2,1)'});
    window.parent.postMessage({type:'hex-result-best'},location.origin);
    const theme=['classic','warm-flat-test','pearl','monochrome'].includes(document.documentElement.dataset.menuTheme)?document.documentElement.dataset.menuTheme:'classic';
    if(!reduced)for(let burst=0;burst<5;burst++){
      const orbit=burst*Math.PI*2/5,originX=Math.cos(orbit)*Math.min(140,yourRow.clientWidth*.4),originY=-35+Math.sin(orbit)*56;
      setTimeout(()=>window.parent.postMessage({type:'hex-result-pop',index:burst},location.origin),burst*250);
      for(let i=0;i<6;i++){
        const dot=document.createElement('i'),angle=i*Math.PI*2/6+orbit,dist=72+(i%3)*21;dot.className='result-particle';dot.style.backgroundImage=`url('../particles/${theme}-hex-${(i+burst)%3}.png')`;document.body.append(dot);
        const animation=dot.animate([{transform:`translate(${originX}px,${originY}px) scale(.8)`,opacity:1},{opacity:1,offset:.6},{transform:`translate(${originX+Math.cos(angle)*dist}px,${originY+Math.sin(angle)*dist}px) scale(.2)`,opacity:0}],{delay:burst*250,duration:900,easing:'cubic-bezier(0,0,.2,1)'});animation.onfinish=()=>dot.remove();
      }
    }
  }
  const count=new Promise(resolve=>{function frame(now){const progress=duration?Math.min(1,(now-started)/duration):1,value=Math.round(score*progress),tick=Math.floor(progress*15);if(value!==lastValue){lastValue=value;points.textContent=value.toLocaleString('ru-RU');}if(score>0&&tick!==lastTick&&progress<1){lastTick=tick;window.parent.postMessage({type:'hex-result-tick',index:tick},location.origin);}if(progress<1)requestAnimationFrame(frame);else resolve();}requestAnimationFrame(frame);});
  await new Promise(resolve=>setTimeout(resolve,reduced?0:400));drop.cancel();window.parent.postMessage({type:'hex-result-exit'},location.origin);
  await new Promise(resolve=>setTimeout(resolve,reduced?0:250));
  document.documentElement.classList.remove('result-intro');screen.classList.remove('result-intro');window.parent.postMessage({type:'hex-result-land'},location.origin);
  const parts=[...document.querySelectorAll('.tabs,.ranking,.themes')],play=document.querySelector('.play');
  const entrance=parts.map(element=>element.animate([{transform:'translateY(-100vh)'},{transform:'translateY(0)'}],{duration:reduced?0:250,easing:'cubic-bezier(0,0,.2,1)'}));
  entrance.push(play.animate([{transform:'translateY(100vh)'},{transform:'translateY(0)'}],{duration:reduced?0:250,easing:'cubic-bezier(0,0,.2,1)'}));
  await count;
  if(newRecord)celebrateRecord();
  await new Promise(resolve=>setTimeout(resolve,reduced?0:newRecord?1150:700));
  if(recordLabel){
    const fade=recordLabel.animate([{opacity:1},{opacity:0}],{duration:reduced?0:1500,easing:'linear',fill:'forwards'});
    fade.onfinish=()=>recordLabel.remove();
  }
  yourRow.classList.remove('result-centered');
  const dimFade=dim.animate([{opacity:1},{opacity:0}],{duration:reduced?0:1100,easing:'cubic-bezier(.2,.8,.2,1)',fill:'forwards'});
  const flight=yourRow.animate([{transform:`translateY(${offset}px)`},{transform:'translateY(0)'}],{duration:reduced?0:1100,easing:'cubic-bezier(.2,.8,.2,1)',fill:'forwards'});
  await flight.finished;dimFade.cancel();dim.remove();yourRow.style.transform='';flight.cancel();yourRow.classList.remove('result-transition-row');
  if(!firstResult&&newRecord)await mergeScores();
  if(!newRecord&&!firstResult){
    await new Promise(resolve=>setTimeout(resolve,reduced?0:300));
    const animations=reduced?[]:[scoreLine.animate([{opacity:1},{opacity:0}],{duration:220,easing:'ease-out',fill:'forwards'}),animateFinalNumber(bestNumber),bestLabel.animate([{opacity:1},{opacity:1,offset:.45},{opacity:0}],{duration:350,easing:'ease-out',fill:'forwards'})];
    await Promise.all(animations.map(animation=>animation.finished));points.textContent=best.toLocaleString('ru-RU');result.append(points);scores.remove();animations.forEach(animation=>animation.cancel());
  }
  await Promise.all(entrance.map(animation=>animation.finished));entrance.forEach(animation=>animation.cancel());yourRow.classList.remove('result-transition-row');screen.classList.remove('result-transition');leaving=false;
  show(renderedMode);
});

let leaving=false,canResume=false;
let unlockedThemes=[];
function isUnlocked(id){return !['pearl','monochrome'].includes(id)||unlockedThemes.includes(id);}
function updatePlayButton(){const button=document.querySelector('.play'),prices={pearl:199,monochrome:299},id=document.documentElement.dataset.menuTheme,price=isUnlocked(id)?null:prices[id];button.classList.toggle('purchase',!!price);button.innerHTML=price?`Купить за ${price} ₽`:canResume?'Продолжить':'Играть <span>▶</span>';}
window.addEventListener('message',event=>{if(event.origin!==location.origin||event.source!==window.parent||event.data?.type!=='hex-menu-session')return;canResume=Boolean(event.data.canResume);updatePlayButton();});
document.querySelector('.play').addEventListener('click',()=>{
  if(leaving||document.querySelector('.play').classList.contains('in-flight'))return;
  if(themeChanging)cancelThemeTransition();
  if(document.querySelector('.play').classList.contains('purchase')){const id=document.documentElement.dataset.menuTheme;unlockedThemes.push(id);try{localStorage.setItem('hex-unlocked-themes',JSON.stringify(unlockedThemes));localStorage.setItem('hex-visual-theme',id);}catch{}selectTheme(id);if(window.parent!==window)window.parent.postMessage({type:'hex-theme-select',id},location.origin);return;}
  leaving=true;
  const screen=document.querySelector('.screen');screen.classList.add('leaving');
  const duration=matchMedia('(prefers-reduced-motion: reduce)').matches?0:350;
  setTimeout(()=>{if(window.parent!==window){setCountdownActive(false);window.parent.postMessage({type:'hex-menu-play',resume:canResume},location.origin);}else location.replace('../../index.html');},duration);
});
window.addEventListener('message',async event=>{
  if(event.origin!==location.origin||event.source!==window.parent||event.data!=='hex-menu-show')return;
  const screen=document.querySelector('.screen'),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  screen.classList.add('returning');screen.classList.remove('leaving');yourRow.style.visibility='hidden';
  requestRanking(indicatorSide?'all':'day');
  const parts=[...document.querySelectorAll('.tabs,.ranking')].map(element=>[element,'translateY(-120vh)']);
  parts.push([document.querySelector('.play'),'translateY(120vh)']);
  document.querySelectorAll('.theme-item').forEach(element=>parts.push([element,'translateX(-120vw)']));
  const animations=parts.map(([element,away])=>element.animate([{transform:away},{transform:'translate(0,0)'}],{duration:reduced?0:250,easing:'cubic-bezier(0,0,.2,1)',fill:'forwards'}));
  window.parent.postMessage({type:'hex-menu-ready'},location.origin);
  try{await Promise.all(animations.map(animation=>animation.finished));}finally{animations.forEach(animation=>animation.cancel());screen.classList.remove('returning');yourRow.classList.remove('rise');void yourRow.offsetWidth;yourRow.style.visibility='';yourRow.classList.add('rise');leaving=false;}
});

const themeButtons=[...document.querySelectorAll('.theme-choice')],toast=document.querySelector('.theme-toast');let toastTimer;
const demoCountdown=document.createElement('span');demoCountdown.className='theme-countdown';demoCountdown.setAttribute('aria-hidden','true');themeButtons[1].append(demoCountdown);
let demoCountdownTimer,countdownActive=window.parent===window;
function setCountdownActive(active){countdownActive=active;updateDemoCountdown();}
function updateDemoCountdown(){
  clearTimeout(demoCountdownTimer);const now=new Date(),end=new Date(now);end.setHours(24,0,0,0);const seconds=Math.max(0,Math.ceil((end-now)/1000));
  demoCountdown.hidden=seconds===0;themeButtons[1].classList.toggle('has-countdown',seconds>0);
  demoCountdown.textContent=[Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60].map(value=>String(value).padStart(2,'0')).join(':');
  if(countdownActive&&!document.hidden)demoCountdownTimer=setTimeout(updateDemoCountdown,1000);
}
document.addEventListener('visibilitychange',updateDemoCountdown);updateDemoCountdown();
window.addEventListener('message',event=>{if(event.origin===location.origin&&event.source===window.parent&&(event.data==='hex-menu-show'||event.data?.type==='hex-result-show'))setCountdownActive(true);});
function selectTheme(id){const selectedIndex=['classic','warm-flat-test','pearl','monochrome'].indexOf(id);document.documentElement.dataset.menuTheme=id;themeButtons.forEach((button,i)=>{const selected=i===selectedIndex;button.classList.toggle('selected',selected);button.classList.toggle('unlocked',i>=2&&isUnlocked(['classic','warm-flat-test','pearl','monochrome'][i]));button.setAttribute('aria-pressed',String(selected));});updatePlayButton();}
window.addEventListener('message',event=>{if(event.origin!==location.origin||event.source!==window.parent||event.data!=='hex-reset-demo-purchases')return;unlockedThemes=[];const current=document.documentElement.dataset.menuTheme;selectTheme(['pearl','monochrome'].includes(current)?'classic':current);});
let savedTheme='classic';try{const saved=localStorage.getItem('hex-visual-theme');if(['warm-flat-test','pearl','monochrome'].includes(saved)&&isUnlocked(saved))savedTheme=saved;}catch{}selectTheme(savedTheme);
let themeChanging=false,themeRun=0,themeAnimations=[];
function cancelThemeTransition(){
  themeRun++;themeAnimations.forEach(animation=>animation.cancel());themeAnimations=[];
  document.querySelectorAll('.tabs,.ranking,.your-row,.play,.theme-item').forEach(element=>{element.style.transform='';});
  yourRow.style.visibility='';document.querySelector('.screen').classList.remove('theme-changing');
  themeButtons.forEach(item=>item.classList.remove('in-flight'));document.querySelector('.play').classList.remove('in-flight');themeChanging=false;
}
function showThemeName(name,button){clearTimeout(toastTimer);button.parentElement.append(toast);toast.textContent=name;toast.classList.add('visible');}
function hideThemeName(delay=0){clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),delay);}
themeButtons.forEach((button,i)=>button.addEventListener('click',async()=>{
  if(leaving||button.classList.contains('in-flight'))return;
  const names=['Праздник','Шоколад','Жемчуг','Рояль'];
  const id=['classic','warm-flat-test','pearl','monochrome'][i];
  if(document.documentElement.dataset.menuTheme===id){showThemeName(names[i],button);hideThemeName(1200);return;}
  showThemeName(names[i],button);
  themeButtons.forEach((item,index)=>{const selected=index===i;item.classList.toggle('selected',selected);item.setAttribute('aria-pressed',String(selected));});
  const run=++themeRun;
  const screen=document.querySelector('.screen');
  if(themeChanging){
    const elements=new Set(themeAnimations.map(animation=>animation.effect.target));
    for(const element of elements)element.style.transform=getComputedStyle(element).transform;
    themeAnimations.forEach(animation=>animation.cancel());
    themeAnimations=[];
  }
  themeChanging=true;screen.classList.add('theme-changing');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,duration=reduced?0:250;
  const items=[...document.querySelectorAll('.theme-item')];
  items[i].style.transform='';
  const parts=[...document.querySelectorAll('.tabs,.ranking,.your-row')].map(element=>[element,'translateY(-120vh)']);
  parts.push([document.querySelector('.play'),'translateY(120vh)']);
  items.forEach((element,index)=>{if(index!==i)parts.push([element,index<i?'translateX(-120vw)':'translateX(120vw)']);});
  themeButtons.forEach((item,index)=>item.classList.toggle('in-flight',index!==i));
  document.querySelector('.play').classList.add('in-flight');
  const animate=(from,to,easing)=>{
    const animations=parts.filter(([element])=>!to||element!==yourRow).map(([element,away])=>{
      const start=from?(element.style.transform||'translate(0,0)'):away;
      const animation=element.animate([{transform:start},{transform:to?'translate(0,0)':away}],{duration:to&&!reduced?250:duration,easing,fill:'forwards'});
      if(to&&element.classList.contains('theme-item'))animation.finished.then(()=>{if(run===themeRun)element.querySelector('.theme-choice').classList.remove('in-flight');}).catch(()=>{});
      if(to&&element.classList.contains('play'))animation.finished.then(()=>{if(run===themeRun)element.classList.remove('in-flight');}).catch(()=>{});
      return animation;
    });
    themeAnimations.push(...animations);return Promise.all(animations.map(animation=>animation.finished));
  };
  try{
    await animate(true,false,'cubic-bezier(.4,0,1,1)');
    yourRow.style.visibility='hidden';
    selectTheme(id);if(isUnlocked(id)){try{localStorage.setItem('hex-visual-theme',id);}catch{}if(window.parent!==window)window.parent.postMessage({type:'hex-theme-select',id},location.origin);}
    await animate(false,true,'cubic-bezier(0,0,.2,1)');
    themeAnimations.forEach(animation=>animation.cancel());themeAnimations=[];for(const [element] of parts)element.style.transform='';items.forEach(element=>element.style.transform='');
    screen.classList.remove('theme-changing');yourRow.classList.remove('rise');void yourRow.offsetWidth;yourRow.style.visibility='';yourRow.classList.add('rise');
    hideThemeName(reduced?0:1100);
  }catch{}finally{if(run===themeRun){yourRow.style.visibility='';screen.classList.remove('theme-changing');themeButtons.forEach(item=>item.classList.remove('in-flight'));document.querySelector('.play').classList.remove('in-flight');themeChanging=false;}}
}));
window.addEventListener('message',event=>{if(event.origin===location.origin&&event.source===window.parent&&event.data?.type==='hex-theme-sync')selectTheme(event.data.id);});/* Elastic feedback when a touch pulls the ranking past either end. */
let pullStartY=null,pullDistance=0;
function releaseRankingPull(){
  if(!pullDistance){pullStartY=null;return;}
  for(const row of ranking.querySelectorAll('.row')){row.style.transition='translate 350ms cubic-bezier(.2,.8,.2,1)';row.style.translate='0 0';}
  pullDistance=0;pullStartY=null;
}
ranking.addEventListener('touchstart',event=>{if(event.touches.length!==1)return;pullStartY=event.touches[0].clientY;pullDistance=0;for(const row of ranking.querySelectorAll('.row'))row.style.transition='none';},{passive:true});
ranking.addEventListener('touchmove',event=>{
  if((rankingSwipe&&(rankingSwipe.axis==='x'||Math.abs(event.touches[0].clientX-rankingSwipe.x)>Math.abs(event.touches[0].clientY-rankingSwipe.y)))||pullStartY===null||event.touches.length!==1||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const y=event.touches[0].clientY,delta=y-pullStartY,atTop=ranking.scrollTop<=0,atBottom=ranking.scrollTop+ranking.clientHeight>=ranking.scrollHeight-1;
  if((delta>0&&atTop)||(delta<0&&atBottom)){
    if(event.cancelable)event.preventDefault();
    pullDistance=Math.sign(delta)*Math.min(55,Math.abs(delta)*.3);
    const bounds=ranking.getBoundingClientRect();
    for(const row of ranking.querySelectorAll('.row')){const rect=row.getBoundingClientRect(),previous=parseFloat(row.style.translate.split(' ')[1])||0,distance=delta>0?rect.top-previous-bounds.top:bounds.bottom-(rect.bottom-previous),weight=Math.min(1,Math.max(0,distance)/Math.max(1,bounds.height));row.style.translate=`0 ${pullDistance*weight}px`;}
  }else if(pullDistance){releaseRankingPull();pullStartY=y;}else pullStartY=y;
},{passive:false});
ranking.addEventListener('touchend',releaseRankingPull,{passive:true});
ranking.addEventListener('touchcancel',releaseRankingPull,{passive:true});
/* Drag the visible rows with the finger before switching tabs. */
let rankingSwipe=null;
ranking.addEventListener('touchstart',event=>{if(event.touches.length===1)rankingSwipe={x:event.touches[0].clientX,y:event.touches[0].clientY,axis:null,offset:0,lastX:event.touches[0].clientX,lastTime:performance.now(),velocity:0};else rankingSwipe=null;},{passive:true});
ranking.addEventListener('touchmove',event=>{
  if(!rankingSwipe||event.touches.length!==1)return;
  const dx=event.touches[0].clientX-rankingSwipe.x,dy=event.touches[0].clientY-rankingSwipe.y;
  if(!rankingSwipe.axis&&Math.max(Math.abs(dx),Math.abs(dy))>5)rankingSwipe.axis=Math.abs(dx)>Math.abs(dy)?'x':'y';
  if(rankingSwipe.axis!=='x')return;
  if(!rankingSwipe.interrupted){interruptRanking();rankingSwipe.interrupted=true;const selected=indicatorSide?'all':'day';if(renderedMode!==selected){show(selected);renderedMode=selected;ranking.scrollTop=0;}for(const row of ranking.querySelectorAll('.row')){row.style.transform='';row.style.opacity='';}}
  if(event.cancelable)event.preventDefault();
  const now=performance.now(),elapsed=now-rankingSwipe.lastTime;if(elapsed>0){rankingSwipe.velocity=(event.touches[0].clientX-rankingSwipe.lastX)/elapsed;rankingSwipe.lastX=event.touches[0].clientX;rankingSwipe.lastTime=now;}
  rankingSwipe.offset=(indicatorSide===0&&dx>0||indicatorSide===1&&dx<0)?dx*.2:dx;
  for(const row of ranking.querySelectorAll('.row'))row.style.transform=`translateX(${rankingSwipe.offset}px)`;
  indicatorAnimation?.cancel();const progress=Math.max(0,Math.min(1,indicatorSide-rankingSwipe.offset/Math.max(1,ranking.clientWidth)));indicator.style.transform=`translateX(${progress*(indicator.parentElement.clientWidth/2-2)}px)`;
},{passive:false});
function finishRankingSwipe(cancelled=false){
  if(!rankingSwipe)return;const swipe=rankingSwipe;rankingSwipe=null;if(swipe.axis!=='x')return;
  const rows=[...ranking.querySelectorAll('.row')],target=swipe.offset<0?'all':'day',canSwitch=!cancelled&&(Math.abs(swipe.offset)>=55||Math.abs(swipe.offset)>12&&Math.abs(swipe.velocity)>.45)&&(target==='all'?indicatorSide===0:indicatorSide===1);
  if(canSwitch){rows.forEach(row=>row.style.transform='');switchRanking(target,swipe.offset,swipe.velocity);return;}
  const distance=indicator.parentElement.clientWidth/2-2,from=Math.max(0,Math.min(1,indicatorSide-swipe.offset/Math.max(1,ranking.clientWidth)))*distance;indicator.style.transform=`translateX(${indicatorSide*distance}px)`;indicatorAnimation=indicator.animate([{transform:`translateX(${from}px)`},{transform:indicator.style.transform}],{duration:200,easing:'cubic-bezier(0,0,.2,1)'});
  const run=rankingRun;rankingAnimations=rows.map(row=>{row.style.transform='';return row.animate([{transform:`translateX(${swipe.offset}px)`},{transform:'translateX(0)'}],{duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:200,easing:'cubic-bezier(0,0,.2,1)'});});
  Promise.all(rankingAnimations.map(animation=>animation.finished)).then(()=>{if(run===rankingRun){rankingAnimations.forEach(animation=>animation.cancel());rankingAnimations=[];}}).catch(()=>{});
}
ranking.addEventListener('touchend',()=>finishRankingSwipe(),{passive:true});
ranking.addEventListener('touchcancel',()=>finishRankingSwipe(true),{passive:true});


// Prepare the hidden menu before the parent dismisses its loading screen.
const menuPrepared=Promise.allSettled([document.fonts.ready,...[...document.images].map(image=>image.decode())]);
window.addEventListener('message',event=>{if(event.origin!==location.origin||event.source!==window.parent||event.data!=='hex-menu-prepare')return;menuPrepared.then(()=>window.parent.postMessage({type:'hex-menu-prepared'},location.origin));});
