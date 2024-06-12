
export const queries = {
    getUser: "SELECT name, lastname, mail, pfp FROM Usuario",
    insertUser: "INSERT INTO db.Usuario (name, lastname, mail, password, pfp, status) VALUES (?, ?, ?, ?, ?, ?) ",
    userExist: "SEELCT * FROM Usuario WHERE mail = ?"
}
