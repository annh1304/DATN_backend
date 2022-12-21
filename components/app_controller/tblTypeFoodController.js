const util = require('util')
const mysql = require('mysql')
const pool = require('../../web_connect');

const tblTypeFoodController = {

    gettypefood: (req, res) => {
        const { type } = req.query;
        let sql = "";
        if (type == 2) {
            sql = `SELECT * FROM tblfood WHERE STATUS !='removed' AND (CATID = 2 OR CATID = 4)`;
        } else if (type == 4) {
            sql = `SELECT * FROM tblfood WHERE STATUS !='removed' AND CATID = 5`;
        } else {
            sql = `SELECT * FROM tblfood WHERE STATUS !='removed' AND CATID = ${type}`;
        }

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