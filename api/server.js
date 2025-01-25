import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import cors from 'cors';
import routes from './routes/v1/index.js';
import logger from './middlewares/v1/logger.js';

// Define default host and port
const PORT = process.env.PORT || 1245;
const HOST = process.env.HOST || '127.0.0.1';

// Initialize the Express app
const app = express();

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to handle CORS
app.use(cors({
  origin: ['*'], // Allow all origins
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  credentials: true, // Include credentials in requests
}));

// Set view engine to EJS for rendering templates
app.set('views', path.join(__dirname, '../static/views'));
app.set('view engine', 'ejs');

// Middleware for parsing JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Serve static files from the "static" directory
app.use(express.static(path.join(__dirname, '../static')));

// Custom middleware for logging
app.use(logger);

// Route definitions
app.use(routes);

// Function to populate the database on server startup
(async () => {
  try {
    const response = await fetch(`http://${HOST}:${PORT}/quote`);

    if (!response.ok) return console.log('Failed to populate database');
  } catch(err) {
    return console.log('Error populating database on startup', err);
  }
})();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at ${HOST} on ${PORT}`);
});

export default app;
