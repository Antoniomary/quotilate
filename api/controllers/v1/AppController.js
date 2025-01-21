import cache from '../../utils/redis.js';
import db from '../../utils/db.js';

class AppController {
  /**
   * Returns the status of the cache and database.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} - Status of cache and db connections.
   */
  static getStatus(req, res) {
    return res.status(200).json({
      cache: cache.isAlive(),
      db: db.isAlive(),
    });
  }

  /**
   * Returns the statistics for users and quotes.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} - Number of users and quotes in the database.
   */
  static async getStats(req, res) {
    return res.status(200).json({
      users: await db.nbUsers(),
      quotes: await db.nbQuotes(),
    });
  }
}

export default AppController;
