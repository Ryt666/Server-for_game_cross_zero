class DrawingContext extends EventEmitter {
  constructor({ canvas }) {
    super();

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  startLoop() {
    const self = this;
    function drawCallback() {
      self.clear();
      self.emit('draw');
      requestAnimationFrame(drawCallback);
    }
    drawCallback();
  }

  clear() {
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  lines(lines) {
    this.ctx.beginPath();
    for (const line of lines) {
      this.ctx.moveTo(line.x1, line.y1);
      this.ctx.lineTo(line.x2, line.y2);
    }
    this.ctx.stroke();
  }

  drawImage(image, x, y, width, height) {
    this.ctx.drawImage(image, x, y, width, height);
  }

  drawText(text, x, y) {
    this.ctx.fillStyle = '#000';
    this.ctx.font = '32px serif';
    this.ctx.fillText(text, x, y);
  }
}