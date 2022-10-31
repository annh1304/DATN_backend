const util = require('util')
const mysql = require('mysql')
const db = require('../../db');

const tblController = {
    getuser: (req, res) => {
        let sql = 'SELECT * FROM tblcart'
        db.query(sql, (err, response) => {
            if (err) console.log(err)
            res.send(response)
        })
    },
    postuser: (req, res) => {
        let data = req.body;
        let sql = 'INSERT INTO tblcart SET ?'
        db.query(sql, [data], (err, response) => {
            if (err) throw err
            res.send({ message: 'Insert success!' })
        })
    },
    deleteuser: (req, res) => {
        let sql = 'DELETE FROM user WHERE idUser = ?'
        db.query(sql, [req.params.idUser], (err, response) => {
            if (err) throw err
            res.send({ message: 'Delete success!' })
        })
    },
    updateuser: (req, res) => {
        let data = req.body;
        let idUser = req.params.idUser;
        let sql = 'UPDATE user SET ? WHERE idUser = ?'
        db.query(sql, [data, idUser], (err, response) => {
            if (err) throw err
            res.json({ message: 'Update success!' })
        })
    },
}
module.exports = tblController;