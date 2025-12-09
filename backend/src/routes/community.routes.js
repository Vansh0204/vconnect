const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const { listPosts, createPost, addComment, toggleLike } = require('../controllers/community.controller');

router.get('/', listPosts);
router.post('/create', auth, createPost);
router.post('/:id/comment', auth, addComment);
router.post('/:id/like', auth, toggleLike);

module.exports = router;
