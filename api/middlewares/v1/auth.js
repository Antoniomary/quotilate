import { ObjectId } from 'mongodb';
import dbClient from '../../utils/db.js';
import redisClient from '../../utils/redis.js';

const auth = async (req, res, next) => {
  let token = null;

  const reqJson = req.headers.accept === 'application/json';

  if (reqJson) token = req.headers['x-token'];
  else token = req.cookies['quotilate_token'];

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  if (!dbClient.isAlive() || !redisClient.isAlive()) {
    return res.status(500).json({ error: 'unable to process request' });
  }

  const id = await redisClient.get(`auth_${token}`);
  if (!id) return res.status(401).json({ error: 'Unauthorized' });

  const user = await dbClient.db.collection('users').findOne({ _id: new ObjectId(id) });
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  req.user = user;

  next();
}

export default auth;
