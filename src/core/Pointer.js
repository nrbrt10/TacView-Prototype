import { Position, CanvasPosition } from "./Position.js";

export class Pointer {
    constructor() {
      this.position = new CanvasPosition();
      this.lastPosition = new CanvasPosition();
    }

    getLastPosition() {
       return this.lastPosition.renameReturnObject(this.position.getPosition, {xKey: 'lastPosX', yKey: 'lastPosY'});
    }
  }