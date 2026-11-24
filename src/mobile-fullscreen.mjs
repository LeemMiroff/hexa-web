// Touch release supplies the user activation required by mobile browsers.
const root = document.documentElement;
let pending = false;

export async function toggleFullscreen(){
  if(pending)return;
  pending=true;
  try{
    if(document.fullscreenElement||document.webkitFullscreenElement){
      const exit=document.exitFullscreen||document.webkitExitFullscreen;
      if(exit)await exit.call(document);
    }else{
      const request=root.requestFullscreen||root.webkitRequestFullscreen;
      if(request)await request.call(root);
    }
  }catch{
    // Fullscreen availability depends on the embedding browser and iframe policy.
  }finally{pending=false;}
}

function syncFullscreenButton(){
  const button=document.getElementById('fullscreen');if(!button)return;
  const active=!!(document.fullscreenElement||document.webkitFullscreenElement);
  button.setAttribute('aria-pressed',String(active));
  button.setAttribute('aria-label',active?'Выйти из полного экрана':'Полный экран');
}
document.addEventListener('fullscreenchange',syncFullscreenButton);
document.addEventListener('webkitfullscreenchange',syncFullscreenButton);

function enterFullscreen(event) {
  if(event.target instanceof Element&&event.target.closest('#fullscreen'))return;
  if (!event.isTrusted || pending || document.fullscreenElement || document.webkitFullscreenElement) return;
  if (event.type === 'pointerup' && event.pointerType !== 'touch') return;
  const request = root.requestFullscreen || root.webkitRequestFullscreen;
  if (!request || document.fullscreenEnabled === false) return;
  pending = true;
  try {
    Promise.resolve(request.call(root)).catch(() => {
      // Unsupported or denied fullscreen must not interrupt the game.
    }).finally(() => { pending = false; });
  } catch {
    pending = false;
  }
}

document.addEventListener(window.PointerEvent ? 'pointerup' : 'touchend', enterFullscreen, {
  capture: true,
  passive: true,
});
