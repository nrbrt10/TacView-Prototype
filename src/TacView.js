import { EntityManager, createEntityManagerAPI } from './sim-frontend/core/Entity.js';
import { InteractionManager } from './sim-frontend/core/InteractionManager.js';
import { StateManager } from './sim-frontend/core/StateManager.js';
import { Viewport, createViewportAPI } from './sim-frontend/core/Viewport.js';
import { Pointer } from './sim-frontend/core/Pointer.js';
import { Renderer } from './sim-frontend/core/Renderer.js';
import { UI } from './sim-frontend/ui/UI.js';

export class TacView {
    constructor(canvas, heading, entitiesUL, entities) {
      this.state = new StateManager();
      this.pointer = new Pointer();
      this.entityManager = new EntityManager(entities);
      this.viewport = new Viewport(canvas.width, canvas.height);
      this.renderer = new Renderer(canvas);
      this.integration = new InteractionManager(this.state, canvas, this.viewport, this.pointer);
      this.ui = new UI(createViewportAPI(this.viewport), createEntityManagerAPI(this.entityManager), heading, entitiesUL);
  
      this.update = this.update.bind(this);
      this.init();
    }
  
    init() {
      console.log('Initializing...')
      // this.entityManager.entitiesFromArray()
      this.renderer.setDependencies(this.viewport, this.pointer, this.entityManager.entities)
      console.log('Renderer dependencies set.')
      // this.renderer.setListeners();
      this.integration.attachListeners();
      console.log('Integration listeners attached.')
      this.ui.setListeners();
      console.log('UI listeners attached.')
  
      console.log('Init Completed. Requesting animation frame.')
      requestAnimationFrame(this.update);
    }
  
    update() {
      this.entityManager.updateEntities();
      this.ui.updateUI()
      this.integration.updatePointer();
      this.renderer.draw();
  
      requestAnimationFrame(this.update);
    }
  }