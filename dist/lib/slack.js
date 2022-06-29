var slack = (function (exports) {
    'use strict';

    const notifySlack = (reportText, file, author) => {
        fetch("https://hooks.slack.com/workflows/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", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                timestamp: new Date().toISOString(),
                report: reportText,
                actionTrace: "Action trace",
                author
            }),
        })
            .then((res) => {
            console.log(res);
        })
            .catch((err) => {
            console.log(err);
            alert(err);
        });
        fetch("https://slack.com/api/files.upload", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer xoxb-282480151991-3749989176401-YGAFNsat4NE8pCIRPGssUjEd`,
            },
            body: JSON.stringify({
                // channels: "C02UNUD9USK",
                channels: "C9XK6B3L1",
                file,
                title: "Attached file",
            }),
        });
    };

    exports.notifySlack = notifySlack;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
