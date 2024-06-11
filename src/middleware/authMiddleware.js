import { verify } from 'jsonwebtoken';

export const  authenticateToken = (request, response, next) =>{
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return response.sendStatus(401);
    }

    verify(token, process.env.TOKEN, (err, user) => {
        if (err) {
            return response.sendStatus(403)
        }

        request.user = user;
        next();
    });
}
