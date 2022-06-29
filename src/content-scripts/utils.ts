const util = () => {
  console.log(chrome.identity.getProfileUserInfo(cb => cb))
}

export { util }
