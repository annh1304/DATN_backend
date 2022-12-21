const util = require('util')
const mysql = require('mysql')
const pool = require('../../web_connect');

const tblFoodController = {

    getfood: (req, res) => {
        let sql = "SELECT * FROM tblfood WHERE STATUS != 'removed'"
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(sql, (err, response) => {
                if (err) console.log(err)
                res.send(response)
            })
        })
    },
    //hot(popular), featured, new
    foodByStatus: (req, res) => {
        const { status } = req.query;
        let sql = `SELECT * FROM tblfood WHERE tblfood.STATUS = "${status}"`
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
        const query = `SELECT tblfood.FOODID , tblfood.FOODNAME , tblfood.PRICE , tblfood.IMAGE FROM ((tblfavourite INNER JOIN tblfood ON tblfavourite.FOODID = tblfood.FOODID) INNER JOIN tbluser ON tblfavourite.USERNAME = tbluser.USERNAME ) WHERE tblfood.STATUS != "removed" AND tbluser.USERNAME = '${USERNAME}'`;
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
        const { USERNAME, FOODID } = req.body;
        let sql = `DELETE FROM tblfavourite WHERE USERNAME ='${USERNAME}' AND FOODID = ${FOODID}`;
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(sql, (err, response) => {
                if (err) throw err;
                res.send({ message: 'Unliked' })
            })
        })
    },

    checkFavourite: async (req, res) => {
        let msg = {};
        const { FOODID, USERNAME } = req.query;

        const sql = `SELECT * FROM tblfavourite WHERE USERNAME ='${USERNAME}' AND FOODID = ${FOODID}`
        await pool.getConnection(async (err, connection) => {
            if (err) throw err;

            await connection.query(sql, async (err, response) => {
                if (err) throw err;
                if (response.length == 0) {
                    // res.send({ MESSAGE: 'Not liked' })
                    msg.MESSAGE = 'Not liked';
                } else if (response[0].USERNAME === USERNAME) {
                    // res.send({ MESSAGE: 'Liked' })
                    msg.MESSAGE = 'Liked';
                }

                const query = `SELECT tblorder.ORDERID, tblorder.USERNAME, tblorder.ORDSTATUS 
                FROM tblorder INNER JOIN tblorderdetail on tblorder.ORDERID = tblorderdetail.ORDERID 
                WHERE ORDSTATUS=3 AND tblorder.USERNAME = '${USERNAME}' AND tblorderdetail.FOODID = ${FOODID}`;

                await connection.query(query, async (err, response) => {
                    if (err) throw err;
                    if (response.length == 0) {
                        msg.MESSAGE2 = 'Havent bought';
                    } else if (response[0].USERNAME === USERNAME) {
                        msg.MESSAGE2 = 'Bought';
                    }

                    const query2 = `SELECT QUANTITY FROM tblcart WHERE USERNAME = '${USERNAME}' AND FOODID = ${FOODID}`;

                    await connection.query(query2, (err, response) => {
                        if (err) throw err;
                        if (response.length == 0) {
                            msg.MESSAGE3 = 'Not in cart';
                        } else if (response[0].QUANTITY != 0) {
                            msg.MESSAGE3 = 'In cart';
                        }
                        // console.log(msg)
                        res.send(msg);
                    })
                    // res.send(msg);
                })

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
        const { FOODID, USERNAME, COMMENT } = req.body;
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