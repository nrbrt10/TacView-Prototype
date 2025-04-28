import { Position, WorldPosition } from "./Position.js";

export class Entity {
    constructor(color, position, movement) {
      this.color = color;
      this.movement = movement;
  
      const {x ,y} = position;
      this.position = new WorldPosition(x, y);
  
      this.isMoving = false;
    }
  
    toggleMovement() {
      this.isMoving = !this.isMoving
    }
  
    move() {
      const {dx, dy} = this.movement;
      this.position.applyDelta(dx, dy);
    }
  }
  
  export class EntityManager {
    constructor(entityArray) {
      this.entities = new Map();
      this.entityArray = entityArray;
    }
  
    entitiesFromArray() {
      this.entityArray.forEach(element => {
        const entity = new Entity(element.color, element.initial_pos, element.movementFn);
        this.entities.set(element.color, entity);
      });
    }
  
    toggleEntityMovement(id = null) {
      if (id) {
        this.getEntity(id).toggleMovemet();
      } else {
        this.entities.forEach((entity, id) => {
          entity.toggleMovement();
        });
      }
    }
  
    moveEntities() {
      this.entities.forEach((entity, id) => {
        entity.move()
      });
    }
  
    getEntity(entityName) {
      try {
        return this.entities.get(entityName);
      }
      catch {
        throw new Error(`${entityName} is not defined.`)
      }
    }
  
    updateEntities() {
      this.moveEntities();
    }
  }

export function createEntityManagerAPI(entityManagerInstance) {
  return {
    entitiesMap: entityManagerInstance.entities,
    toggleEntityMovement: entityManagerInstance.toggleEntityMovement.bind(entityManagerInstance)
  }
}