const captureScreen = async () => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  let image = new Image();
  let aspectRatio = 0;

  const imageData = await new Promise((resolve, reject) => {
    chrome.tabs.captureVisibleTab(null, { format: "png", quality: 100 }).then((data: any) => {
      image.src = data;

      image.onload = () => {
        aspectRatio = image.width / image.height;

        canvas.width = 800;
        canvas.height = 800 / aspectRatio;

        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        resolve({ canvas, context, image, aspectRatio });
      };

      image.onerror = reject;
    }).catch(reject);
  });

  document.getElementById("screenshot")!.appendChild(canvas);
  document.getElementById("pen")!.classList.toggle("hidden");
  document.getElementById("highlight")!.classList.toggle("hidden");
  document.getElementById("marker")!.classList.toggle("hidden");
  document.getElementById("text")!.classList.toggle("hidden");

  return imageData;
};


export { captureScreen };