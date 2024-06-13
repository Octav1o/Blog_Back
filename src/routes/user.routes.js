import { Router } from "express";

import { login, registerUser } from "../controllers/userController";

const router = Router();

router.post('/api/user/registerUser', registerUser);
router.post('/api/user/login', login);

export default router;