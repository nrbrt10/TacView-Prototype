const canvas = document.getElementById('world');
const heading = document.getElementById('viewportPos')
canvas.style.cursor = 'grab';
const boxList = document.getElementById('boxList');
const ctx = canvas.getContext('2d');

const boxObjects = new Map();
const boxListElements = new Map();
const boxPositions = new Map();

let scale = 1;

const viewport = {
  x: 0,
  y: 0
};

const cursor = {
  CanvasX: 0,
  CanvasY: 0,
  WorldX: 0,
  WorldY: 0
}

const boxes = [
  {
    color: 'red',
    initial_pos: {x: 500, y: 500},
    movementFn: {x: .1, y: -.3}
  },
  {
    color: 'blue',
    initial_pos: {x: 100, y: 200},
    movementFn: {x: .5, y: .1}
  },
  {
    color: 'green',
    initial_pos: {x: 1, y: 450},
    movementFn: {x: .2, y: -.1}
  },
  {
    color: 'purple',
    initial_pos: {x: 800, y: 23},
    movementFn: {x: .2, y: -.2}
  }
]

let currentlyTracking = null;
let isDragging = null;

class MovingBox {
  constructor(color, position, movement) {
    this.color = color;
    this.position = position;
    this.movement = movement;
    this.isTracking = false;
    this.isMoving = false;
  }

  toggleTracking() {
    this.isTracking = !this.isTracking;
  }

  toggleMovement() {
    this.isMoving = !this.isMoving;
  }

  moveBox() {
    this.position.x += this.movement.x;
    this.position.y += this.movement.y;
  }

  draw(ctx) {
    if (this.isMoving){
      this.moveBox();
    }
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x * scale, this.position.y * scale, Math.max(.8, 10 * scale), Math.max(.8, 10 * scale))
    ctx.font = "6px Arial";
    ctx.fillText(`(${this.position.x.toFixed(1)}, ${this.position.y.toFixed(1)})`, (this.position.x + 10) * scale, (this.position.y) * scale);
  }
}

//#region Viewport
class Viewport {
  constructor(){
    this.scale = 1;
    this.x = 0;
    this.y = 0;
    this.pan = {x: 0, y: 0};
    this.trackingEntity = null;
  };

  screenToWorld(ScreenX, ScreenY){
    return {
    x: (ScreenX + this.x) / this.scale,
    y: (ScreenY + this.y) / this.scale
    };
  };

  worldToScreen({WorldX, WorldY}) {
    return {
      x: WorldX * this.scale - this.x,
      y: WorldY * this.scale - this.y
    };
  };

  trackEntity() {
    if (!trackingEntity) return;
  
    const {screenX , screenY} = this.worldToScreen(trackingEntity.position);   
    this.x = screenX - this.canvasDim.width / 2;
    this.y = screenY - this.canvasDim.height / 2;
  };

  panViewport(clientX, clientY) {
    const dx = this.pan.x - clientX;
    const dy = this.pan.y - clientY;
  
    this.x += dx;
    this.y += dy;
  
    this.pan.x = clientX;
    this.pan.y = clientY;
  };

  zoomViewport(deltaY, clientX, clientY) {
    const zoomMultiplier = 0.001;
    const oldScale = this.scale;
    this.scale -= deltaY * zoomMultiplier; 
    this.scale = Math.max(0.001, Math.min(scale, 5));

    this.x = this.screenToWorld({});
  }

  setPan(x, y) {
    this.pan = {x ,y};
  }

  setTrackingEntity(entity) {
    this.trackingEntity = entity;
  }

  setCanvasDimensions({width, height}) {
    this.canvasDim = {width, height};
  }
}
//#endregion Viewport

//#region CanvasManager
class CanvasManager {
  constructor(canvas, viewport, pointer, entitymanager) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d');
    this.viewport = viewport;
    this.pointer = pointer;
    this.entitymanager = entitymanager;

    this.isDragging = false;
  }

  setupListeners() {
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.viewport.setTrackingEntity(null);
      this.viewport.setPan({x: e.clientX, y: e.clientY});
      this.canvas.style.cursor = 'grabbing';
    });

    this.canvas.addEventListener('mousemove', (e) => {
      this.pointer.setPosition({x: e.clientX, y: e.clientY});
      if (!this.isDragging) return;
      this.viewport.panViewport(e.clientX, e.clientY);
    });

    this.canvas.addEventListener('mouseup', (e) => {
      this.isDragging = false;
      this.canvas.style.cursor = 'grab';
    })

    this.canvas.addEventListener('wheel', (e) => {
      this.canvas.style.cursor = e.deltaY > 0 ? 'zoom-out': 'zoom-in';
      e.preventDefault();
      this.viewport.zoomViewport(e.deltaY);
    })


  }
}
//#endregion CanvasManager

class Entity {
  constructor(color, position, movement) {
    this.color = color;
    this.position = position;
    this.movement = movement;
    this.isTracking = false;
    this.isMoving = false;
  }

  toggleMovement() {
    this.isMoving = !this.isMoving;
  }

