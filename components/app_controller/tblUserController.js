const util = require('util')
const mysql = require('mysql')
const pool = require('../../web_connect');

const tblUserController = {

    // getuser: (req, res) => {
    //     let sql = 'SELECT * FROM tbluser'
    //     db.query(sql, (err, response) => {
    //         if (err) console.log(err)
    //         res.send(response)
    //     })
    // },

    // postuser: (req, res) => {
    //     let data = req.body;
    //     let sql = 'INSERT INTO tbluser SET ?'
    //     db.query(sql, [data], (err, response) => {
    //         if (err) throw err
    //         res.send({ message: 'Insert success!' })
    //     })
    // },

    getuser: (req, res) => {
        let sql = 'SELECT * FROM tbluser'
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(sql, (err, response) => {
                if (err) console.log(err)
                res.send(response)
            })
        })
    },

    postuser: (req, res) => {
        let data = req.body;
        let sql = 'INSERT INTO tbluser SET ?'
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(sql, [data], (err, response) => {
                if (err) throw err
                res.send({ message: 'Insert success!' })
            })
        })
    },

    updateInfor: async (req, res) => {
        const body = req.body;
        // const username = req.params.username;
        // const query = `UPDATE tbluser
        // SET FULLNAME = '${body.FULLNAME}', EMAIL = '${body.EMAIL}', ADDRESS = ${body.ADDRESS}
        // , PHONENUMBER = ${body.PHONENUMBER}, DATEOFBIRTH = '${body.DATEOFBIRTH} WHERE USERNAME = ${body.USERNAME};`;
        const query = `UPDATE tbluser
        SET FULLNAME = '${body.FULLNAME}', EMAIL = '${body.EMAIL}', PHONENUMBER = '${body.PHONENUMBER}', ADDRESS = '${body.ADDRESS}', DATEOFBIRTH = '${body.DATEOFBIRTH}' WHERE USERNAME = '${body.USERNAME}';`;

        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected

            connection.query(query, (err, user) => {
                connection.release();
                // console.log('user', user);
                if (!err) {

                } else {
                    // res.redirect('/dang-nhap');
                    res.send(user);
                    console.log(err);
                }

            });
        });

        // res.send(body);
    },
    updatePassword: async (req, res) => {
        const body = req.body;
        // const username = req.params.username;
        // const query = `UPDATE tbluser
        // SET FULLNAME = '${body.FULLNAME}', EMAIL = '${body.EMAIL}', ADDRESS = ${body.ADDRESS}
        // , PHONENUMBER = ${body.PHONENUMBER}, DATEOFBIRTH = '${body.DATEOFBIRTH} WHERE USERNAME = ${body.USERNAME};`;
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected

            const query = `SELECT PASSWORD FROM tbluser WHERE USERNAME = '${body.USERNAME}'`;
            connection.query(query, (err, oldpassword) => {
                // connection.release();
                // console.log('user', user);
                if (err) {
                    // query err
                    console.log(err);
                } else {
                    const presentPassword = oldpassword[0].PASSWORD;
                    const oldPassword = body.OLDPASSWORD;
                    const newPassword = body.NEWPASSWORD;
                    //giải mã hóa pass hay làm j đó bla blab;
                    if (presentPassword.toString() === oldPassword.toString()) {

                        const newQuery = `UPDATE tbluser
                        SET PASSWORD = '${newPassword}' WHERE USERNAME = '${body.USERNAME}';`

                        connection.query(newQuery, (err, response) => {
                            if (err) {
                                // query err
                                console.log(err);
                            } else {
                                res.send({ message: 'succeed' });
                            }
                        });

                    } else {
                        res.send({ message: 'failed' });
                    }
                }

            });
        });

        // res.send(body);
    }

}
module.exports = tblUserController;

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