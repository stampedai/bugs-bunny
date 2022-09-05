const draw = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, strokeStyle: string, drawings: any[]) => {
  if (strokeStyle == "highlight") {
    context.strokeStyle = "rgba(255, 255, 0, 0.1)";
    context.lineWidth = 10
  } else if (strokeStyle == "marker") {
    context.strokeStyle = "red";
    context.lineWidth = 2;
  } else {
    context.strokeStyle = "black";
    context.lineWidth = 1;
  }

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
  const toTrueX = (xScreen: number) => xScreen / scale - offsetX;
  const toTrueY = (yScreen: number) => yScreen / scale - offsetY;

  const drawLine = (x0: number, y0: number, x1: number, y1: number) => {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
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

    // once the mouse is released, add { cutoff: true } to the last element in the drawings array
    if (leftMouseDown) {
      drawings.push({
        x0: prevScaledX,
        y0: prevScaledY,
        x1: scaledX,
        y1: scaledY,
        strokeStyle,
      });
      drawLine(prevCursorX, prevCursorY, cursorX, cursorY);
    } else {
      if (drawings.length > 0 && !drawings[drawings.length - 1].cutoff) {
        drawings[drawings.length - 1].cutoff = true;
      }
    }

    prevCursorX = cursorX;
    prevCursorY = cursorY;
  }

  function onMouseUp() {
    leftMouseDown = false;
  }
}

const restoreDrawings = (context: CanvasRenderingContext2D, drawings: any[]) => {
  drawings.forEach((drawing) => {
    let strokeStyle = drawing.strokeStyle;
    if (strokeStyle == "highlight") {
      context.strokeStyle = "rgba(255, 255, 0, 0.1)";
      context.lineWidth = 10;
    } else if (strokeStyle == "marker") {
      context.strokeStyle = "red";
      context.lineWidth = 2;
    } else if (strokeStyle == "pen") {
      context.strokeStyle = "black";
      context.lineWidth = 1;
    }
    context.beginPath();
    context.moveTo(drawing.x0, drawing.y0);
    context.lineTo(drawing.x1, drawing.y1);
    context.stroke();
  });
}

export { draw, restoreDrawings };