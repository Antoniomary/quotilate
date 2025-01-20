import { createClient } from 'redis';

/**
 * RedisClient class to manage Redis connections and basic operations.
 * This class is responsible for connecting to Redis and performing basic operations
 * like getting, setting, and deleting keys with optional expiration.
 */
class RedisClient {
  constructor() {
    // Create Redis client instance
    this.client = createClient();
    // Flag to track connection status
    this.conn = false;

    // Event listener for successful connection
    this.client.on('connect', () => {
      console.log('Connected to Redis');
    });

    // Event listener for connection errors
    this.client.on('error', (err) => {
      console.log(`Failed to connect to Redis: ${err}`);
    });

    // Initialize the Redis client connection asynchronously
    (async () => {
      await this.client.connect();
      this.conn = true;
    })();
  }

  /**
   * Check if the Redis connection is alive.
   * @returns {boolean} - Returns true if the Redis client is connected, otherwise false.
   */
  isAlive() {
    return this.client.isOpen;
  }

  /**
   * Get the value associated with a key from Redis.
   * @param {string} key - The key whose value is to be fetched.
   * @returns {Promise<string|null>} - Resolves with the value of the key, or null if not found.
   */
  async get(key) {
    return this.client.get(key, (err, value) => {
      if (err) throw new Error(err);
      return value;
    });
  }

  /**
   * Set a value for a key in Redis with an optional expiration time.
   * @param {string} key - The key to set.
   * @param {string} value - The value to store.
   * @param {number} duration - The expiration time in seconds.
   * @returns {Promise<string>} - Resolves with the Redis response.
   */
  async set(key, value, duration) {
    return await this.client.set(key, value, 'EX', duration, (err, resp) => {
      if (err) throw new Error(err);
      return console.log(resp);
    });
  }

  /**
   * Delete a key from Redis.
   * @param {string} key - The key to delete.
   * @returns {Promise<number>} - Resolves with the number of keys deleted (0 or 1).
   */
  async del(key) {
    return await this.client.del(key, (err, resp) => {
      if (err) throw new Error(err);
      return (resp);
    });
  }
}

// Create an instance of RedisClient
const cache = new RedisClient();

// Export the RedisClient instance for use in other parts of the application
export default cache;
