import { Position, CanvasPosition } from "./Position.js";

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.position = new CanvasPosition();
    
    this.isDragging = false;
  }

  setDependencies(viewport, pointer, entities) {
    this.viewport = viewport;
    this.pointer = pointer;
    this.entities = entities;
  }

  setListeners() {
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.viewport.entityToTrack = null;
      this.canvas.style.cursor = 'grabbing';
      this.viewport.setPan(e.clientX, e.clientY);
    })
    
    this.canvas.addEventListener('mousemove', (e) => {
      this.updatePointer(e.clientX, e.clientY);
      if (this.isDragging) {
        this.viewport.panViewport(e.clientX, e.clientY);
      } else {
        this.canvas.style.cursor = 'grab';
      }
    });
    
    this.canvas.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.canvas.style.cursor = 'grab';
    });
    
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.canvas.style.cursor = e.deltaY > 0 ? 'zoom-out' : 'zoom-in';
      this.viewport.zoomViewport(e.deltaY, e.clientX, e.clientY);
    });
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
  }

  updateViewport() {
    if (this.viewport.entityToTrack) {
      this.viewport.trackEntity();
    }
    const {x, y} = this.viewport.position.getPosition();
    this.ctx.translate(-x, -y);
  }

  updatePointer(clientX = null, clientY = null) {
    if (clientX && clientY) {
      this.pointer.lastPosition.setPosition(clientX, clientY);
    }
    const {x, y} = this.viewport.position.getPosition();
    const {lastPosX, lastPosY} = this.pointer.getLastPosition();

    this.pointer.position.setPosition(x + lastPosX, y + lastPosY);
  }

  drawEntities() {
    const scaledSize = Math.max(2, 10 * Position.scale);
    const scaledFont = Math.min(12, Math.max(6, 6 * Position.scale));
    this.entities.forEach((entity, id) => {
      this.drawEntity(entity, scaledSize, scaledFont);
    });
  }

  drawEntity(entity, scaledSize, scaledFont) {
    const {canvasX, canvasY} = entity.position.toCanvas();
    const {x, y} = entity.position.getPosition();
    const {offsetX, offsetY} = entity.position.offsetToCanvas(10);
    
    this.ctx.fillStyle = entity.color;
    this.ctx.fillRect(canvasX, canvasY, scaledSize, scaledSize)
    
    this.ctx.font = `${scaledFont}px Arial`;
    this.ctx.fillText(`(${x.toFixed(1)}, ${y.toFixed(1)})`, offsetX, offsetY); 
  }

  drawWorld() {
     this.ctx.strokeStyle = '#ccc';
     const {x, y} = this.viewport.position.getPosition();
     const gridToScale = 200 * Position.scale;
     for (let iX = (Math.floor(x / gridToScale) * gridToScale + gridToScale); iX <= x + this.canvas.width; iX += gridToScale) {
      this.ctx.beginPath();
      this.ctx.moveTo(iX, y)
      this.ctx.lineTo(iX, y + this.canvas.height);
      this.ctx.stroke();
     }

     for (let iY = (Math.floor(y / gridToScale) * gridToScale + gridToScale); iY <= y + this.canvas.width; iY += gridToScale) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, iY)
      this.ctx.lineTo(x + this.canvas.width, iY);
      this.ctx.stroke();
     }

  }

  drawHUD() {
    const {offsetX, offsetY} = this.viewport.position.offset(440, 295);
    this.ctx.font = "8px Arial";
    this.ctx.fillText(`Zoom: ${(Position.scale * 100).toFixed(2)}%`, offsetX, offsetY);
  
    const {worldX, worldY} = this.pointer.position.toWorld();
    const {x, y} = this.pointer.position.getPosition();

    this.ctx.font = '8px Arial';
    this.ctx.fillText(`(${worldX.toFixed(2)}, ${worldY.toFixed(2)})`, x, y)
  }

  restoreCanvas() {
    this.ctx.restore();
  }

  draw() {
    this.clearCanvas();
    this.updateViewport();
    this.drawWorld();
    this.drawEntities();
    this.drawHUD();
    this.restoreCanvas();
  }
}