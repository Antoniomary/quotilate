import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.conn = false;

    this.client.on('connect', () => {
      console.log('Connected to Redis');
    });

    this.client.on('error', (err) => {
      console.log(`Failed to connect to Redis: ${err}`);
    });

    (async () => {
      await this.client.connect();
      this.conn = true;
    })();
  }

  isAlive() {
    return this.client.isOpen;
  }

  async get(key) {
    return this.client.get(key, (err, value) => {
      if (err) throw new Error(err);
      return value;
    });
  }

  async set(key, value, duration) {
    return await this.client.set(key, value, 'EX', duration, (err, resp) => {
      if (err) throw new Error(err);
      return console.log(resp);
    });
  }

  async del(key) {
    return await this.client.del(key, (err, resp) => {
      if (err) throw new Error(err);
      return (resp);
    });
  }
}

const cache = new RedisClient();

export default cache;