  move() {
    this.position.x += this.movement.x;
    this.position.y += this.movement.y;
  }

  draw(ctx) {
    if (this.isMoving){
      this.move();
    }
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x * scale, this.position.y * scale, Math.max(.8, 10 * scale), Math.max(.8, 10 * scale))
    ctx.font = "6px Arial";
    ctx.fillText(`(${this.position.x.toFixed(1)}, ${this.position.y.toFixed(1)})`, (this.position.x + 10) * scale, (this.position.y) * scale);
  }
}

class WorldEntities {
  constructor() {
    this.entities = new Map();
  }

  createEntities(entityList) {
    entityList.forEach()
  }
}

//#region Pointer
class Pointer {
  constructor() {
    this.positon = {x: 0, y: 0};
  }

  setPosition({x, y}) {
    this.positon = {x, y}
  }
}
//#endregion Pointer

//#region TacView
class TacView {
  constructor(canvasmanager, viewport, pointer, entitymanager) {
    this.canvasmanager = canvasmanager;
    this.viewport = viewport;
    this.pointer = pointer;
    this.entitymanager = entitymanager;
  }

  init() {
    const c = this.canvasmanager.canvas;
    this.viewport.setCanvasDimensions({width:c.width, height:c.height});
  }

  update() {

  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);
  ctx.save();

  trackBox();
  ctx.translate(-viewport.x, -viewport.y)

  boxObjects.forEach((value, key) => {
    value.draw(ctx)
  });

  ctx.font = "8px Arial";
  ctx.fillText(`Zoom: ${(scale * 100).toFixed(2)}%`, viewport.x + 440, viewport.y + 295);

  ctx.font = '8px Arial';
  ctx.fillText(`(${cursor.WorldX.toFixed(2)}, ${cursor.WorldX.toFixed(2)})`, cursor.CanvasX, cursor.CanvasY)

  ctx.restore();
}

function populateText() {
  heading.textContent = `Viewport position: ${(viewport.x / scale).toFixed(4)}: ${(viewport.y / scale).toFixed(4)}`

  if (boxList.childElementCount === 0) {
    boxObjects.forEach((value, key) => {
      const li = document.createElement('li');
      li.style.cursor = 'pointer'
      li.addEventListener('click', () => {
        console.log(`Tracking ${key}.`)
        currentlyTracking = value;
        
      });
      boxList.appendChild(li);
      boxListElements.set(key, li);
    });
  }

  boxObjects.forEach((value, key) => {
    const position = value.position;
    boxListElements.get(key).textContent = `${key}: ${position.x.toFixed(4)}, ${position.y.toFixed(4)}`;
  });
}

function trackBox() {
  if (!currentlyTracking) return;
  
  const box = currentlyTracking;
  viewport.x = box.position.x * scale - canvas.width / 2;
  viewport.y = box.position.y * scale - canvas.height / 2;
}

function moveBoxes() {
  boxObjects.forEach((value, key) => {
    value.isMoving = !value.isMoving;
  })
}

function init() {
  boxes.forEach(element => {
    const box = new MovingBox(element.color, element.initial_pos, element.movementFn);
    boxObjects.set(element.color, box);
  });

  requestAnimationFrame(update);
}

function update() {
  populateText();
  draw();
  requestAnimationFrame(update);
}

canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  currentlyTracking = false;
  canvas.style.cursor = 'grabbing';

  panningX = e.clientX;
  panningY = e.clientY;
})

canvas.addEventListener('mousemove', (e) => {
  updateCursorPos(e)
  if (isDragging) {
  panViewport(e);
  }
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
  canvas.style.cursor = 'grab';
})

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const zoomMultiplier = 0.001;
  const oldScale = scale;
  scale -= e.deltaY * zoomMultiplier; 
  scale = Math.max(0.001, Math.min(scale, 5));

  //const mouseX = e.clientX * scale - canvas.getBoundingClientRect().left;
  //const mouseY = e.clientY * scale - canvas.getBoundingClientRect().top;
//
  //const worldX = (mouseX + viewport.x) / oldScale;
  //const worldY = (mouseY + viewport.y) / oldScale;
//
  //viewport.x = worldX * scale - mouseX;
  //viewport.y = worldY * scale - mouseY;
  updateCursorPos();
  viewport.x = e.clientX * scale - canvas.width / 2;
  viewport.y = e.clientY * scale - canvas.height / 2;
})

function hashPosition(x, y) {
  const roundPos = (val) => val.toFixed(4);
  return `${roundPos(x)},${roundPos(y)}`;
}

// Pan with arrow keys
document.addEventListener('keydown', (e) => {
  const speed = 10;
  switch (e.key) {
    case 'ArrowRight': viewport.x += speed; break;
    case 'ArrowLeft':  viewport.x -= speed; break;
    case 'ArrowDown':  viewport.y += speed; break;
    case 'ArrowUp':    viewport.y -= speed; break;
    case 'Enter' :     moveBoxes(); break;
    case 'Escape' :    currentlyTracking = null; break;
  }
});

init();