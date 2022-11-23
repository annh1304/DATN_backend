const util = require('util')
const mysql = require('mysql')
const pool = require('../../web_connect');

const tblOrderController = {

    updateorder: (req, res) => {
        const body = req.body;
        console.log(body);
        let username = body.USERNAME;
        let orderId = body.orderId;
        let sql = 'UPDATE tblorder SET ORDSTATUS = 2 WHERE USERNAME = ? AND ORDERID = ?'
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(sql, [username, orderId], (err, response) => {
                if (err) throw err
                res.send({ message: 'Order success!' })
            })
        })
    },

    getorder: (req, res) => {
        const { USERNAME } = req.query;
        const sql = `SELECT tblfood.FOODID , tblfood.FOODNAME , tblfood.IMAGE , tblorderdetail.QUANTITY , tblorderdetail.TOTAL FROM ((tblorderdetail INNER JOIN tblfood ON tblorderdetail.FOODID = tblfood.FOODID) INNER JOIN tblorder ON tblorderdetail.ORDERID = tblorder.ORDERID ) WHERE tblorder.ORDSTATUS = 1 AND tblorder.USERNAME = '${USERNAME}' `
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(sql, (err, response) => {
                if (err) throw err
                res.send(response)
            })
        })
    },

    //chitiet donhang
    orderHistoryDetail: (req, res) => {
        const { username, orderid } = req.query;
        const query = `SELECT tblfood.FOODNAME, tblfood.IMAGE, tblfood.PRICE, tblorderdetail.QUANTITY, tblorderdetail.TOTAL
        FROM (tblorderdetail INNER JOIN tblfood ON tblorderdetail.FOODID = tblfood.FOODID)
        INNER JOIN tblorder ON tblorderdetail.ORDERID = tblorder.ORDERID  WHERE tblorder.USERNAME = '${username}'  AND tblorder.ORDERID = ${orderid} AND tblorder.ORDSTATUS != 1 `;
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(query, (err, orederDetail) => {
                if (err) throw err
                res.send(orederDetail)
            })
        })
    },
    //lich su donhang
    orderHistory: (req, res) => {
        const { username } = req.query;
        const query = `SELECT tblorder.ORDERID, tblorder.ADDRESS, DATE(tblorder.ORDERTIME) AS 'TIME', SUM(tblorderdetail.TOTAL) AS 'TOTAL', tblorder.ORDSTATUS from tblorder INNER JOIN tblorderdetail ON tblorder.ORDERID = tblorderdetail.ORDERID WHERE USERNAME = '${username}' AND ORDSTATUS != 1 GROUP BY tblorder.ORDERID; `
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(query, (err, orderArr) => {
                if (err) throw err
                console.log(orderArr);
                res.send(orderArr)
            })
        })
    }
}
module.exports = tblOrderController;

// exports.updateInfor = async (req, res) => {
//     const body = req.body;
//     // const username = req.params.username;
//     // const query = `UPDATE tbluser
//     // SET FULLNAME = '${body.FULLNAME}', EMAIL = '${body.EMAIL}', ADDRESS = ${body.ADDRESS}
//     // , PHONENUMBER = ${body.PHONENUMBER}, DATEOFBIRTH = '${body.DATEOFBIRTH} WHERE USERNAME = ${body.USERNAME};`;
//     const query = `UPDATE tbluser
//     SET FULLNAME = '${body.FULLNAME}', EMAIL = '${body.EMAIL}', PHONENUMBER = '${body.PHONENUMBER}' WHERE USERNAME = '${body.USERNAME}';`;

//     pool.getConnection((err, connection) => {
//         if (err) throw err; // not connected

//         connection.query(query, (err, user) => {
//             connection.release();
//             // console.log('user', user);
//             if (!err) {

//             } else {
//                 // res.redirect('/dang-nhap');
//                 res.send(user);
//                 console.log(err);
//             }

//         });
//     });

//     // res.send(body);
// }

// exports.updatePassword = async (req, res) => {
//     const body = req.body;
//     // const username = req.params.username;
//     // const query = `UPDATE tbluser
//     // SET FULLNAME = '${body.FULLNAME}', EMAIL = '${body.EMAIL}', ADDRESS = ${body.ADDRESS}
//     // , PHONENUMBER = ${body.PHONENUMBER}, DATEOFBIRTH = '${body.DATEOFBIRTH} WHERE USERNAME = ${body.USERNAME};`;
//     pool.getConnection((err, connection) => {
//         if (err) throw err; // not connected

//         const query = `SELECT PASSWORD FROM tbluser WHERE USERNAME = '${body.USERNAME}'`;
//         connection.query(query, (err, oldpassword) => {
//             // connection.release();
//             // console.log('user', user);
//             if (err) {
//                 // query err
//                 console.log(err);
//             } else {
//                 const presentPassword = oldpassword[0].PASSWORD;
//                 const oldPassword = body.OLDPASSWORD;
//                 const newPassword = body.NEWPASSWORD;
//                 //giải mã hóa pass hay làm j đó bla blab;
//                 if (presentPassword.toString() === oldPassword.toString()) {

//                     const newQuery = `UPDATE tbluser
//                     SET PASSWORD = '${newPassword}' WHERE USERNAME = '${body.USERNAME}';`

//                     connection.query(newQuery, (err, response) => {
//                         if (err) {
//                             // query err
//                             console.log(err);
//                         } else {
//                             res.send({ message: 'succeed' });
//                         }
//                     });

//                 } else {
//                     res.send({ message: 'failed' });
//                 }
//             }

//         });
//     });

//     // res.send(body);
// }