export const RADIUS = 4;
export const DIRECTIONS = [[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]];
export const SHAPES = [[[0,0]],[[0,0],[1,0]],[[0,0],[0,1]],[[0,0],[-1,1]],[[0,0],[1,0],[2,0]],[[0,0],[0,1],[0,2]],[[0,0],[1,0],[0,1]],[[0,0],[1,0],[1,-1]]];
export const key = (q,r) => `${q},${r}`;
export const CELLS = [];
for(let q=-RADIUS;q<=RADIUS;q++) for(let r=-RADIUS;r<=RADIUS;r++) if(Math.abs(q+r)<=RADIUS) CELLS.push([q,r]);
const CELLSET = new Set(CELLS.map(([q,r])=>key(q,r)));
export const hexToPixel = (q,r,size=24) => ({x:1.5*size*q,y:Math.sqrt(3)*size*(r+q/2)});
export function pixelToHex(x,y,size=24){
  const qf=2*x/(3*size),rf=(-x/3+Math.sqrt(3)*y/3)/size,sf=-qf-rf;
  let q=Math.round(qf),r=Math.round(rf),s=Math.round(sf);
  const dq=Math.abs(q-qf),dr=Math.abs(r-rf),ds=Math.abs(s-sf);
  if(dq>dr&&dq>ds)q=-r-s;else if(dr>ds)r=-q-s;
  return {q,r};
}
const copy = value => structuredClone(value);
export class Game {
  constructor(seed=17027){this.seed=seed;this.reset();}
  reset(){
    this.rng=this.seed;this.score=0;this.moves=0;this.over=false;this.pending=[];this.last=null;
    this.tools={swap:3,deal:3};this.towers=Array.from({length:3},()=>({fill:0,target:12,level:1}));
    this.board=new Map();
    for(const [q,r,c] of [[-2,0,0],[-2,1,0],[-1,-1,0],[1,-2,1],[2,-2,1],[1,-1,1],[0,1,2],[1,1,2],[0,2,2]]) this.board.set(key(q,r),{q,r,c,v:1});
    this.tray=[{cells:[{dq:0,dr:0,c:0},{dq:0,dr:1,c:0}]},{cells:[{dq:0,dr:0,c:1},{dq:1,dr:0,c:1},{dq:0,dr:1,c:1}]},{cells:[{dq:0,dr:0,c:2},{dq:-1,dr:1,c:2}]}];
  }
  random(){this.rng=(Math.imul(this.rng,1664525)+1013904223)>>>0;return this.rng/4294967296;}
  randomPiece(){
    const shape=SHAPES[Math.floor(this.random()*SHAPES.length)],color=Math.floor(this.random()*3),mixed=this.random()<.24;
    return {cells:shape.map(([dq,dr])=>({dq,dr,c:mixed?Math.floor(this.random()*3):color}))};
  }
  group(q,r,board=this.board){
    const first=board.get(key(q,r));if(!first)return [];
    const seen=new Set([key(q,r)]),stack=[first],out=[];
    while(stack.length){const tile=stack.pop();out.push(tile);for(const [dq,dr] of DIRECTIONS){const k=key(tile.q+dq,tile.r+dr),next=board.get(k);if(next&&next.c===first.c&&!seen.has(k)){seen.add(k);stack.push(next);}}}
    return out;
  }
  mergeGroup(q,r,c,board=this.board){
    const joined=new Map();for(const [dq,dr] of DIRECTIONS){const tile=board.get(key(q+dq,r+dr));if(tile?.c===c)for(const t of this.group(tile.q,tile.r,board))joined.set(key(t.q,t.r),t);}
    return [...joined.values()];
  }
  canPlace(piece,q,r){
    if(!piece)return false;
    if(!piece.cells.every(t=>CELLSET.has(key(q+t.dq,r+t.dr))&&!this.board.has(key(q+t.dq,r+t.dr))))return false;
    return !piece.merge||this.mergeGroup(q,r,piece.cells[0].c).length>0;
  }
  preview(piece,q,r){
    if(!this.canPlace(piece,q,r))return null;
    if(piece.merge){const cells=this.mergeGroup(q,r,piece.cells[0].c);return {groups:[{c:piece.cells[0].c,cells,worth:cells.reduce((s,t)=>s+t.v,0)}],gained:cells.reduce((s,t)=>s+t.v,0)};}
    const board=new Map(this.board),added=piece.cells.map(t=>({q:q+t.dq,r:r+t.dr,c:t.c,v:1}));
    for(const t of added)board.set(key(t.q,t.r),t);
    const seen=new Set(),groups=[];
    for(const t of added){if(seen.has(key(t.q,t.r)))continue;const cells=this.group(t.q,t.r,board);for(const tile of cells)seen.add(key(tile.q,tile.r));if(cells.length>1)groups.push({c:t.c,cells,worth:cells.reduce((sum,tile)=>sum+tile.v,0)});}
    return {groups,gained:groups.reduce((s,g)=>s+g.worth,0)};
  }
  snapshot(){return copy({board:[...this.board],tray:this.tray,towers:this.towers,score:this.score,moves:this.moves,pending:this.pending,tools:this.tools,rng:this.rng,over:this.over});}
  restore(s){const saved=copy(s);this.board=new Map(saved.board);for(const name of ['tray','towers','score','moves','pending','tools','rng','over'])this[name]=saved[name];}
  credit(color,amount,rewards){
    const tower=this.towers[color];tower.fill+=amount;
    while(tower.fill>=tower.target){tower.fill-=tower.target;tower.level++;tower.target=12+(tower.level-1)*8;const bonus={merge:true,cells:[{dq:0,dr:0,c:color}]};this.pending.push(bonus);rewards.push({c:color,level:tower.level});this.tools.swap=Math.min(9,this.tools.swap+1);}
  }
  replace(slot){
    if(this.pending.length){this.tray[slot]=this.pending.shift();return;}
    let p=this.randomPiece();
    if(!this.tray.some((t,i)=>i!==slot&&this.fits(t))&&!this.fits(p)){
      for(let i=0;i<30&&!this.fits(p);i++)p=this.randomPiece();
      if(!this.fits(p)&&this.board.size<61)p={cells:[{dq:0,dr:0,c:Math.floor(this.random()*3)}]};
    }
    this.tray[slot]=p;
  }
  fits(piece){return !!piece&&CELLS.some(([q,r])=>this.canPlace(piece,q,r));}
  anyMove(){return this.tray.some(p=>this.fits(p));}
  place(slot,q,r){
    if(this.over)return null;
    const piece=this.tray[slot],preview=this.preview(piece,q,r);if(!preview)return null;
    this.last=this.snapshot();const consumed=piece.merge?preview.groups.flatMap(g=>g.cells):[];
    if(piece.merge)for(const t of consumed)this.board.delete(key(t.q,t.r));
    const placed=piece.cells.map(t=>({q:q+t.dq,r:r+t.dr,c:t.c,v:piece.merge?Math.max(1,preview.gained):1,merged:!!piece.merge}));
    for(const t of placed)this.board.set(key(t.q,t.r),t);
    this.moves++;this.score+=preview.gained;const rewards=[];
    for(const group of preview.groups)this.credit(group.c,group.worth,rewards);
    this.tray[slot]=null;this.replace(slot);this.over=!this.anyMove();
    return {...preview,placed,consumed,rewards,merge:!!piece.merge,slot,over:this.over};
  }
  undo(){if(!this.last)return false;this.restore(this.last);this.last=null;return true;}
  swapColors(){
    if(this.over||this.tools.swap<=0)return false;
    const pieces=this.tray.filter(p=>!p.merge);if(!pieces.length)return false;
    this.last=this.snapshot();this.tools.swap--;
    for(const p of pieces)for(const t of p.cells)t.c=(t.c+1)%3;
    this.over=!this.anyMove();return true;
  }
  deal(){
    if(this.over||this.tools.deal<=0||this.tray.every(p=>p.merge))return false;
    this.last=this.snapshot();this.tools.deal--;
    for(let i=0;i<3;i++)if(!this.tray[i].merge)this.replace(i);
    this.over=!this.anyMove();return true;
  }
}
