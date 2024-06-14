import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { userExist, executeQuery, queries } from "../../database/index";

export const registerUser = async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, lastname, mail, password } = req.body;
  const pfp = req.files && req.files.pfp ? req.files.pfp[0] : null;

  try {
    const existingUser = await executeQuery(queries.userExist, { mail });
    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ message: "El correo ya está en uso" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(salt);

    const user = {
      name,
      lastname,
      mail,
      password: hashedPassword,
      pfp,
      status: true,
    };

    const params = {
      name: user.name,
      lastname: user.lastname,
      mail: user.mail,
      password: user.password,
      pfp: user.pfp ? user.pfp.buffer : Buffer.from(""),
      status: user.status,
    };
    const result = await executeQuery(queries.insertUser, params);

    const payload = {
      user: {
        id: result.insertId,
        name: user.name
      },
    };

    jwt.sign(
      payload,
      process.env.TOKEN,
      { expiresIn: "1 day" },
      (err, token) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error signing the token" });
        }
        res.status(201).json({ message: "success", accessToken: token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const login = async (req, res) => {
  try {
    const { mail, password } = req.body;

    const user = {
      mail: mail,
      password: password,
    };

    const params = {
      mail: user.mail,
      password: user.password,
    };

    if (!mail || !password) {
      return res
        .status(400)
        .json({
          error:
            "El correo y la contraseña son campos requeridos, intentelo de nuevo",
        });
    }

    const existingUser = await executeQuery(queries.userExist, params);
    console.log(existingUser);
    // console.log(existingUser.password);

    if (existingUser.recordset.length === 0) {
      console.warn("Error al intentar el inicio de sesion, intentelo de nuevo");
      return res.status(401).json({ error: "xd" });
    }

    const _user = existingUser.recordset[0];

    console.log(_user.password);

    if (await bcrypt.compare(password, _user.password)) {
      res.cookie("session", "secure-session-token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      console.log(`User ${mail} logged in successfully`);

      const accessToken = jwt.sign({ userId: _user.id , name: _user.name }, process.env.TOKEN, { //verificar 
        expiresIn: "1h",
      });

      res.json({accessToken});
    } else {
      console.warn(`Failed login attempt for correo ${mail}`);
      response.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};


export const updateCredentials = async (req, res) => {

  console.log(req.body);
  console.log(req.files);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {

    return res.status(400).json({ errors: errors.array() });

  }

  const { name, lastname, mail, password, pfp } = req.body;

  try {

    const existingUser = await executeQuery(queries.userExist, { mail });
    if (existingUser.recordset.length === 0) {
      return res.status(400).json({ message: `No existe el usuario ${mail}` });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(salt);

    const updatedUser = {
      name,
      lastname,
      password: hashedPassword, 
      pfp 
    }

    const params = {
      name: updatedUser.name,
      lastname: updatedUser.lastname,
      password: updatedUser.password,
      mail,
      pfp: updatedUser.pfp ? updatedUser.pfp.buffer : Buffer.from(""),
    };
    const result = await executeQuery(queries.updateUser, params);
    console.log(result);
    res.status(200).send("User updated");

  } catch (err) {

    console.error(err.message);
    res.status(500).send("Server Error");

  }
};
