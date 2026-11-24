import {createOriginalEngine} from './original-engine.mjs';

// The current PixiJS view talks to the saved game's original core through this facade.
// No replacement dealer, scoring algorithm, audio synthesizer or payout scheduler.
export class Game {
  constructor(options={}){this.engine=createOriginalEngine(options);}
  get board(){return this.engine.board;}get tray(){return this.engine.tray;}
  get score(){return this.engine.score;}get displayedScore(){return this.engine.displayedScore;}
  get towers(){return this.engine.towers;}get displayedTowers(){return this.engine.displayedTowers;}
  get tools(){return this.engine.tools;}get last(){return this.engine.undoSnapshot;}
  get over(){return this.engine.state==='over';}get state(){return this.engine.state;}
  get best(){return this.engine.best;}get goal(){return this.engine.goal;}
  reset(){this.engine.reset();}update(dt){this.engine.update(dt);}
  canPlace(...args){return this.engine.canPlace(...args);}
  preview(...args){return this.engine.preview(...args);}
  fits(...args){return this.engine.fits(...args);}
  undo(){return this.engine.useTool('undo');}
  swapColors(){return this.engine.useTool('swap');}
  deal(){return this.engine.useTool('deal');}
}
