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
    getFavouriteList: (req, res) => {
        const { USERNAME } = req.query;
        const query = `SELECT tblfood.FOODID , tblfood.FOODNAME , tblfood.PRICE , tblfood.IMAGE FROM ((tblfavourite INNER JOIN tblfood ON tblfavourite.FOODID = tblfood.FOODID) INNER JOIN tbluser ON tblfavourite.USERNAME = tbluser.USERNAME ) WHERE tbluser.USERNAME = '${USERNAME}'`;
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(query, (err, favouriteList) => {
                if (err) throw err;
                res.send(favouriteList);
            })
        })
    },
    postFavourite: (req, res) => {
        const { FOODID, USERNAME } = req.body;
        console.log('testtt', FOODID);
        let data = req.body;
        let sql = 'INSERT INTO tblfavourite SET ?';
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(sql, [data], (err, response) => {
                if (err) throw err;
                res.send({ message: 'Loved this!' })
            })
        })
    },
    checkFavourite: (req, res) => {
        const { FOODID, USERNAME } = req.query;
        const sql = `SELECT * FROM tblfavourite WHERE USERNAME ='${USERNAME}' AND FOODID = ${FOODID}`
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(sql, (err, response) => {
                if (err) throw err;
                if (response.length == 0) {
                    res.send({ message: 'Not liked' })
                } else if (response[0].USERNAME === USERNAME) {
                    res.send({ message: 'Liked' })
                }
            })
        })
    }

}
module.exports = tblFoodController;