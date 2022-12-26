const util = require('util')
const mysql = require('mysql')
const pool = require('../../web_connect');

const tblOrderController = {

    updateorder: (req, res) => {
        const data = req.body;
        if (data.VOUCHERCODE == "") {
            data.VOUCHERCODE = null;
        }
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query('INSERT INTO tblorder( `USERNAME`, `ADDRESS`, `PHONENUMBER`, `VOUCHERCODE`, `PAYMENTID`, `ORDSTATUS`) VALUES (?,?,?,?,1,2)', [data.USERNAME, data.ADDRESS, data.PHONENUMBER, data.VOUCHERCODE], (err, response) => {
                if (err) throw err
                res.send({ message: 'Insert order success!' });

                //Lấy orderid bằng cách truy vấn theo username và ORDERTIME (thời gian tạo) giảm dần bởi order dc thêm vào là mới nhất
                connection.query('SELECT ORDERID FROM tblorder WHERE tblorder.USERNAME = ? ORDER BY ORDERTIME DESC LIMIT 1 ', [data.USERNAME], function (err, orderid) {
                    if (err) throw err
                    // res.send({message: 'Get orderid success!'})
                    console.log("OrderId:", orderid[0].ORDERID);
                    //Từ orderid có được thực hiện query để add dữ liệu từ cart sang orderdetail trên orđerid
                    const sql = `INSERT INTO tblorderdetail (ORDERID, FOODID, QUANTITY, TOTAL) SELECT ${orderid[0].ORDERID}, tblcart.FOODID, tblcart.QUANTITY, tblcart.QUANTITY*tblfood.PRICE AS TOTAL FROM (tblcart INNER JOIN tblfood ON tblcart.FOODID = tblfood.FOODID) WHERE tblcart.USERNAME = '${data.USERNAME}'`;
                    connection.query(sql, function (err, result) {
                        if (err) throw err
                        // res.send({
                        //     message: 'Add to Order Succes!'
                        // });

                        //Xóa cart người dùng
                        connection.query('DELETE FROM tblcart WHERE USERNAME = ? ', [data.USERNAME], function (err, result) {
                            if (err) throw err
                            // res.send({message: 'Delete Cart Succes!' });
                        })
                    })
                })
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
                // console.log(orderArr);
                res.send(orderArr)
            })
        })
    },

    //Voucher
    postvoucher: (req, res) => {
        const { USERNAME, VOUCHERCODE } = req.body;
        console.log('test2', USERNAME);
        console.log('test2', VOUCHERCODE);
        let sql = 'SELECT tblvoucher.VOUCHERCODE, tblvoucher.VOUCHER, tblvoucher.QUANTITY FROM tblvoucher RIGHT JOIN tblorder ON tblvoucher.VOUCHERCODE != tblorder.VOUCHERCODE WHERE USERNAME = ? AND tblvoucher.VOUCHERCODE = ? AND tblvoucher.QUANTITY > 0'
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(sql, [USERNAME, VOUCHERCODE], (err, response) => {
                if (err) throw err
                res.send(response)
            })
        })
    },

    updatevoucher: (req, res) => {
        let data = req.body;
        let sql = 'UPDATE tblvoucher SET QUANTITY = ? WHERE VOUCHER = ?'
        pool.getConnection((err, connection) => {
            if (err) throw err
            connection.query(sql, [data.QUANTITY, data.VOUCHER], (err, response) => {
                if (err) throw err
                res.send({ message: 'Update success' })
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