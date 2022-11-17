const util = require('util')
const mysql = require('mysql')
const pool = require('../../web_connect');

const tblTypeFoodController = {

    gettypefood1: (req, res) => {
        let sql = 'SELECT * FROM tblfood WHERE CATID = 1'
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(sql, (err, response) => {
                if (err) console.log(err)
                res.send(response)
            })
        })
    },
    gettypefood2: (req, res) => {
        let sql = 'SELECT * FROM tblfood WHERE CATID = 2'
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(sql, (err, response) => {
                if (err) console.log(err)
                res.send(response)
            })
        })
    },
    gettypefood3: (req, res) => {
        let sql = 'SELECT * FROM tblfood WHERE CATID = 3'
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(sql, (err, response) => {
                if (err) console.log(err)
                res.send(response)
            })
        })
    },
    gettypefood4: (req, res) => {
        let sql = 'SELECT * FROM tblfood WHERE CATID = 4'
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