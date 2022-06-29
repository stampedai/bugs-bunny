const annotateWithText = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
  window.addEventListener("keydown", (event) => {
    if (event.key === "t") {
      document.body.style.cursor = "text";

      window.addEventListener("click", (event) => {
        const text = prompt("Add an annotation");

        if (text) {
          context.font = "12px Arial";
          context.fillStyle = "black";
          context.fillText(text, event.clientX, event.clientY);
          document.body.style.cursor = "default";
        }
      });
    }
  });
};

export { annotateWithText };