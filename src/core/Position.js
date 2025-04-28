export class Position {
    static _scale = 1;
    
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }
  
    static set scale(newScale) {
      this._scale = newScale;
    }
  
    static get scale() {
      return this._scale;
    }
  
    getPosition() {
      return {x: this.x, y: this.y};
    }
  
    setPosition(newX, newY) {
      this.x = newX;
      this.y = newY;
    }
  
    applyDelta(dx = 0, dy = 0) {
      /* 
      @param {float} dx - delta on x;
      @param {float} dy - delta on y;
      */
      this.x += dx;
      this.y += dy;
    }

    renameReturnObject(func, nameKeys = { xKey: 'newX', yKey: 'newY'}) {
      const boundFunc = func.bind(this);
      const {x, y} = boundFunc();
      return {
        [nameKeys.xKey]: x,
        [nameKeys.yKey]: y
      }
    }
  
    offset(x = 0, y = 0) {
      return {offsetX: this.x + x, offsetY: this.y + y};
    }
  
    toWorld() {{
      throw new Error("Method toWorld() not implmented.");
    }}
  
    toCanvas() {{
      throw new Error("Method toCanvas() not implmented.");
    }}
  }
  
  export class WorldPosition extends Position {
    toCanvas() {
      return {canvasX: this.x * Position.scale, canvasY: this.y * Position.scale};
    }
    
    offsetToCanvas(x = 0, y = 0) {
      return {offsetX: (this.x + x) * Position.scale, offsetY: (this.y + y) * Position.scale};
    }
  }
  
  export class CanvasPosition extends Position {
    toWorld() {
      return {worldX: this.x / Position.scale, worldY: this.y / Position.scale};
    }
  
    offsetToWorld(x = 0, y = 0) {
      return {offsetX: (this.x + x) / Position.scale, offsetY: (this.y + y) / Position.scale};
    }
  }