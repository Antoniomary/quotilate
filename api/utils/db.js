import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const dbName = process.env.DB_DATABASE || 'quotilate';

    const url = `mongodb://${host}:${port}`;
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.connected = false;

    this.client.connect()
      .then(() => {
        this.db = this.client.db(dbName);
        this.connected = true;
        console.log(`Connected to ${dbName} database`);
      })
      .catch((err) => {
        console.log(`Failed to connect to mongodb: ${err}`);
      });
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

export default db;
