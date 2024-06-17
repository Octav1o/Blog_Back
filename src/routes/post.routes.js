import { Router } from "express";

import { createPost, deltePost, updatePost, getPosts, getUserPosts } from "../controllers/postsController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.post('/api/post/createPost', authenticateToken, createPost);
router.post('/api/post/updatePost', authenticateToken, updatePost);
router.delete('/api/post/deletePost', authenticateToken, deltePost);
router.get('/api/post/getPosts', getPosts);
router.get('/api/post/getUserPosts', getUserPosts);

export default router;