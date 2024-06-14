import { Router } from "express";

import { login, registerUser, updateCredentials } from "../controllers/userController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.post('/api/user/registerUser', registerUser);
router.post('/api/user/login', login);
router.post('/api/user/updateCredentials', authenticateToken, updateCredentials);


export default router;