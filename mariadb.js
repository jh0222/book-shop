// Get the client
const mariadb = require('mysql2');

// Create the connection to database
const connection = mariadb.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'Bookshop',
  dateStrings: true
})

module.exports = connection