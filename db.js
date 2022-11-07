'use strict';
const mysql = require('mysql');

const db = mysql.createConnection({
  host: "localhost",
  port: "5000",
  user: "root",
  password: "",
  database: "yummyfood",
});
module.exports = db