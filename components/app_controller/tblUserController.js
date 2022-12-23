const util = require('util')
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const pool = require('../../web_connect');
const ip = require('../../constants').IP;
const baseIp = require('../../constants').baseip;
let constant = require('../../constants');
const bcrypt = require('bcryptjs');
//token reset password
let tempToken;

//đọc file tokens;
const fs = require('fs');
const path = require('path');

//đọc file tokens;
// let rawdata = fs.readFileSync(path.resolve(__dirname, '../../tokens.json'));
// let tokens = JSON.parse(rawdata);
// console.log(tokens[0].username);

const tblUserController = {
    //dang-nhap
    postLogin: async (req, res) => {
        const { EMAIL, PASSWORD } = req.body;
        const sql = `SELECT * FROM tbluser WHERE EMAIL = '${EMAIL}' AND ROLE = 1`;

        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(sql, (err, response) => {
                if (err) console.log(err)
                if (response.length == 0) {
                    res.send({ 'USERNAME': 'Wrong email or password' });
                } else {
                    const check = bcrypt.compareSync(PASSWORD, response[0].PASSWORD);
                    console.log(check);
                    if (check) {
                        if (response[0].STATUS === "banned") { res.send({ 'USERNAME': 'banned' }) }
                        else { res.send(response[0]); }
                    } else {
                        res.send({ 'USERNAME': 'Wrong email or password' });
                    }
                }
            })
        })
    },
    //dang-ky
    postuser: async (req, res) => {
        const { USERNAME, FULLNAME, EMAIL, PASSWORD } = req.body;
        const hashPassword = await bcrypt.hashSync(PASSWORD, 10);
        let sql = `INSERT INTO tbluser (USERNAME, FULLNAME, EMAIL, PASSWORD) VAlUES ('${USERNAME}', '${FULLNAME}', '${EMAIL}', '${hashPassword}')`;

        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(`SELECT USERNAME from tbluser WHERE USERNAME = '${USERNAME}'`, (err, response) => {
                if (err) throw err
                if (response.length == 0) {

                    connection.query(`SELECT EMAIL from tbluser WHERE EMAIL = '${EMAIL}'`, (err, response) => {
                        if (err) throw err
                        if (response.length == 0) {

                            connection.query(sql, (err, response) => {
                                if (err) throw err
                                res.send({ USERNAME: 'Sign Up Successful' })
                            })

                        } else if (response[0].EMAIL === EMAIL) {
                            res.send({ USERNAME: 'Email existed' })
                        }

                    })

                } else if (response[0].USERNAME === USERNAME) {
                    res.send({ USERNAME: 'Username existed' })
                }

            })
        })

    },
    //lay thong tin user
    getUserInfor: (req, res) => {
        const username = req.query.username;
        let query = `SELECT * FROM tbluser WHERE USERNAME = '${username}'`;
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected

            connection.query(query, (err, user) => {
                connection.release();
                // console.log('user', user);
                if (!err) {
                    console.log(user);
                    res.send(user[0]);
                    // res.json(user);
                } else {
                    // res.redirect('/dang-nhap');

                }

            });
        });
    },
    //cap nhat thong tin
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
    //cap nhat mat khau
    updatePassword: async (req, res) => {
        const body = req.body;
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
                    const check = bcrypt.compareSync(oldPassword, presentPassword);
                    if (check) {

                        const newQuery = `UPDATE tbluser
                        SET PASSWORD = '${bcrypt.hashSync(newPassword, 10)}' WHERE USERNAME = '${body.USERNAME}';`

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
    },
    //gui email (POST)
    reqMail: async (req, res) => {
        const { EMAIL } = req.body;
        let fullname;
        let username;

        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            const query = `SELECT tbluser.USERNAME, tbluser.FULLNAME FROM tbluser WHERE EMAIL = '${EMAIL}' AND ROLE = 1`;
            connection.query(query, (err, name) => {
                if (err) {
                    // query err
                    console.log(err);
                } else {
                    if (name[0]) {
                        fullname = name[0].FULLNAME;
                        username = name[0].USERNAME;
                        //tạo refresh token 90 days (expires)
                        const token = jwt.sign({ username: username, email: EMAIL },
                            'secret', { expiresIn: 5 * 60 });//đơn vị second

                        mailSender(EMAIL, fullname, username, token);
                        res.send({ message: 'Request sent, please check your email !' });
                    } else {
                        res.send({ message: 'Account doesn\'t exist !' });
                    }
                }
            });
        });
    },
    //form dien mat khau moi (GET)
    newPwForm: (req, res) => {
        const { username, token } = req.params;
        const check = checkToken(token);
        if (!check) {
            res.render('reset_password', check);
        } else {
            if (tempToken === token) {
                res.render('reset_password', false);
            } else { res.render('reset_password', { check, token }); }
        }
    },
    //dat mat khau moi (POST)
    newPwSend: async (req, res) => {
        const { newpassword, token } = req.body;
        const hashPassword = await bcrypt.hashSync(newpassword, 10);
        let check = checkToken(token[0]);
        console.log(check);
        if (!check) {
            res.render('reset_password_result', { result: false });
        } else {
            if (tempToken === token[0]) {
                res.render('reset_password', false);
            } else {
                console.log(newpassword);
                const query = `UPDATE tbluser SET PASSWORD = '${hashPassword}' WHERE USERNAME = '${check.username}'`;
                pool.getConnection((err, connection) => {
                    if (err) throw err;
                    connection.query(query, (err, response) => {
                        if (err) throw err;
                        tempToken = token[0];
                        res.render('reset_password_result', { result: true });
                    })
                })
            }
        }
    },
    // gui token tu user
    sendToken: async (req, res) => {
        const { TOKEN, USERNAME } = req.body;
        // tokenArray.push({ token: TOKEN, username: USERNAME });
        setChangeToken({ token: TOKEN, username: USERNAME });
        // console.log(constant.tokenArray);
        // console.log(constant.getTokenObjectByUsername(0));
        res.send(USERNAME);
    }


}
module.exports = tblUserController;

