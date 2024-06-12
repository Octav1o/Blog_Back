import  {getConnection,} from './connection';

export const executeQuery = async (query, params) => {
    try {
        const pool = await getConnection();
        return new Promise ((resolve, reject) => {
            pool.query(query, params, (error, results) => {
               if (error) {
                   reject(error);
               } else {
                   resolve(results);
               }
            });
       });
    } catch (error) {
        console.error(error)
        throw error;
    }
};

export { queries } from './querys';