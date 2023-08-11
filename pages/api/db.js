import mysql from "mysql2/promise";

// Function to import
// `query` is the formated SQL query
// `values` is an array with the associated values
// It returns the results array 
export default async function executeQuery({ query, values }) {
    // Try to connect to the database using .env.local file
    try {
        const db = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT,
            database: process.env.MYSQL_DATABASE,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
        });

        const [results] = await db.query(query, values);

        await db.end();
        return results;
    } catch {
        await db.end();
        return {}
    }
}