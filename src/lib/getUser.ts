const getUser: any = async () => {
  let user: any;
  return new Promise((resolve, reject) => {
    chrome.identity.getProfileUserInfo({ 'accountStatus': 'ANY' as chrome.identity.AccountStatus }, (info) => {
      const { email, id } = info;
      user = { email, id };
      return chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        const url = tabs[0].url;
        user.url = url;
        resolve(user);
      });
    });
  });
};

export { getUser };