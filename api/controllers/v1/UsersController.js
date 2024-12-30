import { v4 as uuidv4 } from 'uuid';
import db from '../../utils/db.js';
import cache from '../../utils/redis.js';
import Password from '../../utils/password.js';

class UsersController {
  static async registerUser(req, res) {
    if (!req.body || typeof req.body !== 'object' || !Object.keys(req.body).length) {
      return res.status(400).json({ error: "Missing new user details" });
    }

    const { username, email, password, repassword } = req.body;
    if (!email) return res.status(400).json({ error: "Missing email" });
    if (!username) return res.status(400).json({ error: "Missing username" });
    if (!password) return res.status(400).json({ error: "Missing password" });
    if (!repassword) return res.status(400).json({ error: "Missing password confirmation" });

    if (password !== repassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    if (!db.isAlive() || !cache.isAlive()) {
      return res.status(500).json({ error: 'unable to process request' });
    }

    const existingEmail = await db.db.collection('users').findOne({ email });
    if (existingEmail) return res.status(400).json({ error: 'Email already exists' });
    const existingUsername = await db.db.collection('users').findOne({ username });
    if (existingUsername) return res.status(400).json({ error: 'Username already exists' });

    const hashed = await Password.hashPassword(password);
    if (!hashed) return res.status(500).json({ error: 'unable to process request' });

    const newUser = {
      email,
      username,
      password: hashed,
      quotes: [],
      numberOfQuotes: 0,
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    const result = await db.db.collection('users').insertOne(newUser);

    const reqJson = req.headers.accept === 'application/json';

    if (reqJson) {
      return res.status(201).json({
        id: result.insertedId,
        createdAt: newUser.createdAt,
      });
    }

    const token = uuidv4();
    try {
      await cache.set(`auth_${token}`, result.insertedId.toString(), 86400);
    } catch (err) {
      return res.status(500).json({ error: 'unable to process request' });
    }

    res.cookie('quotilate_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })

    return res.render('dashboard', {
      username: username.charAt(0).toUpperCase() + username.slice(1),
      numberOfQuotes: newUser.numberOfQuotes,
      quotes: newUser.quotes,
      cacheId: uuidv4(),
    });
  }

  static async loginUser(req, res) {
    if (!req.body || typeof req.body !== 'object' || !Object.keys(req.body).length) {
      return res.status(400).json({ error: "Missing user details" });
    }

    const { username, email, password } = req.body;
    if (!username && !email) return res.status(400).json({ error: "Missing username or email" });
    if (!password) return res.status(400).json({ error: "Missing password" });

    if (!db.isAlive() || !cache.isAlive()) {
      return res.status(500).json({ error: 'unable to process request' });
    }

    let user = null;
    if (username) {  
      user = await db.db.collection('users').findOne({ username });
    } else if (email) {
      user = await db.db.collection('users').findOne({ email });
    }
    if (!user) return res.status(400).json({ error: 'Invalid login, please try again' });

    const match = await Password.verifyPassword(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid login, please try again' });

    try {
      await db.db.collection('users').updateOne({ _id: user._id }, { $set: { lastLogin: new Date() }});
    } catch(err) {
      return res.status(500).json({ error: 'unable to process request' });
    }

    const reqJson = req.headers.accept === 'application/json';

    const token = uuidv4();
    try {
      await cache.set(`auth_${token}`, user._id.toString(), 86400);
    } catch (err) {
      return res.status(500).json({ error: 'unable to process request' });
    }

    if (reqJson) {
      return res.status(200).json({
        username: user.username,
        numberOfQuotes: user.numberOfQuotes,
        quotes: user.quotes,
        token,
      });
    }

    res.cookie('quotilate_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })

    return res.render('dashboard', {
      username: user.username.charAt(0).toUpperCase() + user.username.slice(1),
      numberOfQuotes: user.numberOfQuotes,
      quotes: user.quotes,
      cacheId: uuidv4(),
    });
  }

  static async logoutUser(req, res) {
    let token = null;

    const reqJson = req.headers.accept === 'application/json';

    if (reqJson) token = req.headers['x-token'];
    else token = req.cookies['quotilate_token'];

    await cache.del(`auth_${token}`);

    if (reqJson) return res.status(204).json({});

    res.cookie('quotilate_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })

    return res.redirect('/login');
  }
}

export default UsersController;
