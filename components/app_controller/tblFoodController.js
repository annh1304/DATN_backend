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
    deleteFavourite: (req, res) => {
        const { USERNAME , FOODID } = req.body;
        let sql = `DELETE FROM tblfavourite WHERE USERNAME ='${USERNAME}' AND FOODID = ${FOODID}`;
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(sql, (err, response) => {
                if (err) throw err;
                    res.send({ message: 'Unliked' })
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
    },
    getComment: (req, res) => {
        const { FOODID } = req.query;
        const query = `SELECT * FROM tblcomment WHERE tblcomment.FOODID = '${FOODID}'`
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(query, (err, comment) => {
                if (err) throw err;
                res.send(comment)
            })
        })
    },
    postComment: (req, res) => {
        const { FOODID,USERNAME , COMMENT } = req.body;
        let sql = `INSERT INTO tblcomment (FOODID,USERNAME,COMMENT) VALUES (${FOODID},'${USERNAME}','${COMMENT}')`;
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(sql, (err, response) => {
                if (err) throw err;
                res.send({ message: 'Commented' })
            })
        })
    },

}
module.exports = tblFoodController;