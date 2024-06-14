import { Router } from "express";

import { createPost, deltePost, updatePost, getPosts } from "../controllers/postsController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.post('/api/post/createPost', authenticateToken, createPost);
router.post('/api/post/updatePost', authenticateToken, updatePost);
router.delete('/api/post/deletePost', authenticateToken, deltePost);
router.get('/api/post/getPosts', getPosts);

export default router;