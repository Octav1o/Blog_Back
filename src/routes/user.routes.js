import { Router } from "express";

import { registerUser } from "../controllers/userController";

const router = Router();

router.post('/api/user/registerUser', registerUser);

export default router;