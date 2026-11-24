export class Sound {
  constructor(){try{this.muted=localStorage.getItem('hex-towers-muted')==='1';}catch{this.muted=false;}}
  unlock(){if(this.muted)return;try{this.context??=new (window.AudioContext||window.webkitAudioContext)();if(this.context.state==='suspended')this.context.resume().catch(()=>{});}catch{}}
  tone(freq,duration=.12,delay=0,volume=.045,type='sine'){
    if(this.muted)return;this.unlock();if(!this.context)return;
    const a=this.context,t=a.currentTime+delay,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(volume,t);g.gain.exponentialRampToValueAtTime(.001,t+duration);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+duration);o.onended=()=>{o.disconnect();g.disconnect();};
  }
  lift(){this.tone(520,.05,0,.025);}
  land(n=1){this.tone(168-Math.min(n,3)*22,.12,0,.06);this.tone(78,.15,.005,.04);}
  reward(){[523.25,659.25,783.99,1046.5].forEach((f,i)=>this.tone(f,.14+i*.025,i*.05,.04));}
  bonus(){[659,988,1318].forEach((f,i)=>this.tone(f,.15+i*.05,i*.09,.04));}
  merge(){this.tone(130.81,.34,0,.07);this.tone(196,.26,.03,.04);this.tone(261.63,.22,.06,.035,'triangle');}
  deny(){this.tone(180,.08,0,.018,'triangle');}
  undo(){[587,440,330].forEach((f,i)=>this.tone(f,.08,i*.055,.03,'triangle'));}
  deal(){[392,494,587].forEach((f,i)=>this.tone(f,.08,i*.065,.03,'triangle'));}
  over(){[392,330,261].forEach((f,i)=>this.tone(f,.24+i*.13,i*.15,.04));}
  toggle(){this.muted=!this.muted;try{localStorage.setItem('hex-towers-muted',this.muted?'1':'0');}catch{}if(!this.muted)this.unlock();return this.muted;}
}
