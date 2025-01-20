/**
 * Logging middleware for HTTP requests.
 *
 * This middleware logs details about incoming HTTP requests, including the host, 
 * timestamp, request method, URL, protocol, HTTP version, response status code,
 * and time taken to process the request. It helps track request and response metrics
 * for debugging and monitoring purposes.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware or route handler.
 *
 * @returns {void} - Calls the next middleware or route handler after logging the request.
 */
const logger = (req, res, next) => {
  let host = req.get('host').split(':')[0];
  if (host === 'localhost') host = '127.0.0.1';

  const time = (new Date()).toLocaleString();
  const method = req.method;
  const url = req.originalUrl;
  const protocol = req.protocol.toUpperCase();
  const version = req.httpVersion;

  // Capture the start time for request processing
  const start = Date.now();

  // Once the response has been sent, log the response status and time taken
  res.on('finish', () => {
    const stat = res.statusCode;
    const duration = Date.now() - start;

    const r = `${host} - [${time}] "${method} ${url} ${protocol}/${version}" ${stat} - ${duration}ms`;

    console.log(r);
  });

  next();
};

export default logger;
