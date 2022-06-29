var annotate = (function (exports) {
    'use strict';

    const annotateWithText = (canvas, context) => {
        window.addEventListener("keydown", (event) => {
            if (event.key === "t") {
                document.body.style.cursor = "text";
                window.addEventListener("click", (event) => {
                    const text = prompt("Add an annotation");
                    if (text) {
                        context.font = "bold 16px Arial";
                        context.fillText(text, event.clientX, event.clientY);
                        document.body.style.cursor = "default";
                    }
                });
            }
        });
    };

    exports.annotateWithText = annotateWithText;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
