const logger = (req, res, next) => {
  let host = req.get('host').split(':')[0];
  if (host === 'localhost') host = '127.0.0.1';

  const time = (new Date()).toLocaleString();
  const method = req.method;
  const url = req.originalUrl;
  const protocol = req.protocol.toUpperCase();
  const version = req.httpVersion;

  console.log(`${host} - [${time}] "${method} ${url} ${protocol}/${version}"`);
  next();
};

export default logger;
