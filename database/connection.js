import sql from 'mssql';
const sqlConfig = {
    database: process.env.DB_NAME,
    server: 'localhost'
}
export async function getConnection() {
    try {
        await sql.connect(sqlConfig);
        
    } catch (e) {
        console.log(e);
    }
}