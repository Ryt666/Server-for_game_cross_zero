const CELL_EMPTY = 0;
const CELL_X = 1;
const CELL_O = 2;
const CELL_TIE = 3;

let globalId = 0;
let globalKeyId = 1;

export default
class Game {
  players = {
    [CELL_X]: null,
    [CELL_O]: null
  };

  cells = [
    [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
    [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
    [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
  ];

  winStates = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

  isActiveGame = true;
  wonSide = null;

  constructor() {
    this.id = globalId++;
    this.state = CELL_X;
    this.turnKey = globalKeyId++;
  }

  join(callback) {
    if (this.players[CELL_X]) {
      this.players[CELL_O] = callback;
      callback(CELL_O);
    } else {
      this.players[CELL_X] = callback;
      callback(CELL_X);
    }
  }

  getStatus(statusFor) {
    return {
      cells: this.cells,
      isActiveGame: this.isActiveGame,
      turnKey: this.state === statusFor ? this.turnKey : null,
      wonSide: this.wonSide,
      state: this.state,
    };
  }

  sendStatus() {
    if (this.players[CELL_X]) {
      this.players[CELL_X](CELL_X);
    }
    if (this.players[CELL_O]) {
      this.players[CELL_O](CELL_O);
    }
  }

  click(rowIndex, cellIndex) {
    if (!this.isActiveGame) {
      return;
    }
    const cellState = this.cells[rowIndex][cellIndex];
    if (cellState !== CELL_EMPTY) {
      return;
    }
    this.cells[rowIndex][cellIndex] = this.state;
    this.state = (this.state === CELL_X) ? CELL_O : CELL_X;
    this.turnKey = globalKeyId++;

    this.checkWinState();
    this.sendStatus();
  }

  checkWinState() {
    const arr = this.cells.reduce((arr, item) => arr.concat(item), []);

    for (const [c1, c2, c3] of this.winStates) {
      if (arr[c1] === arr[c2] && arr[c2] === arr[c3] && arr[c1] === arr[c3] && arr[c1] !== CELL_EMPTY) {
        this.isActiveGame = false;
        this.wonSide = arr[c1];
        return;
      }
    }
    if (!arr.includes(CELL_EMPTY)) {
      this.isActiveGame = false;
      this.wonSide = CELL_TIE;
    }
  }
}