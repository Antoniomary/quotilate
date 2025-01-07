import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import cors from 'cors';
import routes from './routes/v1/index.js';
import logger from './middlewares/v1/logger.js';

const PORT = process.env.PORT || 1245;
const HOST = process.env.HOST || '127.0.0.1';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: ['*'],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.set('views', path.join(__dirname, '../static/views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../static')));
app.use(logger);
app.use(routes);

(async () => {
  try {
    const response = await fetch(`http://${HOST}:${PORT}/quote`);

    if (!response.ok) return console.log('Failed to populate database');
  } catch(err) {
    return console.log('Error populating database on startup', err);
  }
})();

app.listen(PORT, () => {
  console.log(`Server is running at ${HOST} on ${PORT}`);
});

export default app;
