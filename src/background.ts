// console.log(chrome.identity.getAuthToken({ 'interactive': true }, (cb) => cb));
// const getUser: any = () => chrome.identity.getProfileUserInfo(callback) as any;
// console.log(getUser());
const getUser = () => "";

let filter = { urls: ["https://app.stamped.ai/**"] };
let opt_extraInfoSpec: string[] = [];

const callback = (details: any) => {
  if (details) {
    console.log(details)
    const errorRegex = /^4|^5/;
    const { statusCode } = details;
    if (errorRegex.test(statusCode)) {
      console.log("error!")
    } else {
      console.log("no error!")
    }
  }
};

chrome.runtime.onInstalled.addListener(callback);
chrome.webRequest.onResponseStarted.addListener(
  callback,
  filter,
  opt_extraInfoSpec
);

export { getUser };