import { createViewportAPI } from '../core/Viewport.js';
import { createEntityManagerAPI } from '../core/Entity.js';
import { Position } from '../core/Position.js';

export class UI {
    constructor(viewport, entityManager, headingElement, entityListElement) {
      this.viewportAPI = viewport;
      this.entityManagerAPI = entityManager;
      this.headingElement = headingElement;
      this.entityListElement = entityListElement;
      this.listedEntities = new Map();
    }
  
    updateHeading() {
      const {worldX, worldY} = this.viewportAPI.position.toWorld();
      this.headingElement.textContent = `Viewport positon: ${worldX.toFixed(4)}: ${worldY.toFixed(4)} ; Viewport size: ${(500 / Position.scale).toFixed(4)} x ${(300 / Position.scale).toFixed(4)}`
    }
  
    populateEntityUL() {
      if(this.entityListElement.childElementCount === 0) {
        this.entityManagerAPI.entitiesMap.forEach((entity, id) => {
          const li = document.createElement('li');
          li.style.cursor = 'pointer';
          li.addEventListener('click', () => {
            this.viewportAPI.setEntityToTrack(entity);
          });
          this.entityListElement.appendChild(li);
          this.listedEntities.set(id, li);
        });
      }
      this.entityManagerAPI.entitiesMap.forEach((entity, id) => {
        const {x, y} = entity.position.getPosition();
          this.listedEntities.get(id).textContent = `${id}: ${x.toFixed(4)}, ${y.toFixed(4)}`;
      });
    }
  
    setListeners() {
      document.addEventListener('keydown', (e) => {
        switch(e.key) {
          case 'Enter':
            this.entityManagerAPI.toggleEntityMovement();
            break;
        }
      });
    }
  
    updateUI() {
      this.updateHeading();
      this.populateEntityUL();
    }
  }