import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { executeQuery, queries } from "../../database/index";

export const registerUser = async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, lastname, mail, password, status } = req.body;
  const pfp = req.files && req.files.pfp ? req.files.pfp[0] : null;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(salt);

    const user = {
      name,
      lastname,
      mail,
      password: hashedPassword,
      pfp,
      status,
    };

    const params = [
      user.name,
      user.lastname,
      user.mail,
      user.password,
      user.pfp,
      user.status,
    ];
    const result = await executeQuery(queries.insertUser, params);

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
            if ( err ) {
                console.error(err);
                return res.status(500).json({ message: 'Error signing the token' });
            }
            res.status(201).json( {message: 'success', token: token });
        }
    );
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
