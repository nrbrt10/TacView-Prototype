import { Position, CanvasPosition } from "./Position.js";

export class Viewport {
  constructor(canvasWidth, canvasHeight) {
    this.position = new CanvasPosition();
    this.entityToTrack = null;
    this.panningTracker = new CanvasPosition();
    this.canvasDim = {width: canvasWidth, height: canvasHeight};
  }

  trackEntity() {
    if (!this.entityToTrack) return;
    
    const {canvasX, canvasY} = this.entityToTrack.position.toCanvas();
    const newX = canvasX - this.canvasDim.width / 2;
    const newY = canvasY - this.canvasDim.height / 2;

    this.position.setPosition(newX, newY);
  }

  panViewport(clientX, clientY) {
    const {x, y} = this.panningTracker.getPosition();
    
    const dx = x - clientX;
    const dy = y - clientY;

    this.position.applyDelta(dx, dy);
    this.panningTracker.setPosition(clientX, clientY);
  }

  setPan(newX, newY) {
    this.panningTracker.setPosition(newX, newY);
  }

  zoomViewport(deltaY) {
    const zoomMultiplier = 0.001;
    const oldScale = Position.scale;
    Position.scale -= (deltaY - deltaY % 100) * zoomMultiplier; 
    Position.scale = Math.max(0.1, Math.min(Position.scale, 5));
  }
}

export function createViewportAPI(viewportInstance) {
  return {
    position: viewportInstance.position,
    getEntityToTrack: () => viewportInstance.entityToTrack,
    setEntityToTrack: (entity) => viewportInstance.entityToTrack = entity
  };
}