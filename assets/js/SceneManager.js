class SceneManager {
  currentScene = null;

  constructor({ DrawingContext, InputManager }) {
    this.drawingContext = DrawingContext;
    this.inputManager = InputManager;
  }

  start() {
    this.drawingContext.startLoop();
    this.inputManager.start();
  }

  async loadScene(scene) {
    if (this.currentScene) {
      this.currentScene.pause();
    }

    await scene.loading();

    this.currentScene = scene;

    await scene.start();
    this.drawingContext.on('draw', () => scene.draw())

    this.inputManager.on('click', (event, params) => scene.click(params));

    scene.draw();
  }
}