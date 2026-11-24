// Alternative timbres only. The engine still owns notes, timing and sequences.
export function createSoftGlassPalette(){
  const waves=new WeakMap();
  return function play(context,frequency,duration,type,volume,delay=0){
    let bank=waves.get(context);
    if(!bank){
      const wave=partials=>context.createPeriodicWave(new Float32Array(partials.length),Float32Array.from(partials));
      bank={body:wave([0,1,.22,.07,.025]),glass:wave([0,1,.08,.24,.025,.06]),soft:wave([0,1,.14,.035])};
      waves.set(context,bank);
    }
    const time=context.currentTime+(delay||0),end=time+duration;
    const oscillator=context.createOscillator(),gain=context.createGain();
    oscillator.setPeriodicWave(frequency<300?bank.body:type==='square'?bank.soft:bank.glass);
    oscillator.frequency.setValueAtTime(frequency,time);
    gain.gain.setValueAtTime(.0001,time);
    gain.gain.exponentialRampToValueAtTime(Math.max(.0001,volume*.8),time+Math.min(.004,duration*.12));
    gain.gain.exponentialRampToValueAtTime(.0001,end);
    oscillator.connect(gain);gain.connect(context.destination);
    oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
    oscillator.start(time);oscillator.stop(end);
  };
}
export function createWoodGlassPalette(){
  const glass=createSoftGlassPalette(),buffers=new WeakMap();
  const rewards=new Set(['tier','charge','best','levelUp','goal','over']);
  return function play(context,frequency,duration,type,volume,delay=0,event=''){
    if(event==='deny'||event==='thud'||event==='empty')return false;
    if(rewards.has(event))return glass(context,frequency,duration,type,volume,delay);
    let cache=buffers.get(context);if(!cache){cache=new Map();buffers.set(context,cache);}
    const key=frequency+':'+duration;
    let buffer=cache.get(key);
    if(!buffer){
      const rate=context.sampleRate,length=Math.max(1,Math.ceil(duration*rate));
      buffer=context.createBuffer(1,length,rate);const data=buffer.getChannelData(0);
      const decay=Math.min(.045,duration*.35);
      for(let i=0;i<length;i++){
        const t=i/rate,attack=Math.min(1,t/.0012),end=Math.min(1,(length-1-i)/(rate*.003));
        const body=Math.sin(2*Math.PI*frequency*t)*Math.exp(-t/decay);
        const knock=.32*Math.sin(2*Math.PI*frequency*2.76*t)*Math.exp(-t/(decay*.4));
        const click=.12*Math.sin(2*Math.PI*frequency*5.4*t)*Math.exp(-t/.004);
        data[i]=(body+knock+click)*.65*attack*end;
      }
      if(cache.size>=64)cache.delete(cache.keys().next().value);cache.set(key,buffer);
    }
    const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;gain.gain.value=volume;
    source.connect(gain);gain.connect(context.destination);
    source.onended=()=>{source.disconnect();gain.disconnect();};
    source.start(context.currentTime+(delay||0));
  };
}
// Rounded ceramic tones: a sine body and a quiet second harmonic, no impact click.
export function createWarmCeramicPalette(){
  const waves=new WeakMap();
  const rewards=new Set(['tier','charge','best','levelUp','goal']);
  return function play(context,frequency,duration,type,volume,delay=0,event=''){
    if(event==='deny'||event==='thud'||event==='empty')return false;
    let bank=waves.get(context);
    if(!bank){
      const wave=partials=>context.createPeriodicWave(new Float32Array(partials.length),Float32Array.from(partials));
      bank={body:wave([0,1,.045,.008]),bell:wave([0,1,.075,.012])};waves.set(context,bank);
    }
    const reward=rewards.has(event),time=context.currentTime+(delay||0),end=time+duration;
    const oscillator=context.createOscillator(),gain=context.createGain();
    oscillator.setPeriodicWave(reward?bank.bell:bank.body);
    oscillator.frequency.setValueAtTime(frequency,time);
    const attack=Math.min(reward?.014:.01,duration*.22),peak=volume*(reward?.72:.78);
    gain.gain.setValueAtTime(0,time);
    gain.gain.linearRampToValueAtTime(peak,time+attack);
    gain.gain.exponentialRampToValueAtTime(.0001,end);
    oscillator.connect(gain);gain.connect(context.destination);
    oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
    oscillator.start(time);oscillator.stop(end);
  };
}
// Close to the original's pure tones: subtle colour, unchanged note scheduling.
export function createSoftOriginalPalette(){
  const waves=new WeakMap();
  const rewards=new Set(['tier','charge','best','levelUp','goal']);
  return function play(context,frequency,duration,type,volume,delay=0,event=''){
    let bank=waves.get(context);
    if(!bank){
      const wave=partials=>context.createPeriodicWave(new Float32Array(partials.length),Float32Array.from(partials));
      bank={warm:wave([0,1,.018,.006]),air:wave([0,1,.009,.016]),round:wave([0,1,0,-.065,0,.012]),refusal:wave([0,1,0,.12,0,.028])};
      waves.set(context,bank);
    }
    const reward=rewards.has(event),refusal=event==='deny',low=frequency<300;
    const time=context.currentTime+(delay||0),end=time+duration;
    const oscillator=context.createOscillator(),gain=context.createGain();
    oscillator.setPeriodicWave(refusal?bank.refusal:type==='triangle'?bank.round:reward||event==='tick'?bank.air:bank.warm);
    oscillator.frequency.setValueAtTime(frequency,time);
    const attack=Math.min(refusal?.002:low?.003:.004,duration*.1);
    const peak=volume*(reward?.96:refusal?.9:1);
    gain.gain.setValueAtTime(0,time);
    gain.gain.linearRampToValueAtTime(peak,time+attack);
    gain.gain.exponentialRampToValueAtTime(.001,end);
    oscillator.connect(gain);gain.connect(context.destination);
    oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
    oscillator.start(time);oscillator.stop(end);
  };
}
