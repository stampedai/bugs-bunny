const captureScreen = () => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  let image = new Image();

  chrome.tabs.captureVisibleTab(null, { format: "png" }).then((data: any) => {
    canvas.width = 800;
    canvas.height = 395;
    image.src = data;
    image.onload = () => {
      setTimeout(() => {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      }, 50);
    };
    document.getElementById("screenshot")!.appendChild(canvas);
    document.getElementById("pen")!.classList.toggle("hidden");
    document.getElementById("highlight")!.classList.toggle("hidden");
    document.getElementById("marker")!.classList.toggle("hidden");
    document.getElementById("text")!.classList.toggle("hidden");
  });

  return { canvas, context, image };
};

export { captureScreen };