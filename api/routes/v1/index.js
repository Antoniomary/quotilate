import express from 'express';
import {
  AppController,
  ViewsController,
  UsersController,
  QuotesController,
} from '../../controllers/v1/index.js';
import auth from '../../middlewares/v1/auth.js';

const router = express.Router();

/**
 * Root endpoint to render the index page
 */
router.get('/', ViewsController.getIndexPage);

/**
 * API endpoint to check the status of the app
 */
router.get('/status', AppController.getStatus);

/**
 * API endpoint to get application statistics
 */
router.get('/stats', AppController.getStats);

/**
 * Route to render the user registration page (GET) and register a new user (POST)
 */
router.get('/register', ViewsController.getRegisterPage);
router.post('/register', UsersController.registerUser);

/**
 * Route to render the login page (GET) and login the user (POST)
 */
router.get('/login', ViewsController.getLoginPage);
router.post('/login', UsersController.loginUser);

/**
 * Route to display the dashboard page (requires authentication)
 */
router.get('/dashboard', auth, ViewsController.getDashboard);

/**
 * Route to log out the user (POST)
 */
router.post('/logout', auth, UsersController.logoutUser);

/**
 * Route to fetch a random quote
 */
router.get('/quote', QuotesController.getRandomQuote);

/**
 * Route to fetch all quotes for the authenticated user
 */
router.get('/quotes', auth, QuotesController.getUserQuotes);

/**
 * Route to fetch a specific user's quote by ID
 */
router.get('/quotes/:id', auth, QuotesController.getOneUserQuote);

/**
 * Route to save or update a user's quote (POST)
 */
router.post('/quotes/:id?', auth, QuotesController.saveQuote);

/**
 * Route to delete a user's quote by ID (DELETE)
 */
router.delete('/quotes/:id?', auth, QuotesController.deleteQuote);

// Export the Router instance for use in other parts of the application
export default router;
