import express from 'express';
import cors from "cors";
import userRoutes from './routes/user.routes';
import postsRoutes from './routes/post.routes';
import { authenticateToken } from './middleware/authMiddleware';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar express-fileupload
app.use(fileUpload({
  createParentPath: true,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
}));

app.use('/photos', express.static(path.join(__dirname, './photos')));
// Middleware para verificar el token en rutas protegidas
const publicRoutes = [
  '/api/user/login',
  '/api/user/registerUser',
  '/api/post/getPosts',
  // '/api/post/getUserPosts',
];

app.use((req, res, next) => {
  console.log(req.path);
  if (publicRoutes.includes(req.path)) {
    return next();
  }
  authenticateToken(req, res, next);
});

// Rutas para usuarios y posts
app.use(userRoutes);
app.use(postsRoutes);

// Middleware para servir archivos estáticos (fotos)

// Escuchar en el puerto definido
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

export default app;
