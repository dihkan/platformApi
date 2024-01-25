import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import crypto from 'crypto'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.HOST,
    port :process.env.MYSQL_PORT,
    user: process.env.USERNAME,
    password : process.env.PASSWORD,
    database : process.env.DATABASE_NAME

})

export const loginControl = async(data) => {
    let connection;

    try{
        const pass = crypto.createHash("md5").update(data.password).digest("hex")
        connection = await pool.getConnection()
        const query = "SELECT * FROM uyeler WHERE uyeAdi =? and sifre = ?";
        const result = await connection.query(query , [data.username , pass])
        connection.release();
        return result[0]
    }catch(error)
    {
        console.log(error);
    }finally{
        if(connection){
            connection.release();
        }
    }

}
   
export const closePool = async () => {
    await pool.end();
}