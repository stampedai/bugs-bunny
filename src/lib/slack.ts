import { env } from "process";

const notifySlack = (title: string, reportText: string, files: Array<File>, author: string, currentPageURL: string) => {
  let id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const channel = ""
  fetch(
    "",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title + " ->",
        timestamp: `${new Date().toISOString()} - jiraTrigger`,
        report: reportText,
        actionTrace: "Action trace",
        author: author,
        id: id,
        url: currentPageURL,
      }),
    }
  )
  .then((res) => {
    files.forEach((file) => {
      const request = new XMLHttpRequest();
      const formData = new FormData();
      request.open("POST", "https://slack.com/api/files.upload", true);

      request.onreadystatechange = () => {
        if (request.readyState === 4 && request.status === 200) { }
      };

      formData.append("token", "");
      formData.append("file", file);
      formData.append("channels", channel);
      formData.append("initial_comment", id);
      request.send(formData);
    });
  })
  .catch((err) => {
    alert(err);
  });
}

export { notifySlack };