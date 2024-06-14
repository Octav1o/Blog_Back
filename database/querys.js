
export const queries = {

    //querys de los usuarios
    getUser: "SELECT name, lastname, mail, pfp FROM Usuario",
    insertUser: "INSERT INTO Usuario (name, lastname, mail, password, pfp, status) VALUES (@name, @lastname, @mail, @password, @pfp, @status)",
    userExist: "SELECT * FROM Usuario WHERE mail = @mail",
    updateUser: "UPDATE Usuario SET name = @name, lastname = @lastname, password = @password, pfp = @pfp WHERE mail = @mail",



    //querys de los posts
    insertPost: "INSERT INTO Posts (tittle, textDescrip, picture) OUTPUT INSERTED.id VALUES (@tittle, @textDescrip, @picture)",
    updatePost: "UPDATE Posts SET tittle = @tittle, textDescrip = @textDescrip, picture = @picture WHERE id = @id",
    deletePost: "DELETE FROM Posts WHERE id = @id",
    getPost: "SELECT * FROM Posts WHERE id = @id",
    getPosts: "SELECT * FROM Posts", //este no requiere token

    //querys tabla UsuarioPost
    insertUserPost: "INSERT INTO UserPosts (idUser, idPost) VALUES (@idUser, @idPost)",
    // getUserPost: "SELECT * FROM UsuarioPost WHERE id_user = @id_user",
    // deleteUserPost: "DELETE FROM UsuarioPost WHERE id_user = @id_user AND id_post = @id_post",
}
