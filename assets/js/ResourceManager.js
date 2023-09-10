const RESOURCE_PATH = '/assets';

class ResourceManager {
  resources = {};

  get(imageName) {
    return this.resources[imageName];
  }

  loadImages(images) {
    return Promise.all(images.map(this.loadImage.bind(this)));
  }

  loadImage(image) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.resources[image] = img;
        resolve(img);
      };
      img.src = `${RESOURCE_PATH}/${image}`;
    });
  }
}