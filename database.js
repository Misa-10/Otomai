import { createConnection } from 'mysql';
import dotenv from 'dotenv';
dotenv.config();

// Create a connection to the MySQL database
const connection = createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 8889,
});

const fetchData = () => {
  return new Promise((resolve, reject) => {
    // Connect to the database
    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        reject(err);
        return;
      }
      console.log('Connected to MySQL as id ' + connection.threadId);

      // Query the database after the connection is established
      connection.query('SELECT * FROM `armor`', (err, rows) => {
        if (err) {
          connection.end();
          reject(err);
          return;
        }
        connection.end();
        resolve(rows);
      });
    });
  });
};

export default fetchData();