//token array onchange
function setChangeToken(tokenObject) {

    let checkExisted = false;
    //đọc file tokens;
    let rawdata = fs.readFileSync(path.resolve(__dirname, '../../tokens.json'));
    let tokens = JSON.parse(rawdata);


    console.log("check22")

    tokens = tokens.map(tokenO => {
        let t = {
            token: tokenO.token,
            username: tokenO.username
        };
        if (t.token.toString() === tokenObject.token.toString()) {
            checkExisted = true;
            t.username = tokenObject.username;
        }
        return t;
    });

    if (!checkExisted) { tokens.push(tokenObject) }

    let json = JSON.stringify(tokens); //convert it back to json
    fs.writeFile('./tokens.json', json, 'utf8', function (err) {
        if (err) throw err;
    }); // write it back

    // if (!checkExisted) { constant.tokenArray.push(tokenObject) }
}
//gửi mail
function mailSender(email, fullname, username, token) {
    const ipSend = ip + `/${username}/${token}`;
    var transporter = nodemailer.createTransport({ // config mail server
        service: 'Gmail',
        auth: {
            user: 'anh130422@gmail.com',
            pass: 'ffrztgecjavsxkzd'
        }
    });
    var message = {
        from: "anh130422@gmail.com",
        to: `${email}`,
        subject: "Link to reset your password",
        // text: "Hello, " + `${name}` + ", You recieved message from Yummyfood",
        // html: `<a href=${ip}> ababababba </a>`
        html: `<p>Hello,` + `${fullname}` + `</p><ul>
        <li>You recieved message from Yummyfood</li>
        <li>This link will expire in 5minute</li>
        <li><a href=${ipSend}>Reset my password</a></li></ul>`
    };

    transporter.sendMail(message, function (err, info) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            console.log('Message sent: ' + info.response);
            res.redirect('/');
        }
    });
}
//giải token
function checkToken(token) {
    try {
        const decoded = jwt.verify(token, 'secret');
        decoded.notExpired = true;
        return decoded;
    } catch (error) {
        return false;
    }
}
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