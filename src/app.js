import express, {json} from 'express';
import cors from "cors";
import userRoutes from './routes/user.routes';
import multer from "multer";
import bodyParser from 'body-parser'
import { authenticateToken } from './middleware/authMiddleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const upload = multer();

app.use(cors({ origin: "*"}));

app.use(upload.fields([{ name: 'pfp', maxCount: 1}]));
app.use(express.json());

const PORT = process.env.PORT || 3000;

const publicRoutes = [
    '/api/user/login',
    '/api/user/registerUser',
];


app.use(( req, res, next ) => {
    if(publicRoutes.includes(req.path)) {
        return next();
    };
    authenticateToken(req, res, next);
});


app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
app.use(userRoutes);

export default app;