const annotateWithText = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, annotations: any[]) => {
  let annotationState: boolean = false;
  document.body.style.cursor = "text";

  setTimeout(() => {
    onclick = (event: MouseEvent) => {
      let text: string;

      if (!annotationState && document.body.style.cursor == "text") {
        let input = document.createElement("input");
        input.style.width = "auto";
        input.style.height = "auto";
        input.style.border = "1px dotted rgb(255, 215, 0)";
        input.style.position = "absolute";
        input.style.left = event.pageX + "px";
        input.style.top = event.pageY + "px";
        input.style.backgroundColor = "transparent";

        annotationState = true;
        canvas.parentNode!.appendChild(input);
        input.addEventListener("keydown", (e) => {
          if (e.key == "Enter") {
            input.remove()
          }
          let target: any = e.target
          text = target.value;
          if (text) {
            context.font = "12px Arial";
            context.fillStyle = "rgb(255, 215, 0)";
            context.fillRect(event.clientX, event.clientY - 12, context.measureText(text).width, 12);
            context.fillStyle = "black";
            context.fillText(text, event.clientX, event.clientY);
            annotations.push({
              type: "text",
              text: text,
              x: event.clientX,
              y: event.clientY,
              width: context.measureText(text).width,
              height: 12
            });
            document.body.style.cursor = "default";
          }
        });
      }
    };
  }, 100);
};

const restoreAnnotations = (context: CanvasRenderingContext2D, annotations: any[]) => {
  annotations.forEach((annotation: any) => {
    if (annotation.type == "text") {
      context.font = "12px Arial";
      context.fillStyle = "rgb(255, 215, 0)";
      context.fillRect(annotation.x, annotation.y - 12, annotation.width, 12);
      context.fillStyle = "black";
      context.fillText(annotation.text, annotation.x, annotation.y);
    }
  });
};

export { annotateWithText, restoreAnnotations };