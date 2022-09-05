var slack = (function (exports) {
    'use strict';

    const notifySlack = (reportText, files, author) => {
        const channel = "";
        fetch("", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                timestamp: new Date().toISOString(),
                report: reportText,
                actionTrace: "Action trace",
                author: author,
            }),
        })
            .then((res) => {
            files.forEach((file) => {
                const request = new XMLHttpRequest();
                const formData = new FormData();
                request.open("POST", "https://slack.com/api/files.upload", true);
                request.onreadystatechange = () => {
                    if (request.readyState === 4 && request.status === 200) ;
                };
                formData.append("token", "");
                formData.append("file", file);
                formData.append("channels", channel);
                request.send(formData);
            });
        })
            .catch((err) => {
            alert(err);
        });
    };

    exports.notifySlack = notifySlack;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
