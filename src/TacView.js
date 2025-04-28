import { EntityManager } from './core/Entity.js';
import { Viewport } from './core/Viewport.js';
import { Pointer } from './core/Pointer.js';
import { Renderer } from './core/Renderer.js';
import { UI } from './ui/UI.js';

export class TacView {
    constructor(canvas, heading, entitiesUL, entities) {
      this.renderer = new Renderer(canvas);
      this.viewport = new Viewport(canvas.width, canvas.height);
      this.pointer = new Pointer();
      this.entityManager = new EntityManager(entities);
      this.ui = new UI(this.viewport, this.entityManager, heading, entitiesUL);
  
      this.update = this.update.bind(this);
      this.init();
    }
  
    init() {
      this.entityManager.entitiesFromArray()
      this.renderer.setDependencies(this.viewport, this.pointer, this.entityManager.entities)
      this.renderer.setListeners();
      this.ui.setListeners();
  
      console.log('Init Completed')
      requestAnimationFrame(this.update);
    }
  
    update() {
      this.entityManager.updateEntities();
      this.ui.updateUI()
      this.renderer.draw();
  
      requestAnimationFrame(this.update);
    }
  }