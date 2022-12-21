const util = require('util')
const mysql = require('mysql')
const pool = require('../../web_connect');
const { connection } = require('mongoose');

const tblController = {

    // getcart: (req, res) => {
    //     let sql = 'SELECT FOODNAME, IMAGE, tblcart.QUANTITY, PRICE FROM `tblfood` INNER JOIN `tblcart` ON tblfood.FOODID = tblcart.FOODID WHERE tblcart.USERNAME = "dat009";'
    //     pool.getConnection((err, connection) => {
    //         if (err) throw err;
    //         connection.query(sql, (err, response) => {
    //             if (err) throw err
    //             res.send(response)
    //         })
    //     })
    // },
    postcart: (req, res) => {
        let data = req.body;
        console.log("aaaaaaa" + data.USERNAME);
        let sql = 'SELECT a.QUANTITY, b.IMAGE, b.FOODNAME, b.PRICE, a.FOODID FROM yummyfood.tblcart a,yummyfood.tblfood b WHERE a.FOODID=b.FOODID and a.USERNAME = ?'
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

    deletecart: (req, res) => {
        let data = req.body;
        let sql = 'DELETE FROM tblcart WHERE FOODID = ? AND USERNAME = ?'
        pool.getConnection((err, connection) => {
            if (err) throw err
            connection.query(sql, [data.FOODID, data.USERNAME], (err, response) => {
                if (err) throw err
                res.send({ message: 'Delete success!' })
            })
        })
    },

    updatecart: (req, res) => {
        let data = req.body;
        let sql = 'UPDATE tblcart SET QUANTITY = ? WHERE FOODID = ? AND USERNAME = ?'
        pool.getConnection((err, connection) => {
            if(err) throw err
            connection.query(sql, [data.QUANTITY, data.FOODID, data.USERNAME], (err, response) => {
                if (err) throw err
                res.send({message: 'Update success' })
            })
        })
    }

    
}
module.exports = tblController;