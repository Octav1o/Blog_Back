import sql from 'mssql';
import config from '../config'

const sqlConfig = {
    user: config.dbUser,
    password: config.dbPassword,
    server: config.dbServer,
    database: config.dbDatabase,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}


export async function getConnection() {
    try {
        const pool = await sql.connect(sqlConfig);
        return pool;
        
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export {sql}