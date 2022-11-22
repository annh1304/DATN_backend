const util = require('util')
const mysql = require('mysql')
const pool = require('../../web_connect');

const tblFoodController = {

    getfood: (req, res) => {
        let sql = 'SELECT * FROM tblfood'
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(sql, (err, response) => {
                if (err) console.log(err)
                res.send(response)
            })
        })
    },
    getfoodPopular: (req, res) => {
        let sql = 'SELECT * FROM tblfood WHERE tblfood.STATUS = "hot"'
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(sql, (err, response) => {
                if (err) console.log(err)
                res.send(response)
            })
        })
    },
    getfoodFeatured: (req, res) => {
        let sql = 'SELECT * FROM tblfood WHERE tblfood.STATUS = "featured"'
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(sql, (err, response) => {
                if (err) console.log(err)
                res.send(response)
            })
        })
    },
    getfoodNew: (req, res) => {
        let sql = 'SELECT * FROM tblfood WHERE tblfood.STATUS = "new"'
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(sql, (err, response) => {
                if (err) console.log(err)
                res.send(response)
            })
        })
    },
}
module.exports = tblFoodController;