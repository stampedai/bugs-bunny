var draw = (function (exports) {
    'use strict';

    const draw = (canvas, context) => {
        // list of all strokes
        const drawings = [];
        // coordinates of cursor
        let cursorX;
        let cursorY;
        let prevCursorX;
        let prevCursorY;
        // distance from origin
        let offsetX = 0;
        let offsetY = 0;
        let scale = 1;
        // convert coordinates
        const toScreenX = (xTrue) => (xTrue + offsetX) * scale;
        const toScreenY = (yTrue) => (yTrue + offsetY) * scale;
        const toTrueX = (xScreen) => xScreen / scale - offsetX;
        const toTrueY = (yScreen) => yScreen / scale - offsetY;
        const drawLine = (x0, y0, x1, y1) => {
            context.beginPath();
            context.moveTo(x0, y0);
            context.lineTo(x1, y1);
            context.strokeStyle = "#000";
            context.lineWidth = 2;
            context.stroke();
        };
        // listen for a ctrl-z event
        window.addEventListener("keydown", (event) => {
            console.log("ctrl-z hello?");
            drawings.pop();
            drawings.forEach((line) => {
                drawLine(toScreenX(line.x0), toScreenY(line.y0), toScreenX(line.x1), toScreenY(line.y1));
            });
        });
        // Mouse Event Handlers
        canvas.addEventListener("mousedown", onMouseDown);
        canvas.addEventListener("mouseup", onMouseUp, false);
        canvas.addEventListener("mouseout", onMouseUp, false);
        canvas.addEventListener("mousemove", onMouseMove, false);
        // mouse functions
        let leftMouseDown = false;
        function onMouseDown(event) {
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
        function onMouseMove(event) {
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
    };

    exports.draw = draw;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
