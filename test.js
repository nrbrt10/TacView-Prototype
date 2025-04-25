const boxes = [
    redBox = {
      color: 'red',
      initial_pos: {x: 500, y: 500},
      movementFn: {x: 1, y: -.3}
    },
    blueBox = {
      color: 'blue',
      initial_pos: {x: 100, y: 200},
      movementFn: {x: .5, y: 1}
    },
    greenBox = {
      color: 'green',
      initial_pos: {x: 1, y: 450},
      movementFn: {x: 2, y: -1}
    },
    purpleBox = {
      color: 'purple',
      initial_pos: {x: 800, y: 23},
      movementFn: {x: 2, y: -2}
    }
  ]

//boxes.forEach((box) => {
//    console.log(box)
//})

function testObj({x, y}){
  return {x, y}
}

const {x , y} = testObj({x: 1, y: 2});
console.log(x , y)

class Cursor {
  constructor() {
    this.positon = {x: 0, y: 0};
  }

  setPosition({x, y}) {
    this.positon = {x, y}
  }
}

cursor = new Cursor();
cursor.setPosition({x:1, y:5})
console.log(cursor.positon)