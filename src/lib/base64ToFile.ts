const uploadImage = async (b64img: string) => await urltoFile(b64img, 'attachment.jpg', base64MimeType(b64img));

//return a promise that resolves with a File instance
const urltoFile = (url: any, filename: any, mimeType: any) => {
  return (fetch(url)
    .then((res) => { return res.arrayBuffer(); })
    .then((buf) => { return new File([buf], filename, { type: mimeType }); })
  );
}

//return mime Type of bs64
const base64MimeType = (encoded: string) => {
  let result = null;

  if (typeof encoded !== 'string') {
    return result;
  }

  let mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

  if (mime && mime.length) {
    result = mime[1];
  }

  return result;
}

export { uploadImage };