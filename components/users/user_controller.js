var express = require('express');
var router = express.Router();
const userService = require('./user_service');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//connect to mysql;
const pool = require('../../web_connect');


//post Login web;
// gọi từ routerIndex;
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            connection.query(`SELECT USERNAME, PASSWORD FROM tbluser WHERE EMAIL = '${email}' AND ROLE = 0`, (err, user) => {
                connection.release();
                if (err) throw err;

                if (user.length > 0) {
                    const check = bcrypt.compareSync(password, user[0].PASSWORD);
                    if (check) {
                        req.session.user = user[0];
                        console.log('.....', req.session.user);
                        res.redirect('/');
                    } else {
                        res.redirect('/dang-nhap');
                        console.log('err', 'dang nhap k thanh cong');
                    }
                } else {
                    res.redirect('/dang-nhap');
                    console.log('err', 'dang nhap k thanh cong');
                }
            });

        });
    } catch (error) {
        throw new Error('error');
    }
}
//đổ lên bảng user
exports.getAll = async (req, res) => {
    if (!req.session || !req.session.user) {
        res.redirect('/dang-nhap');
    } else {
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            const page = req.query.page;
            const skip = (parseInt(page) - 1) * 5;

            connection.query(`SELECT USERNAME, EMAIL, STATUS, IMAGE FROM tbluser WHERE ROLE = 1 LIMIT 5 OFFSET ${skip}`, (err, rows) => {
                connection.release();
                if (!err) {
                    rows = rows.map(row => {
                        row = { ...row };
                        if (row.STATUS.toString() == 'banned') {
                            row.STATUS = true;
                        } else {
                            row.STATUS = false;
                        }
                        return row;
                    });
                    const usernameAdmin = req.session.user.USERNAME;
                    res.render('user_table', { rows, usernameAdmin });
                } else {
                    console.log(err);
                }
            })
        });
    }
}
//chi tiết user
exports.getById = async (req, res) => {
    if (!req.session || !req.session.user) {
        res.redirect('/dang-nhap');
    } else {
        const username = req.params.username;
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected

            connection.query(`SELECT USERNAME, FULLNAME, EMAIL, ADDRESS, IMAGE, PHONENUMBER, DATEOFBIRTH, STATUS FROM tbluser WHERE USERNAME = '${username}' `, (err, user) => {
                connection.release();
                if (!err) {
                    user = user.map(u => {
                        u = { ...u };
                        if (u.STATUS.toString() == 'banned') {
                            u.STATUS = true;
                        } else {
                            u.STATUS = false;
                        }
                        return u;
                    });
                    const usernameAdmin = req.session.user.USERNAME;
                    // res.render('', { user });
                    console.log('user-detail', { user, usernameAdmin });
                    res.render('user_detail', { user, usernameAdmin });
                } else {
                    console.log(err);
                }
            })
        });
    }
}

exports.updateStatus = async (req, res) => {
    const { username, stat } = req.body;
    const query = `UPDATE tbluser SET STATUS = '${stat}' WHERE USERNAME = '${username}'`;

    pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query(query, (err, response) => {
            res.redirect('/nguoi-dung?page=1');
        })
    })
}

//mobile











// //local
// exports.login = async (username, password) =>{
//     try {
//         return await userService.login(username, password);
//     } catch (error) {
//         throw new Error('error');
//     }
// }


// //api
// exports.signup = async (username, password) =>{
//     const check = await userService.checkUsername(username);
//     try {
//         if(check){
//             throw new Error('Tên tài khoản đã tồn tại!');
//             return;
//         }
//         //check document for detail | hashPassword => mã hóa pass(random)
//         const hashPassword = await bcrypt.hashSync(password, 10);
//         return await userService.signup(username, hashPassword);
//     } catch (error) {
//         throw new Error(error.message ||'Lỗi đăng nhập');
//     }
// }

// exports.signin = async (username, password)=>{
//     try {
//         const user = await userService.signin(username);
//         if (user){
//             const check = await bcrypt.compareSync(password, user.password);
//             if (check){
//                 //đăng nhập tạo token (user name là id của user)
//                 const token = jwt.sign({ username:user.username, _id:user._id},
//                      'secret', {expiresIn:30 * 24 * 60 * 60});//30 ngày
//                 //tạo refresh token 90 days (expires)
//                 //return token;
//                 return token;
//             }else{
//                 throw new Error('Đăng nhập không thành công');//sai mật khẩu
//             }
//         }else{
//             throw new Error(error.message ||'Không tìm thấy tài khoản');
//         }
//     } catch (error) {
//         throw new Error(error.message ||'Đăng nhập không thành công!');
//     }
// }
// //đưa token lên sv lấy user info
// exports.getInfo = async (token) =>{
//     try {
//         const decoded = jwt.verify(token, 'secret');
//         console.log(decoded);
//         return await userService.getInfo(decoded._id);
//     } catch (error) {
//         console.log(error);
//         throw new Error(error.message || 'lỗi');
//     }
// }

