const callback = (details: any) => {
  // console.log(details);
  // let key = details.requestId;

  // chrome.storage.local.set({ key: details }, () => {
  //   if (chrome.runtime.lastError) {
  //     console.error(
  //       "Error setting " + key + " to " + JSON.stringify(details) +
  //       ": " + chrome.runtime.lastError.message
  //     );
  //   }
  // });

  // // Getting
  // chrome.storage.local.get(key, (data) => {
  //   console.log("data")
  // });
};

chrome.runtime.onInstalled.addListener(callback);

let filter = { urls: ["https://app.stamped.ai/**"] };
let opt_extraInfoSpec: string[] = [];

chrome.tabs.query({ url: "https://app.stamped.ai/**" }, (tabs) => {
  chrome.webRequest.onResponseStarted.addListener(callback, filter, opt_extraInfoSpec);
});