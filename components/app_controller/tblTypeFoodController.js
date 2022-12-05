const util = require('util')
const mysql = require('mysql')
const pool = require('../../web_connect');

const tblTypeFoodController = {

    gettypefood: (req, res) => {
        const { type } = req.query;
        let sql = `SELECT * FROM tblfood WHERE CATID = ${type}`
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(sql, (err, response) => {
                if (err) console.log(err)
                res.send(response)
            })
        })
    },
}
module.exports = tblTypeFoodController;