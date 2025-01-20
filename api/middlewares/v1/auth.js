import { ObjectId } from 'mongodb';
import dbClient from '../../utils/db.js';
import redisClient from '../../utils/redis.js';

/**
 * Authentication middleware for protecting routes.
 * 
 * This middleware checks if the user is authenticated by verifying the presence
 * of a valid token (either in headers or cookies). It ensures that the token
 * matches an entry in Redis, retrieves the associated user from the database,
 * and attaches the user to the `req` object for use in subsequent route handlers.
 * 
 * If any part of the authentication process fails, a 401 (Unauthorized) or 500
 * (Internal Server Error) response is sent to the client.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware or route handler.
 * 
 * @returns {void} - Calls the next middleware or route handler if authenticated.
 */
const auth = async (req, res, next) => {
  let token = null;

  // Determine if the request expects JSON response
  const reqJson = req.headers.accept === 'application/json';

  // Get the token from either request header or cookies
  if (reqJson) token = req.headers['x-token'];
  else token = req.cookies['quotilate_token'];

  // If no token is found, return 401 Unauthorized
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  // Check if Redis or DB clients are alive
  if (!dbClient.isAlive() || !redisClient.isAlive()) {
    return res.status(500).json({ error: 'unable to process request' });
  }

  try {
    // Fetch the user ID from Redis using the token
    const id = await redisClient.get(`auth_${token}`);
    if (!id) return res.status(401).json({ error: 'Unauthorized' });

    // Retrieve the user from the database by ID
    const user = await dbClient.db.collection('users').findOne({ _id: new ObjectId(id) });
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    // Attach the user object to the request for use in later route handlers
    req.user = user;

    // Move to the next middleware or route handler
    next();
  } catch(err) {
    // Catch and handle any errors in the authentication process
    return res.status(500).json({ error: 'unable to process request' });
  }
}

export default auth;
