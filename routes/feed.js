const express = require('express');
const { body } = require('express-validator');

const feedController = require('../controllers/feed');

const isAuth = require('../middleware/auth');

const router = express.Router();

//GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);

//POST /feed/post
router.post('/posts', isAuth, [
    //Incoming validation
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
], feedController.postPost);

//GET /feed/post
router.get('/post/:postId', isAuth, feedController.getPost);

router.put('/post/:postId', isAuth, [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
], feedController.updatePost);

module.exports = router;