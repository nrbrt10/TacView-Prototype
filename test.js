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

const TestInterface = {
  pos: {x: 0, y: 0},
  method1() {
    throw new Error('method1 not implmeneted')
  }
};

class testI {
  constructor() {
    Object.assign(this, TestInterface);
  }
  showPos() {
    console.log(this.pos);
  }
}

class Coord1 {
  constructor() {
    this.a1 = 1;
    this.a2 = 2;
  }

  getXY() {
    return {a1: this.x, a2: this.y};
  }

  remapReturn(func, keys = {x: 'someX', y: 'someY'}) {
    const boundFunc = func.bind(this);
    const {x, y} = boundFunc();
    return {
      [keys.x]: x,
      [keys.y]: y
    }

  }
}

const x = 1135.21385
console.log((Math.floor(x / 200) * 200 + 200))