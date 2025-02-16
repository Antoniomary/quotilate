import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import dbClient from '../../utils/db.js';
import redisClient from '../../utils/redis.js';

class ViewsController {
  /**
   * Fetches a random quote from the database.
   * @returns {Object} A quote object with fields `id`, `quote`, and `author`.
   */
  static async getIndexPage(req, res) {
    let token = null;

    if (req.cookies) token = req.cookies['quotilate_token'];

    let quote;

    try {
      quote = await dbClient.db
        .collection('quotes')
        .aggregate([{ $sample: { size: 1 } }])
        .toArray();
      if (quote.length > 0) quote = quote[0];
      if (quote) {
        quote.id = quote._id;
        delete quote._id;
      }
    } catch(err) {
      console.error('Error fetching quote for index page', err);
      quote = {
        id: 0,
        quote: '',
        author: '',
      };
    }

    if (!token) return res.render('index', {
      cacheId: uuidv4(),
      quote,
    });

    if (!dbClient.isAlive() || !redisClient.isAlive()) {
      return res.render('index', {
        cacheId: uuidv4(),
        quote,
      });
    }

    const id = await redisClient.get(`auth_${token}`);
    if (!id) return res.render('index', {
      cacheId: uuidv4(),
      quote,
    });

    const user = await dbClient.db.collection('users').findOne({ _id: new ObjectId(id) });
    if (!user) return res.render('index', {
      cacheId: uuidv4(),
      quote,
    });

    return res.redirect('/dashboard');
  }

   /**
   * Renders the dashboard page with user-specific data.
   * Requires the `req.user` object to be populated.
   */
  static async getDashboard(req, res) {
    const user = req.user;

    let quote;

    try {
      quote = await dbClient.db.collection('quotes')
        .aggregate([{ $sample: { size: 1 } }]).toArray();
      quote = quote[0];
      if (quote) {
        quote.id = quote._id;
        delete quote._id;
      }
    } catch(err) {
      console.error('Error fetching quote for index page', err);
      quote = {
        id: 0,
        quote: '',
        author: '',
      };
    }

    return res.render('dashboard', {
      username: user.username.charAt(0).toUpperCase() + user.username.slice(1),
      numberOfQuotes: user.numberOfQuotes,
      quotes: user.quotes,
      cacheId: uuidv4(),
      quote,
    });
  }

  /**
   * Renders the registration page.
   */
  static getRegisterPage(req, res) {
    return res.render('register', { cacheId: uuidv4() });
  }

   /**
   * Renders the login page.
   * If the user is authenticated, redirects to the dashboard.
   */
  static async getLoginPage(req, res) {
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

    return res.redirect('/dashboard');
  }
}

export default ViewsController;
