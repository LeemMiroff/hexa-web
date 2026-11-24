// Named themes preserve previous experiments. Switch this key to try one.
export const ACTIVE_VISUAL_THEME='classic';
const names=['red','yellow','blue'];
const flatTiles=names.map(name=>`assets/hex-${name}-test-flat-256.png`);
const flatColors=['#f45b5f','#f2b867','#86beb3'];
export const VISUAL_THEMES={
  'violet-cream-test':{
    id:'violet-cream-test',background:'#211d30',cell:'#191623',muted:'#b9b7a0',
    light:'#efeec0',tileInk:'#211d30',markInk:'#211d30',colors:flatColors,
    board:'assets/board-violet-cream-flat@2x.png',tiles:flatTiles,
    introCells:[0,1,2].map(()=> 'assets/board-cell-violet-cream-flat@2x.png'),
  },
  'warm-flat-test':{
    id:'warm-flat-test',background:'#2d2328',cell:'#44363d',muted:'#b6a4ab',
    light:'#f6f1e7',tileInk:'#ffffff',markInk:'#272034',colors:flatColors,
    board:'assets/board-test-flat@2x.png',tiles:flatTiles,
    introCells:[0,1,2].map(()=> 'assets/board-cell-test-flat@2x.png'),
  },
  pearl:{
    id:'pearl',background:'#e9eef8',cell:'#dce3ef',muted:'#7f88a8',light:'#505b80',tileInk:'#ffffff',markInk:'#505b80',colors:['#f38e80','#66c9bd','#ab85e4'],
    board:'assets/board-pearl@2x.png',tiles:names.map(name=>`assets/hex-${name}-pearl-256.png`),
    introCells:[0,1,2].map(()=> 'assets/board-cell-pearl@2x.png'),
  },
  monochrome:{
    id:'monochrome',background:'#000000',cell:'#161616',muted:'#a6a6a6',light:'#f4f4f4',tileInk:'#111111',markInk:'#f4f4f4',colors:['#f0f0f0','#999999','#3c3c3c'],
    board:'assets/board-monochrome@2x.png',tiles:names.map(name=>`assets/hex-${name}-monochrome-256.png`),
    introCells:[0,1,2].map(()=> 'assets/board-cell-monochrome@2x.png'),
  },
  classic:{
    id:'classic',background:'#231e32',cell:null,muted:'#b1a0bf',
    light:'#f6f1e7',tileInk:'#ffffff',markInk:'#272034',colors:['#f45d68','#f5c367','#79b9dc'],
    board:'assets/board-minimal@2x.png',
    tiles:names.map(name=>`assets/hex-${name}-cloud-256.png`),
    introCells:[0,1,2].map(c=>`assets/board-cell-${c}@2x.png`),
  },
};
export const VISUAL_THEME=VISUAL_THEMES[ACTIVE_VISUAL_THEME];

// Only these two themes are exposed by the temporary toolbar toggle.
export function getNextTheme(theme){
  return VISUAL_THEMES[theme.id==='warm-flat-test'?'classic':'warm-flat-test'];
}

export function getEngineTheme(theme){
  const {colors,background,muted,light,tileInk}=theme;
  return {colors,background,muted,light,tileInk};
}
