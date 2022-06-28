const draw = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
  document.oncontextmenu = function () {
    return false;
  };

  // list of all strokes drawn
  const drawings: any[] = [];

  // coordinates of our cursor
  let cursorX;
  let cursorY;
  let prevCursorX: number;
  let prevCursorY: number;

  // distance from origin
  let offsetX = 0;
  let offsetY = 0;

  // zoom amount
  let scale = 1;

  // convert coordinates
  function toScreenX(xTrue: number) {
    return (xTrue + offsetX) * scale;
  }
  function toScreenY(yTrue: number) {
    return (yTrue + offsetY) * scale;
  }
  function toTrueX(xScreen: number) {
    return xScreen / scale - offsetX;
  }
  function toTrueY(yScreen: number) {
    return yScreen / scale - offsetY;
  }

  function redrawCanvas() {
    // set the canvas to the size of the window
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < drawings.length; i++) {
      const line = drawings[i];
      drawLine(
        toScreenX(line.x0),
        toScreenY(line.y0),
        toScreenX(line.x1),
        toScreenY(line.y1)
      );
    }
  }
  redrawCanvas();

  // if the window changes size, redraw the canvas
  window.addEventListener("resize", (event) => {
    redrawCanvas();
  });

  // Mouse Event Handlers
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mouseup", onMouseUp, false);
  canvas.addEventListener("mouseout", onMouseUp, false);
  canvas.addEventListener("mousemove", onMouseMove, false);

  // mouse functions
  let leftMouseDown = false;
  function onMouseDown(event: MouseEvent) {
    // detect left clicks
    if (event.button == 0) {
      leftMouseDown = true;
    }
    // detect right clicks
    if (event.button == 2) {
      leftMouseDown = false;
    }

    // update the cursor coordinates
    cursorX = event.pageX;
    cursorY = event.pageY;
    prevCursorX = event.pageX;
    prevCursorY = event.pageY;
  }
  function onMouseMove(event: MouseEvent) {
    // get mouse position
    cursorX = event.pageX;
    cursorY = event.pageY;
    console.log(cursorX, cursorY);
    const scaledX = toTrueX(cursorX);
    const scaledY = toTrueY(cursorY);
    const prevScaledX = toTrueX(prevCursorX);
    const prevScaledY = toTrueY(prevCursorY);

    if (leftMouseDown) {
      // add the line to our drawing history
      drawings.push({
        x0: prevScaledX,
        y0: prevScaledY,
        x1: scaledX,
        y1: scaledY,
      });
      // draw a line
      drawLine(prevCursorX, prevCursorY, cursorX, cursorY);
    }
    prevCursorX = cursorX;
    prevCursorY = cursorY;
  }
  function onMouseUp() {
    leftMouseDown = false;
  }
  function drawLine(x0: number, y0: number, x1: number, y1: number) {
    console.log(x0, y0, x1, y1);
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = "#000";
    context.lineWidth = 2;
    context.stroke();
  }
}

export { draw };