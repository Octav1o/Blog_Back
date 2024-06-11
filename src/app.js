import express, {json} from 'express';
import cors from "cors";
// import multer from "multer";
import userRoutes from './routes/user.routes';

const app = express();
// const upload = multer();

// app.use(upload.array());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const publicRoutes = [
    '/api/user/login',
    '/api/user/registerUser',
];

app.use(cors({ origin: "*"}));

app.use(( req, res, next ) => {
    if(publicRoutes.includes(req.path)) {
        return next();
    };
});


app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
app.use(userRoutes);

export default app;