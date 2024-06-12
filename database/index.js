import  {getConnection,} from './connection';
import sql from 'mssql';
export const executeQuery = async (query, params) => {
    try {
        const pool = await getConnection();
        const request = pool.request();
        
        // Añade cada parámetro al objeto de solicitud
        for (let key in params) {
            if (key === 'pfp' && params[key] !== null) {
                // Convierte 'pfp' a un Buffer antes de pasarlo a la consulta
                request.input(key, sql.VarBinary(sql.MAX), Buffer.from(params[key].buffer));
            } else {
                request.input(key, params[key]);
            }
        }
        
        const result = await request.query(query);
        return result;
        
    } catch (error) {
        console.error(error)
        throw error;
    }
};

export { queries } from './querys';