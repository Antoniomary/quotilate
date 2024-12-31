import express from 'express';
import AppController from '../../controllers/v1/AppController.js';
import ViewsController from '../../controllers/v1/ViewsController.js';
import UsersController from '../../controllers/v1/UsersController.js';
import QuotesController from '../../controllers/v1/QuotesController.js';
import auth from '../../middlewares/v1/auth.js';

const router = express.Router();

router.get('/', ViewsController.getIndexPage);

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

router.get('/register', ViewsController.getRegisterPage);
router.post('/register', UsersController.registerUser);

router.get('/login', ViewsController.getLoginPage);
router.post('/login', UsersController.loginUser);

router.get('/dashboard', auth, ViewsController.getDashboard);

router.post('/logout', auth, UsersController.logoutUser);

router.get('/quote', QuotesController.getRandomQuote);
router.get('/quotes', auth, QuotesController.getUserQuotes);
router.get('/quotes/:id', auth, QuotesController.getOneUserQuote);
router.post('/quotes/:id?', auth, QuotesController.saveQuote);
router.delete('/quotes/:id?', auth, QuotesController.deleteQuote);

export default router;
