import { CanvasPosition } from "./Position.js";

export class Pointer {
    constructor() {
      this.position = new CanvasPosition();
      this.lastPosition = new CanvasPosition();
    }

    getLastPosition() {
      return this.lastPosition.renameReturnObject(this.lastPosition.getPosition, {xKey: 'lastPosX', yKey: 'lastPosY'});
    }

    updatePosition(viewportX, viewportY, clientX, clientY) {
      if (clientX !== null && clientY !== null) {
        this.lastPosition.setPosition(clientX, clientY);
      }

      const {lastPosX, lastPosY} = this.getLastPosition();
      this.position.setPosition(viewportX + lastPosX, viewportY + lastPosY);
    }
  }

export function createPointerAPI(PointerIntance) {
  return {
    position: PointerIntance.position,
    lastPosition: PointerIntance.lastPosition,
    getLastPosition: PointerIntance.getLastPosition.bind(PointerIntance)
  }
}