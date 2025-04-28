import { TacView } from "./src/TacView.js";

const canvas = document.getElementById('world');
const heading = document.getElementById('viewportPosition')
canvas.style.cursor = 'grab';
const entitiesUL = document.getElementById('entityList');

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

const tacview = new TacView(canvas, heading, entitiesUL, boxes);

