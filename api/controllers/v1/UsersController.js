import { v4 as uuidv4 } from 'uuid';
import db from '../../utils/db.js';
import cache from '../../utils/redis.js';
import Password from '../../utils/password.js';

/**
 * Controller class for user-related operations.
 * Handles user registration, login, and logout functionality.
 */
class UsersController {
  /**
   * Registers a new user.
   * Validates input, checks for existing users, hashes the password,
   * and saves the user in the database. Handles JSON and non-JSON requests.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  static async registerUser(req, res) {
    // Validate request body presence and format
    if (!req.body || typeof req.body !== 'object' || !Object.keys(req.body).length) {
      return res.status(400).json({ error: "Missing new user details" });
    }

    // Destructure and validate required fields
    const { username, email, password, repassword } = req.body;
    if (!email) return res.status(400).json({ error: "Missing email" });
    if (!username) return res.status(400).json({ error: "Missing username" });
    if (!password) return res.status(400).json({ error: "Missing password" });
    if (!repassword) return res.status(400).json({ error: "Missing password confirmation" });

    if (password !== repassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Ensure database and cache are alive
    if (!db.isAlive() || !cache.isAlive()) {
      return res.status(500).json({ error: 'Unable to process request' });
    }

    // Check for existing users by email or username
    const existingEmail = await db.db.collection('users').findOne({ email });
    if (existingEmail) return res.status(400).json({ error: 'Email already exists' });
    const existingUsername = await db.db.collection('users').findOne({ username });
    if (existingUsername) return res.status(400).json({ error: 'Username already exists' });

    // Hash the password and handle potential errors
    const hashed = await Password.hashPassword(password);
    if (!hashed) return res.status(500).json({ error: 'Unable to process request' });

    // Create the new user object
    const newUser = {
      email,
      username,
      password: hashed,
      quotes: [], // Default empty array for user's quotes
      numberOfQuotes: 0, // Default quote count
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    // Insert the new user into the database
    const result = await db.db.collection('users').insertOne(newUser);

    // Handle JSON and non-JSON responses
    const reqJson = req.headers.accept === 'application/json';

    if (reqJson) {
      return res.status(201).json({
        id: result.insertedId,
        createdAt: newUser.createdAt,
      });
    }

    // Generate a session token and cache it
    const token = uuidv4();
    try {
      await cache.set(`auth_${token}`, result.insertedId.toString(), 86400);
    } catch (err) {
      return res.status(500).json({ error: 'Unable to process request' });
    }

    // Set a secure cookie and redirect
    res.cookie('quotilate_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.redirect('/dashboard');
  }

  /**
   * Logs in a user.
   * Verifies credentials, updates the last login timestamp, and generates a session token.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  static async loginUser(req, res) {
    // Validate request body presence and format
    if (!req.body || typeof req.body !== 'object' || !Object.keys(req.body).length) {
      return res.status(400).json({ error: "Missing user details" });
    }

    // Destructure and validate input
    const { username, email, password } = req.body;
    if (!username && !email) return res.status(400).json({ error: "Missing username or email" });
    if (!password) return res.status(400).json({ error: "Missing password" });

    // Ensure database and cache are alive
    if (!db.isAlive() || !cache.isAlive()) {
      return res.status(500).json({ error: 'Unable to process request' });
    }

    // Locate user by username or email
    let user = null;
    if (username) user = await db.db.collection('users').findOne({ username });
    if (!user && email) user = await db.db.collection('users').findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid login, please try again' });

    // Verify password
    const match = await Password.verifyPassword(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid login, please try again' });

    // Update last login timestamp
    try {
      await db.db.collection('users').updateOne({ _id: user._id }, { $set: { lastLogin: new Date() }});
    } catch(err) {
      return res.status(500).json({ error: 'Unable to process request' });
    }

    // Generate session token
    const token = uuidv4();
    try {
      await cache.set(`auth_${token}`, user._id.toString(), 86400);
    } catch (err) {
      return res.status(500).json({ error: 'Unable to process request' });
    }

    // handle JSON response format
    const reqJson = req.headers.accept === 'application/json';
    if (reqJson) {
      return res.status(200).json({
        username: user.username,
        numberOfQuotes: user.numberOfQuotes,
        quotes: user.quotes,
        token,
      });
    }

    // handle HTML response format
    res.cookie('quotilate_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })

    return res.redirect('/dashboard');
  }

  /**
   * Logs out a user by deleting their session token.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  static async logoutUser(req, res) {
    let token = null;

    const reqJson = req.headers.accept === 'application/json';

    // Determine token source (JSON header or cookie)
    if (reqJson) token = req.headers['x-token'];
    else token = req.cookies['quotilate_token'];

    // Remove session token from cache
    await cache.del(`auth_${token}`);

    if (reqJson) return res.status(204).json({});

    // Clear cookie and redirect
    res.cookie('quotilate_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })

    return res.redirect('/login');
  }
}

export default UsersController;
