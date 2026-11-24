// Shared logical coordinates for Pixi, the DOM HUD and the original FX canvas.
export const SCENE_WIDTH = 420;
export const TRAY_SLOTS = [100, 210, 320];
export const DRAG_SETTINGS = Object.freeze({ minLift: 100, maxLift: 300, liftDistance: 235, horizontalFactor: 1.5, tapDuration: 100 });

export function calculateLayout(width, height, top, bottom, board) {
  if(width>=1024&&width/(height-top-bottom)>=1.35)return desktopLayout(width,height,top,bottom,board);
  const scale = width / SCENE_WIDTH;
  const sceneHeight = (height - top - bottom) / scale;
  const compact = Math.max(0, Math.min(1, (840 - sceneHeight) / 100));
  const scoreY = 12, scoreSize = 44 - 4 * compact;
  const toolsY = sceneHeight - 58,scoreLineY=84;
  const trayBottom = sceneHeight;
  const trayHalfHeight = 55, trayGap = 28;
  const availableBoardHeight = trayBottom - 2 * (trayHalfHeight + trayGap) - scoreLineY;
  const boardWidth = Math.min(412, Math.max(80, availableBoardHeight * board.logicalWidth / board.logicalHeight));
  const boardHeight = boardWidth * board.logicalHeight / board.logicalWidth;
  // Solve both centers together: board is halfway from score line to tray,
  // while tray remains halfway from board's lower edge to screen bottom.
  const centerY=(2*scoreLineY+boardHeight/2+trayBottom)/3;
  const boardTop=centerY-boardHeight/2,boardBottom=centerY+boardHeight/2;
  const trayY=2*centerY-scoreLineY;
  const meterY=(scoreLineY+boardTop)/2,chargeY=meterY-10.8;
  return {
    mode: 'mobile', width: SCENE_WIDTH, height: sceneHeight, scale, top,
    size: board.latticeRadius * boardWidth / board.logicalWidth,
    centerX: SCENE_WIDTH / 2, centerY,
    boardWidth, boardHeight, boardBottom,
    trayY, trayRatio: .7 - .06 * compact,
    slots: TRAY_SLOTS, chargeY, toolsY, scoreTop: scoreY, scoreSize,
    scoreY:40,goalY:84,
    scoreX:210,goalX:210,trayHalfWidth:50,trayHalfHeight:55,
    trayPositions:TRAY_SLOTS.map(x=>[x,trayY]),
    meterPositions:TRAY_SLOTS.map(x=>[x,meterY]),
    toolPositions:[[210,boardBottom-38],[368,boardBottom-38],[52,boardBottom-38]],
  };
}

function desktopLayout(width,height,top,bottom,board){
  const available=height-top-bottom,scale=Math.min(1,available/1080,width/1600);
  const w=width/scale,h=available/scale;
  const boardHeight=Math.min(h-180,(w-650)*board.logicalHeight/board.logicalWidth,820);
  const boardWidth=boardHeight*board.logicalWidth/board.logicalHeight;
  const centerX=w/2,centerY=h/2+8;
  const scoreX=centerX-boardWidth/2-200,trayX=centerX+boardWidth/2+220;
  const scoreTop=centerY-274,scoreSize=76,toolsY=centerY+373;
  const trayPositions=[-225,-5,215].map(offset=>[trayX,centerY+offset]);
  return {
    mode:'desktop',width:w,height:h,scale,top,
    size:board.latticeRadius*boardWidth/board.logicalWidth,
    centerX,centerY,boardWidth,boardHeight,boardBottom:centerY+boardHeight/2,
    trayY:centerY,trayRatio:.7,trayHalfWidth:70,trayHalfHeight:75,
    slots:trayPositions.map(p=>p[0]),trayPositions,
    meterPositions:[-50,50,150].map(offset=>[scoreX,centerY+offset+3]),
    toolPositions:[[trayX,centerY+boardHeight/2-38],[trayX+55,centerY+boardHeight/2-38],[trayX-55,centerY+boardHeight/2-38]],
    scoreX,scoreTop,scoreSize,scoreY:scoreTop+38,
    goalX:scoreX,goalY:scoreTop+90,chargeY:centerY-50,toolsY,
  };
}

