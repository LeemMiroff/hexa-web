// Both renderers share these assets. Keep loading/cache separate from the scene.
export function createThemeAssetLoader(assets){
  const cache=new Map();
  async function loadImage(src){
    const image=new Image();image.src=src;await image.decode();return image;
  }
  return function loadThemeAssets(theme){
    if(!cache.has(theme.id)){
      const loading=Promise.all([
        assets.load(theme.board),
        Promise.all(theme.tiles.map(src=>assets.load({src,data:{autoGenerateMipmaps:true,scaleMode:'linear'}}))),
        Promise.all(theme.introCells.map(src=>assets.load(src))),
        Promise.all(theme.tiles.map(loadImage)),
        Promise.all(theme.tiles.map(src=>assets.load({src:src.replace(/\.png$/,'-shadow.png'),data:{autoGenerateMipmaps:true,scaleMode:'linear'}}))),
        assets.load('assets/board-shadow@2x.png'),
        Promise.all(['hex','capsule','dot'].map(async shape=>[shape,await Promise.all([0,1,2,3].map(c=>loadImage(`assets/particles/${theme.id}-${shape}-${c}.png`)))])),
      ]).then(([board,tiles,introCells,images,shadowTiles,boardShadow,particles])=>({textures:{board,tiles,introCells,shadowTiles,boardShadow},tileImages:images,particleImages:Object.fromEntries(particles)}));
      cache.set(theme.id,loading);
      // Failed downloads may be retried on the next click.
      loading.catch(()=>cache.delete(theme.id));
    }
    return cache.get(theme.id);
  };
}
