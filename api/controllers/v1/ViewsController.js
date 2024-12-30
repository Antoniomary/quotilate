import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import dbClient from '../../utils/db.js';
import redisClient from '../../utils/redis.js';

class ViewsController {
  static async getIndexPage(req, res) {
    let token = null;

    if (req.cookies) token = req.cookies['quotilate_token'];

    if (!token) return res.render('index', { cacheId: uuidv4() });

    if (!dbClient.isAlive() || !redisClient.isAlive()) {
      return res.render('index', { cacheId: uuidv4() });
    }

    const id = await redisClient.get(`auth_${token}`);
    if (!id) res.render('index', { cacheId: uuidv4() });

    const user = await dbClient.db.collection('users').findOne({ _id: new ObjectId(id) });
    if (!user) return res.render('index', { cacheId: uuidv4() });

    return res.redirect('dashboard', {
      username: user.username.charAt(0).toUpperCase() + user.username.slice(1),
      numberOfQuotes: user.numberOfQuotes,
      quotes: user.quotes,
      cacheId: uuidv4(),
    });
  }

  static async getRegisterPage(req, res) {
    return res.render('register', { cacheId: uuidv4() });
  }

  static getLoginPage(req, res) {
    let token = null;

    if (req.cookies) token = req.cookies['quotilate_token'];

    if (!token) return res.render('login', { cacheId: uuidv4() });

    if (!dbClient.isAlive() || !redisClient.isAlive()) {
      return res.render('login', { cacheId: uuidv4() });
    }

    const id = await redisClient.get(`auth_${token}`);
    if (!id) res.render('login', { cacheId: uuidv4() });

    const user = await dbClient.db.collection('users').findOne({ _id: new ObjectId(id) });
    if (!user) return res.render('login', { cacheId: uuidv4() });

    return res.redirect('dashboard', {
      username: user.username.charAt(0).toUpperCase() + user.username.slice(1),
      numberOfQuotes: user.numberOfQuotes,
      quotes: user.quotes,
      cacheId: uuidv4(),
    });
  }
}

export default ViewsController;
