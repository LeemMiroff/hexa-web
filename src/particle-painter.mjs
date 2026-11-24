// PNG-only replacements. Physics and particle sizes remain owned by the engine.
export function createParticlePainter(images){
  return function paint(g,p,k){
    const z=p.size*(.6+.4*Math.min(1,k/.1)),fade=k>.6?Math.max(0,(1-k)/.4):1;
    const source=p.originColor??p.c,c=source>=0&&source<3?source:(p.shape===4?3:1);
    const shape=p.shape===0?'capsule':p.shape===1||p.shape===2?'hex':'dot';
    let w,h;g.globalAlpha=fade;
    if(p.shape===0){g.scale(1,.3+.7*Math.abs(Math.cos(p.age*.011+(p.ph||0))));w=z*2.1;h=z*1.3;}
    else if(p.shape===1){g.scale(.45+.55*Math.abs(Math.cos(p.age*.008+(p.ph||0))),1);w=h=z*2.3;}
    else if(p.shape===2){g.translate(Math.sin(p.age*.004+(p.ph||0))*z*.28,0);g.globalAlpha=fade*Math.min(1,k/.08);w=h=z*2.2;}
    else if(p.shape===3){const tw=.55+.45*Math.abs(Math.sin(p.age*.012+(p.ph||0)));w=h=z*3.4*tw;}
    else{g.globalAlpha=fade*.55*(1-k*.6);w=h=z*(.6+.9*k)*2;}
    g.drawImage(images[shape][c],-w/2,-h/2,w,h);
  };
}
