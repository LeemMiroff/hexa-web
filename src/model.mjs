export {Game} from './original-game.mjs';
export const RADIUS=4;
export const DIRECTIONS=[[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]];
export const SHAPES=[
  [[0,0]],[[0,0],[1,0]],[[0,0],[0,1]],[[0,0],[-1,1]],
  [[0,0],[1,0],[2,0]],[[0,0],[0,1],[0,2]],[[0,0],[-1,1],[-2,2]],
  [[0,0],[1,0],[0,1]],[[0,0],[1,0],[1,-1]],[[0,0],[0,1],[-1,1]],[[0,0],[1,0],[-1,1]]
];
export const key=(q,r)=>q+','+r;
export const CELLS=[];
for(let q=-RADIUS;q<=RADIUS;q++)for(let r=-RADIUS;r<=RADIUS;r++)if(Math.abs(q+r)<=RADIUS)CELLS.push([q,r]);
export const hexToPixel=(q,r,size=24)=>({x:1.5*size*q,y:Math.sqrt(3)*size*(r+q/2)});
export function pixelToHex(x,y,size=24){
  const qf=2*x/(3*size),rf=(-x/3+Math.sqrt(3)*y/3)/size,sf=-qf-rf;
  let q=Math.round(qf),r=Math.round(rf),s=Math.round(sf);
  const dq=Math.abs(q-qf),dr=Math.abs(r-rf),ds=Math.abs(s-sf);
  if(dq>dr&&dq>ds)q=-r-s;else if(dr>ds)r=-q-s;
  return {q,r};
}