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
    const cacheStatus = cache.isAlive();
    const dbStatus = db.isAlive();

    if (!cacheStatus || !dbStatus) {
      console.error('Cache or DB connection failed');
    }

    return res.status(200).json({
      cache: cacheStatus,
      db: dbStatus,
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
    try {
      const users = await db.nbUsers();
      const quotes = await db.nbQuotes();

      return res.status(200).json({
        users,
        quotes,
      });
    } catch(err) {
      console.error('Error fetching statistics:', err);
      return res.status(500).json({ error: 'Unable to fetch statistics' });
    }
  }
}

export default AppController;
