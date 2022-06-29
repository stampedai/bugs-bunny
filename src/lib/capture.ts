const captureScreen = () => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  chrome.tabs.captureVisibleTab(null, { format: "png" }).then((data: any) => {
    canvas.width = 800;
    canvas.height = 500;
    const image = new Image();
    if (window.devicePixelRatio > 1) {
      context.scale(1 / window.devicePixelRatio, 1 / window.devicePixelRatio);
    }
    image.src = data;
    image.onload = () => {
      setTimeout(() => {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      }, 50);
    };
    document.getElementById("screenshot")!.appendChild(canvas);
  });

  return { canvas, context };
};

export { captureScreen };