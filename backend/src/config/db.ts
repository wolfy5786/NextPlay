import { createPool, PoolConnection, QueryResult } from 'mysql2';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = createPool({
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME
});

export async function getConnection() {
    return new Promise<PoolConnection>((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if (error) {
                return reject(error);
            }
            return resolve(connection);
        });
    });
}

export async function query(sql: string, values: any = []) {
    return new Promise<QueryResult>((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if (error) {
                return reject(error);
            }
            connection.query(sql, values, (err, res, fields) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res);
            })
        });
    });
}
