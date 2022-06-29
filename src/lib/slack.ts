const notifySlack = (reportText: string, file: File, author: string) => {
  const channel = "";
  const request = new XMLHttpRequest();
  const formData = new FormData();

  request.open("POST", "https://slack.com/api/files.upload", true);

  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
      console.log(request.responseText);
    }
  };

  formData.append("token", "");
  formData.append("file", file);
  formData.append("channels", channel);

  fetch(
    "",
    {
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
    }
  )
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
      alert(err);
    });
  request.send(formData);
}

export { notifySlack };