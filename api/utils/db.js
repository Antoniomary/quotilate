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

  async connect() {
    try {
      await this.client.connect()
      this.db = this.client.db(this.dbName);
      this.connected = true;
      console.log(`Connected to ${this.dbName} database`);
    } catch(err) {
      console.log(`Failed to connect to MongoDB: ${err}`);
      process.exit(1); // Exit process if database connection fails
    }
  }

  isAlive() {
    return this.connected;
  }

  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  async nbQuotes() {
    return this.db.collection('quotes').countDocuments();
  }
}

const db = new DBClient();

(async () => {
  try {
    await db.connect(); // Connect to the database
  } catch(err) {
    console.error(err);
  }
})();

export default db;
