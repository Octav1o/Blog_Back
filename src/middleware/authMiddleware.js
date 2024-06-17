import { verify } from 'jsonwebtoken';

export const  authenticateToken = (req, res, next) =>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    verify(token, process.env.TOKEN, (err, user) => {
        if (err) {
            return res.sendStatus(403)
        }

        req.user = user;
        next();
    });
}
