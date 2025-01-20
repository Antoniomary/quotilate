import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    // Get connection parameters from environment variables or fallback to defaults
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const dbName = process.env.DB_DATABASE || 'quotilate';

    // Use these parameters to construct the MongoDB connection URL
    const url = `mongodb://${host}:${port}`;

    this.client = new MongoClient(url);
    this.dbName = dbName;
    this.connected = false;
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

  // Check if the database connection is alive
  isAlive() {
    return this.connected;
  }

  // Get the number of users in the 'users' collection
  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  // Get the number of quotes in the 'quotes' collection
  async nbQuotes() {
    return this.db.collection('quotes').countDocuments();
  }
}

// Create an instance of DBClient
const db = new DBClient();

// Immediately invoke the connect method to establish a connection
(async () => {
  try {
    await db.connect(); // Connect to the database
  } catch(err) {
    console.error(err); // Handle errors if the connection fails
  }
})();

// Export the DBClient instance for use in other parts of the application
export default db;
