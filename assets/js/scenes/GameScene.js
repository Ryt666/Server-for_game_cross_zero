const CELL_EMPTY = 0;
const CELL_X = 1;
const CELL_O = 2;
const CELL_TIE = 3;
const CELL_SIZE = 150;

const FILENAME_X = 'images/x.gif';
const FILENAME_O = 'images/o.gif';

const SERVER_URL = 'http://localhost:8080';

class GameScene extends Scene {
  cells = [
    [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
    [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
    [CELL_EMPTY, CELL_EMPTY, CELL_EMPTY],
  ];

  gameId = null;

  turnKey = null;

  isActiveGame = true;

  wonSide = null;

  state = null;

  constructor({ DrawingContext, ResourceManager }) {
    super();
    
    this.drawingContext = DrawingContext;
    this.resourceManager = ResourceManager;
  }

  async loading() {

    await this.resourceManager.loadImages([
      FILENAME_X,
      FILENAME_O
    ]);

    const url = new URL(window.location);
    let serverUrl = 'http://localhost:8080';
    if (url.searchParams.has('gameId')) {
      serverUrl += `/?gameId=${url.searchParams.get('gameId')}`;
    }
    const source = new EventSource(serverUrl);
    source.onmessage = ({ lastEventId, data }) => {
      if (!this.gameId) {
        url.searchParams.set('gameId', lastEventId);
        window.history.pushState({ gameId: lastEventId }, '', url);
      }
      this.gameId = lastEventId;
      const { cells, isActiveGame, turnKey, wonSide, state } = JSON.parse(data);
      this.cells = cells;
      this.isActiveGame = isActiveGame;
      this.turnKey = turnKey;
      this.wonSide = wonSide;
      this.state = state;
     
    }
  }

  draw() {
    const CELL_PADDING = 30;

    this.drawingContext.lines([
      { x1: CELL_SIZE, y1: 0, x2: CELL_SIZE, y2: CELL_SIZE * 3 },
      { x1: CELL_SIZE * 2, y1: 0, x2: CELL_SIZE * 2, y2: CELL_SIZE * 3 },
      { x1: 0, y1: CELL_SIZE, x2: CELL_SIZE * 3, y2: CELL_SIZE },
      { x1: 0, y1: CELL_SIZE * 2, x2: CELL_SIZE * 3, y2: CELL_SIZE * 2 }
    ]);

    for (const rowIndex in this.cells) {
      const row = this.cells[rowIndex];
      for (const cellIndex in row) {
        const cell = row[cellIndex];
        if (cell === CELL_EMPTY) {
          continue;
        }
        if (cell === CELL_X) {
          this.drawingContext.drawImage(
            this.resourceManager.get(FILENAME_X),
            cellIndex * CELL_SIZE + CELL_PADDING,
            rowIndex * CELL_SIZE + CELL_PADDING,
            CELL_SIZE - CELL_PADDING * 2,
            CELL_SIZE - CELL_PADDING * 2
          );
        } else {
          this.drawingContext.drawImage(
            this.resourceManager.get(FILENAME_O),
            cellIndex * CELL_SIZE + CELL_PADDING,
            rowIndex * CELL_SIZE + CELL_PADDING,
            CELL_SIZE - CELL_PADDING * 2,
            CELL_SIZE - CELL_PADDING * 2
          );
        }
      }
    }

    if (this.wonSide) {
      let text = 'Ничья';
      switch (this.wonSide) {
      case CELL_X: text = 'Выиграли Крестики'; break;
      case CELL_O: text = 'Выиграли Нолики'; break;
      }
      this.drawingContext.drawText(text, 0, CELL_SIZE * 3 + 20);
    } else {
      this.drawingContext.drawText((this.turnKey) ? 'Ваш черед хода' : 'Ожидайте хода соперника', 0, CELL_SIZE * 3 + 20);
    }
  }

  click({ x, y }) {
    const cellIndex = Math.ceil(x / CELL_SIZE);
    const rowIndex = Math.ceil(y / CELL_SIZE);
    if (!this.isActiveGame) {
      return;
    }
    if (cellIndex > 3 || rowIndex > 3) {
      return;
    }
    const cellState = this.cells[rowIndex - 1][cellIndex - 1];
    if (cellState !== CELL_EMPTY || !this.turnKey) {
      return;
    }
   
    fetch(SERVER_URL, {
      method: 'POST',
      body: JSON.stringify({
        row: rowIndex - 1,
        cell: cellIndex - 1,
        gameId: this.gameId,
        turnKey: this.turnKey
      })
    });
  }
}