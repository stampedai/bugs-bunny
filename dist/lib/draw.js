var draw = (function (exports) {
    'use strict';

    const draw = (canvas, context) => {
        // coordinates of cursor
        let cursorX;
        let cursorY;
        let prevCursorX;
        let prevCursorY;
        const drawLine = (x0, y0, x1, y1) => {
            context.beginPath();
            context.moveTo(x0, y0);
            context.lineTo(x1, y1);
            context.strokeStyle = "red";
            context.lineWidth = 2;
            context.stroke();
        };
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
            if (leftMouseDown) {
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
