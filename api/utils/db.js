import { MongoClient } from 'mongodb';

class DBClient {
  /**
   * Initializes the DBClient and sets up the connection parameters.
   * @constructor
   * @param {string} [host='localhost'] - The MongoDB host (default is 'localhost').
   * @param {number} [port=27017] - The MongoDB port (default is 27017).
   * @param {string} [dbName='quotilate'] - The database name (default is 'quotilate').
   */
  constructor() {
    // Get connection parameters from environment variables or fallback to defaults
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const dbName = process.env.DB_DATABASE || 'quotilate';

    // Use these parameters to construct the MongoDB connection URL
    const url = `mongodb://${host}:${port}`;

    // Initialize the MongoClient instance with the connection URL
    this.client = new MongoClient(url);
    this.dbName = dbName; // Store the database name
    this.connected = false; // Connection status flag
  }

  // Async method to connect to the database
  async connect() {
    try {
      // Try to establish the connection to MongoDB
      await this.client.connect()
      this.db = this.client.db(this.dbName); // Set the database object
      this.connected = true; // Mark the connection as successful
      console.log(`Connected to ${this.dbName} database`); // Log success message
    } catch(err) {
      // If there's an error, log it and exit the process
      console.log(`Failed to connect to MongoDB: ${err}`);
      process.exit(1);
    }
  }

  /**
   * Checks if the MongoDB connection is alive.
   * @returns {boolean} - Returns true if connected, false otherwise.
   */
  isAlive() {
    return this.connected;
  }

  /**
   * Returns the number of users in the 'users' collection.
   * @returns {Promise<number>} - A promise that resolves to the count of documents in the 'users' collection.
   */
  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  /**
   * Returns the number of quotes in the 'quotes' collection.
   * @returns {Promise<number>} - A promise that resolves to the count of documents in the 'quotes' collection.
   */
  async nbQuotes() {
    return this.db.collection('quotes').countDocuments();
  }
}

// Create an instance of DBClient
const db = new DBClient();

// Immediately connect method to establish a connection
(async () => {
  try {
    await db.connect(); // Connect to the database
  } catch(err) {
    console.error(err); // Handle errors if the connection fails
  }
})();

// Export the DBClient instance for use in other parts of the application
export default db;
