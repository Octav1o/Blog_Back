import { config } from 'dotenv'
config();

export default {
    dbUser: process.env.DB_USER || 'sa',
    dbPassword: process.env.DB_PASSWORD || 'R0ckt@v10',
    dbServer: process.env.DB_SERVER || 'localhost',
    dbDatabase: process.env.DB_NAME || 'blog'
}