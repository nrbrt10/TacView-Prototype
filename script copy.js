const canvas = document.getElementById('world');
const heading = document.getElementById('viewportPos')
canvas.style.cursor = 'grab';
const boxList = document.getElementById('boxList');
const ctx = canvas.getContext('2d');

const boxObjects = new Map();
const boxListElements = new Map();

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

  positionToMap() {
    const position = this.position;
    boxPositions.set(hashPosition(position.x, position.y), this);
  }

  draw(ctx) {
    if (this.isMoving){
      this.moveBox();
    }
    ctx.fillStyle = this.color;
    const scaledSize = Math.max(2, 10 * scale);
    const scaledFont = Math.min(12, Math.max(6, 6 * scale));
    ctx.fillRect(this.position.x * scale, this.position.y * scale, scaledSize, scaledSize)

    ctx.font = `${scaledFont}px Arial`;
    ctx.fillText(`(${this.position.x.toFixed(1)}, ${this.position.y.toFixed(1)})`, (this.position.x + 10) * scale, (this.position.y) * scale);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  trackBox();
  ctx.translate(-viewport.x, -viewport.y)

  boxObjects.forEach((value, key) => {
    value.draw(ctx)
  });

  ctx.font = "8px Arial";
  ctx.fillText(`Zoom: ${(scale * 100).toFixed(2)}%`, viewport.x + 440, viewport.y + 295);

  ctx.font = '8px Arial';
  ctx.fillText(`(${cursor.WorldX.toFixed(2)}, ${cursor.WorldY.toFixed(2)})`, cursor.CanvasX, cursor.CanvasY)

  ctx.restore();
}

function populateText() {
  heading.textContent = `Viewport position: ${(viewport.x / scale).toFixed(4)}: ${(viewport.y / scale).toFixed(4)}, ${(viewport.x)}: ${(viewport.y)}`

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
    boxListElements.get(key).textContent = `${key}: ${position.x.toFixed(4)}, ${position.y.toFixed(4)}, ${position.x * scale}, ${position.y * scale}`;
  });
}

let panningX;
let panningY;

function panViewport(e) {
  const dx = panningX - e.clientX;
  const dy = panningY - e.clientY;

  viewport.x += dx;
  viewport.y += dy;

  panningX = e.clientX;
  panningY = e.clientY;
}

function updateCursorPos(e = null) {
  if (e) {
    cursor.lastPosX = e.clientX;
    cursor.lastPoxY = e.clientY;
  }

  cursor.CanvasX = viewport.x + cursor.lastPosX;
  cursor.CanvasY = viewport.y + cursor.lastPoxY;
  
  cursor.WorldX = cursor.CanvasX / scale;
  cursor.WorldY = cursor.CanvasY / scale;
}

function trackBox() {
  if (!currentlyTracking) return;
  
  const box = currentlyTracking;
  centerViewportOn(box.position.x * scale, box.position.y * scale);
  updateCursorPos();
}

function zoomViewport(e) {
  const zoomMultiplier = 0.001;
  const oldScale = scale
  scale -= (e.deltaY - e.deltaY % 100) * zoomMultiplier; 
  scale = Math.max(0.1, Math.min(scale, 5));
  
  if (currentlyTracking) return;
  centerViewportOn(cursor.CanvasX / oldScale, cursor.CanvasY / oldScale);
}

function centerViewportOn(x, y) {
  viewport.x = x - canvas.width / 2;
  viewport.y = y - canvas.height / 2;
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
  updateCursorPos(e);
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
  canvas.style.cursor = e.deltaY > 0 ? 'zoom-out' : 'zoom-in';
  zoomViewport(e);
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