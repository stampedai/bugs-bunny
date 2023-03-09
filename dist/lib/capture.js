var capture = (function (exports) {
    'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    const captureScreen = () => __awaiter(void 0, void 0, void 0, function* () {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        let image = new Image();
        let aspectRatio = 0;
        const imageData = yield new Promise((resolve, reject) => {
            chrome.tabs.captureVisibleTab(null, { format: "png", quality: 100 }).then((data) => {
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
        document.getElementById("screenshot").appendChild(canvas);
        document.getElementById("pen").classList.toggle("hidden");
        document.getElementById("highlight").classList.toggle("hidden");
        document.getElementById("marker").classList.toggle("hidden");
        document.getElementById("text").classList.toggle("hidden");
        return imageData;
    });

    exports.captureScreen = captureScreen;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
