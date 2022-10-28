const categoryModel = require('./category_model');
var mysql = require('mysql');

//connect to mysql;
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log('Connected as ID ' + connection.threadId);
});

const getAll = async () => {
    // return categories;
    return await categoryModel.find({});
}

module.exports = { getAll };

