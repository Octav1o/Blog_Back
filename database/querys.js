export const queries = {
    getUser: "SELECT name, lastname, mail, pfp FROM Usuario",
    insertUser: "INSERT INTO Usuario VALUES (name, lastname, mail, password, pfp, status)",
    userExist: "SEELCT * FROM Usuario WHERE mail = ?"
}