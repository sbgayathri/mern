import 'dotenv/config';
import mysql from 'mysql2';  


const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});


db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1); 
    }
    console.log('Connected to MySQL database.');
});


export default db;
