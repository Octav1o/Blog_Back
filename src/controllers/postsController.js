import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { executeQuery, queries } from "../../database/index";
import path from "path";
import fs from "fs";

// export const createPost = async (req, res) => {
//   console.log(req.body);
//   console.log(req.files);

//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { tittle, textDescrip } = req.body;
//   const picture = req.files && req.files.picture ? req.files.picture : null;

//   try {
//     const token = req.headers.authorization.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.TOKEN);
//     const userId = decoded.userId;

//     let params = {
//       tittle,
//       textDescrip,
//       picture: picture ? picture.name : null,
//     };

//     if (picture) {
//       const fileName = picture.name;
//       const uploadPath = path.join(__dirname, "../../photos", fileName);

//       await picture.mv(uploadPath);

//       const fileData = fs.readFileSync(uploadPath);

//       params.picture = fileData;
//     }

//     const result = await executeQuery(queries.insertPost, params);

//     const postId = result.recordset[0].id;

//     const relationParams = {
//       idUser: userId,
//       idPost: postId,
//     };

//     await executeQuery(queries.insertUserPost, relationParams);

//     res.status(201).json({ message: "Post creado exitosamente", postId });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Error en el servidor al intentar crear el post");

//     if (picture) {
//       const filePath = path.join(__dirname, "../../photos", picture.name);
//       fs.unlinkSync(filePath);
//     }
//   }
// };

export const createPost = async (req, res) => {
  // console.log(req.body);
  // console.log(req.files);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { tittle, textDescrip } = req.body;

  let picture;
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.TOKEN);
    const userId = decoded.userId;

    let params = {
      tittle,
      textDescrip,
      picture: null, // Aquí cambiamos el buffer por el nombre del archivo
    };

    picture = req.files ? req.files.picture : '';

    if (picture) {
      const fileName = picture.name;
      const uploadPath = path.join(__dirname, "../photos/", fileName);

      params.picture = fileName; // Actualiza params.picture con el nombre del archivo
      await picture.mv(uploadPath);

    }

    if (params.picture) { // Asegúrate de que 'picture' no es null o undefined antes de llamar a 'executeQuery'
      console.log(params);
      const result = await executeQuery(queries.insertPost, params);

      const postId = result.recordset[0].id;

      const relationParams = {
        idUser: userId,
        idPost: postId,
      };

      await executeQuery(queries.insertUserPost, relationParams);

      res.status(201).json({ message: "Post creado exitosamente", postId });
    } else {
      console.error("Error: 'picture' es null o undefined");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor al intentar crear el post");

    if (picture) {
      const filePath = path.join(__dirname, "./photos", picture.name);
      fs.unlinkSync(filePath);
    }
  }
};

export const updatePost = async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, tittle, textDescrip } = req.body;
  const picture = req.files && req.files.picture ? req.files.picture[0] : null;

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.TOKEN);
    const userId = decoded.userId;

    let params = {
      id,
      userId,
      tittle: tittle || null,
      textDescrip: textDescrip || null,
      picture: picture ? picture.buffer : Buffer.from(""),
    };

    if (picture) {
      const fileName = picture.name;
      const uploadPath = path.join(__dirname, "../../photos", fileName);

      await picture.mv(uploadPath);

      const fileData = fs.readFileSync(uploadPath);

      params.picture = fileData;
    }

    const postExist = await executeQuery(queries.getPost, { id });
    if (postExist.recordset.length === 0) {
      return res
        .status(400)
        .json({ message: `No existe el post con id: ${id}` });
    }

    await executeQuery(queries.updatePost, params);

    if (picture) {
      const currentPicture = postExist.recordset[0].picture;

      if (currentPicture && currentPicture !== picture.name) {
        const filePath = path.join(__dirname, "../../photos", currentPicture);
        fs.unlinkSync(filePath);
      }
    }

    res.status(201).json({ message: "Post actualizado exitosamente" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor al intentar actualizar el post");
    if (picture) {
      const filePath = path.join(__dirname, "../../photos", picture.name);
      fs.unlinkSync(filePath);
    }
  }
};

export const deltePost = async (req, res) => {
  console.log(req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.body;

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.TOKEN);
    const userId = decoded.userId;

    const params = {
      id,
      userId,
    };
    const postExist = await executeQuery(queries.getPost, { id });
    if (postExist.recordset.length === 0) {
      return res
        .status(400)
        .json({ message: `No existe el post con id: ${id}` });
    }

    await executeQuery(queries.deletePost, params);

    res.status(201).json({ message: "Post eliminado exitosamente" });
  } catch (err) {}
};

export const getPosts = async (req, res) => {
  try {
    const result = await executeQuery(queries.getPosts);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor al intentar crear el post");
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.TOKEN);
    const userId = decoded.userId;
    console.log(userId);
    const result = await executeQuery(queries.getUserPosts, { idUser: userId });
    res.status(200).json(result.recordset);


  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor al intentar buscar los posts");
  }
}