const getUser: any = async () => {
  let user;
  return new Promise((resolve, reject) => {
    chrome.identity.getProfileUserInfo({ 'accountStatus': 'ANY' as chrome.identity.AccountStatus }, (info) => {
      const { email, id } = info;
      user = { email, id };
      resolve(user);
    });
  });
};

export { getUser };