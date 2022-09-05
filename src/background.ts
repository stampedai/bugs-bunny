let filter: any = { urls: ["https://*.stamped.ai/*"], types: ["xmlhttprequest"] };

const callback = (details: any) => {
  if (details) {
    let queryOptions = { active: true, lastFocusedWindow: true };
    chrome.tabs.query(queryOptions).then((tabs) => {
      let tab = tabs[0];
      if (tab) {
        const errorRegex = /^4|^5/;
        const { statusCode } = details;
        if (tab.url.match(/https:\/\/*.stamped.ai\/*$/) && errorRegex.test(statusCode)) {
          if (errorRegex.test(statusCode)) {
            console.log("error!")
          } else {
            console.log("no error!")
          }
        }
      };
    });
  }
};

chrome.action.onClicked.addListener(callback);
chrome.runtime.onInstalled.addListener(callback);
chrome.webNavigation.onCompleted.addListener(
  callback,
  filter
);
chrome.webRequest.onHeadersReceived.addListener(
  callback,
  filter,
)