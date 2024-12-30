import cache from '../../utils/redis.js';
import db from '../../utils/db.js';

class AppController {
  static getStatus(req, res) {
    return res.status(200).json({
      cache: cache.isAlive(),
      db: db.isAlive(),
    });
  }

  static async getStats(req, res) {
    return res.status(200).json({
      users: await db.nbUsers(),
      quotes: await db.nbQuotes(),
    });
  }
}

export default AppController;
