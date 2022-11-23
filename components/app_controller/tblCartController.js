const util = require('util')
const mysql = require('mysql')
const pool = require('../../web_connect');

const tblController = {

    getcart: (req, res) => {
        let sql = 'SELECT FOODNAME, IMAGE, tblcart.QUANTITY, PRICE FROM `tblfood` INNER JOIN `tblcart` ON tblfood.FOODID = tblcart.FOODID WHERE tblcart.USERNAME = "dat009";'
        db.query(sql, (err, response) => {
            if (err) console.log(err)
            res.send(response)
        })
    },
    postcart: (req, res) => {
        let data = req.body;
        let sql = 'SELECT * FROM yummyfood.tblcart a,yummyfood.tblfood b WHERE a.FOODID=b.FOODID and a.USERNAME =?'
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(sql, [data.USERNAME], (err, response) => {
                if (err) throw err
                res.send(response);
            })
        })
    },
    postitemcart: (req, res) => {
        let data = req.body;
        let sql = 'INSERT INTO tblcart SET ?'
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(sql, [data], (err, response) => {
                if (err) throw err
                res.send({ message: 'Insert success!' });
            })
        })
    },
    // deleteuser: (req, res) => {
    //     let sql = 'DELETE FROM user WHERE idUser = ?'
    //     db.query(sql, [req.params.idUser], (err, response) => {
    //         if (err) throw err
    //         res.send({ message: 'Delete success!' })
    //     })
    // },
    // updateuser: (req, res) => {
    //     let data = req.body;
    //     let idUser = req.params.idUser;
    //     let sql = 'UPDATE user SET ? WHERE idUser = ?'
    //     db.query(sql, [data, idUser], (err, response) => {
    //         if (err) throw err
    //         res.json({ message: 'Update success!' })
    //     })
    // },
}
module.exports = tblController;