const createJiraTicket = (id: string, title: string, reportText: string, files: Array<File>, author: string) => {
  const username = "";
  const jiraToken = "";

  fetch("https://stamped.atlassian.net/rest/api/3/issue", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Basic " + window.btoa(username + ":" + jiraToken)
    },
    body: JSON.stringify({
      "fields": {
        "summary": title,
        "issuetype": {
          "id": "10015"
        },
        "project": {
          "key": "WILD"
        },
        "description": {
          "type": "doc",
          "version": 1,
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "text": reportText
                },
              ],
            },
          ],
        },
      }
    }),
  })
  .then((res) => {
    console.log(res);
    res.json().then((data) => {
      console.log(data);
      files.forEach((file) => {
        const request = new XMLHttpRequest();
        const formData = new FormData();
        request.open("POST", "https://stamped.atlassian.net/rest/api/3/issue/" + data.key + "/attachments", true);
        request.setRequestHeader("X-Atlassian-Token", "no-check");
        request.setRequestHeader("Authorization", "Basic " + window.btoa(username + ":" + jiraToken));
        request.onreadystatechange = () => {
          if (request.readyState === 4 && request.status === 200) { }
        };
        formData.append("file", file);
        request.send(formData);
        console.log(request, formData)
      });
    });
  });
}

export { createJiraTicket };