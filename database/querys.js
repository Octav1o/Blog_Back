
export const queries = {
    getUser: "SELECT name, lastname, mail, pfp FROM Usuario",
    insertUser: "INSERT INTO Usuario (name, lastname, mail, password, pfp, status) VALUES (@name, @lastname, @mail, @password, @pfp, @status)",
    userExist: "SELECT * FROM Usuario WHERE mail = @mail"
}
