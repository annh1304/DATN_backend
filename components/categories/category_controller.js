const categoriesService = require('./category_service');
var mysql = require('mysql')
const pool = require('../../web_connect');


exports.getAll = async (req, res) => {
    if (!req.session || !req.session.user) {
        res.redirect('/dang-nhap');
    } else {
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected

            connection.query(`SELECT CATID, CATNAME, IMAGE FROM tblcategories`, (err, rows) => {
                connection.release();
                if (!err) {
                    res.render('categories_table', { rows });
                } else {
                    console.log(err);
                }
            })
        });

    }
}