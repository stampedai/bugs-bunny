const draw = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
  // list of all strokes
  const drawings: any[] = [];

  // coordinates of cursor
  let cursorX;
  let cursorY;
  let prevCursorX: number;
  let prevCursorY: number;

  // distance from origin
  let offsetX = 0;
  let offsetY = 0;

  let scale = 1;

  // convert coordinates
  const toScreenX = (xTrue: number) => (xTrue + offsetX) * scale;
  const toScreenY = (yTrue: number) => (yTrue + offsetY) * scale;
  const toTrueX = (xScreen: number) => xScreen / scale - offsetX;
  const toTrueY = (yScreen: number) => yScreen / scale - offsetY;

  const drawLine = (x0: number, y0: number, x1: number, y1: number) => {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = "red";
    context.lineWidth = 2;
    context.stroke();
  }

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
}

export { draw };