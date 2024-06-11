import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { insertUser } from '../../database/index';


export const registerUser = async ( req, res ) => {

    const errors = validationResult( req );
    if(!errors.isEmpty()) {
        return res.status( 400 ).json({ errors: errors.array() });
    }

    const { name, lastname, mail, password, pfp, status } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = {
            name,
            lastname,
            mail,
            password: hashedPassword,
            pfp: pfp || null,
            status
        };

        const result = await insertUser(user);

        const payload = {
            user: {
                id: result.insertId,
            },
        };

        jwt.sign(
            payload,
            process.env.TOKEN,
            { expiresIn: '1 day'},
            ( err, token ) => {
                if ( err ) throw err;
                res.status(201).json( {message: 'success'}, token );
            }
        );
    // return res.status(201).json({message: 'success', token: token});
    } catch ( err ) {
        console.error( err.message );
        res.status( 500 ).send( 'Server Error' );
    }
}