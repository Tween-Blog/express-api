const Router = require('express').Router;
const router = new Router();

const authMiddleware = require('../middlewares/auth-middleware');

const userController = require('../controllers/user-controller');
const postController = require('../controllers/post-controller');
const commentController = require('../controllers/comment-controller');
const likeController = require('../controllers/like-controller');
const subscriptionController = require('../controllers/subscription-controller');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/refresh', userController.refresh);
router.get('/activate/:link', userController.activate);

router.get('/users', authMiddleware, userController.getUsers);
router.get('/users/:id', authMiddleware, userController.getUser);
router.put('/users', authMiddleware, userController.updateUser);
router.delete('/users', authMiddleware, userController.deleteUser);

router.get('/posts', authMiddleware, postController.getAll);
router.get('/posts/:id', authMiddleware, postController.getOne);
router.post('/posts', authMiddleware, postController.create);
router.put('/posts', authMiddleware, postController.update);
router.delete('/posts', authMiddleware, postController.delete);

router.get('/comments', authMiddleware, commentController.getAll);
router.get('/comments/:id', authMiddleware, commentController.getOne);
router.post('/comments', authMiddleware, commentController.create);
router.put('/comments', authMiddleware, commentController.update);
router.delete('/comments', authMiddleware, commentController.delete);

router.post('/like', authMiddleware, likeController.like);
router.post('/dislike', authMiddleware, likeController.dislike);
router.post('/check-like', authMiddleware, likeController.checkLike);

router.post('/subscribe', authMiddleware, subscriptionController.subscribe);
router.post('/unsubscribe', authMiddleware, subscriptionController.unsubscribe);
router.post('/check-subscribe', authMiddleware, subscriptionController.checkSubscribe);

router.get('/user-subscribers/:userId', authMiddleware, subscriptionController.getUserSubscribers);
router.get('/user-subscriptions/:userId', authMiddleware, subscriptionController.getUserSubscriptions);

router.get('/user-posts/:userId', authMiddleware, postController.getUserPosts);
router.get('/post-comments/:postId', authMiddleware, commentController.getPostComments);

module.exports = router;