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
      const filePath = path.join(__dirname, "../photos", picture.name);
      fs.unlinkSync(filePath);
    }
  }
};



// export const updatePost = async (req, res) => {
//   console.log(req.body);
//   console.log(req.files);

//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { id, tittle, textDescrip } = req.body;
//   let pictureName;

//   try {
//     const token = req.headers.authorization.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.TOKEN);
//     const userId = decoded.userId;

//     // Obtener el post existente
//     const postExist = await executeQuery(queries.getPost, { id });
//     if (postExist.recordset.length === 0) {
//       return res
//         .status(400)
//         .json({ message: `No existe el post con id: ${id}` });
//     }

//     let params = {
//       id,
//       userId,
//       tittle: tittle || null,
//       textDescrip: textDescrip || null,
//       picture: postExist.recordset[0].picture, // Mantener la imagen existente si no se envía una nueva
//     };
//     // picture = req.files ? req.files.picture : '';

//     if (req.files && req.files.picture) {
//       const uploadedPicture = req.files.picture;
//       const fileName = uploadedPicture.name;
//       const uploadPath = path.join(__dirname, "../photos", fileName);

//       const fileSizeInBytes = uploadedPicture.data.length;
//       const maxSizeInBytes = 5242880;

//       if (fileSizeInBytes > maxSizeInBytes) {
//         return res.status(400).json({ message: "El tamaño del archivo excede el límite permitido" });
//       }

//       await uploadedPicture.mv(uploadPath);

//       const fileData = fs.readFileSync(uploadPath);

//       params.picture = fileData;
//       pictureName = fileName;

//       // Eliminar la imagen antigua si existe una nueva
//       // const currentPicture = postExist.recordset[0].picture;
//       // if (currentPicture && currentPicture !== picture.name) {
//       //   const filePath = path.join(__dirname, "../photos", currentPicture);
//       //   if (fs.existsSync(filePath)) {
//       //     fs.unlinkSync(filePath);
//       //   }
//       // }
//     }

//     await executeQuery(queries.updatePost, params);

//     res.status(201).json({ message: "Post actualizado exitosamente" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Error en el servidor al intentar actualizar el post");
//     // if (picture) {
//     //   const filePath = path.join(__dirname, "../photos", picture.name);
//     //   if (fs.existsSync(filePath)) {
//     //     fs.unlinkSync(filePath);
//     //   }
//     // }
//   }
// };


export const updatePost = async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, tittle, textDescrip } = req.body;
  let pictureName;

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.TOKEN);
    const userId = decoded.userId;

    // Obtener el post existente
    const postExist = await executeQuery(queries.getPost, { id });
    if (postExist.recordset.length === 0) {
      return res.status(400).json({ message: `No existe el post con id: ${id}` });
    }

    let params = {
      id,
      userId,
      tittle: tittle || postExist.recordset[0].tittle,
      textDescrip: textDescrip || postExist.recordset[0].textDescrip,
      picture: postExist.recordset[0].picture, // Mantener el nombre de la imagen existente si no se envía una nueva
    };

    // Verificar si se envió una nueva imagen
    if (req.files && req.files.picture) {
      const uploadedPicture = req.files.picture;
      const fileName = uploadedPicture.name;
      const uploadPath = path.join(__dirname, "../photos", fileName);

      // Guardar el archivo en el servidor
      await uploadedPicture.mv(uploadPath);

      // Actualizar el nombre de la imagen en los parámetros
      params.picture = fileName;
      pictureName = fileName;

      // Eliminar la imagen antigua si existe una nueva
      const currentPicture = postExist.recordset[0].picture;
      if (currentPicture && currentPicture !== pictureName) {
        const filePath = path.join(__dirname, "../photos", currentPicture);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    // Actualizar el post en la base de datos
    await executeQuery(queries.updatePost, params);

    res.status(201).json({ message: "Post actualizado exitosamente" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor al intentar actualizar el post");
    if (pictureName) {
      const filePath = path.join(__dirname, "../photos", pictureName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
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