const pool = require('../../web_connect');

exports.getAll = async (req, res) => {
    if (!req.session || !req.session.user) {
        res.redirect('/dang-nhap');
    } else {
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            connection.query(`SELECT  tblfood.FOODNAME, tblfood.PRICE, SUM(tblorderdetail.QUANTITY) AS 'SOLDQUANTITY' FROM (tblfood INNER JOIN tblorderdetail ON tblfood.FOODID = tblorderdetail.FOODID) INNER JOIN tblorder ON tblorderdetail.ORDERID = tblorder.ORDERID WHERE tblorder.ORDSTATUS = 1 GROUP BY tblfood.FOODID, tblfood.FOODNAME `, (err, rows) => {
                connection.release();
                if (!err) {
                    res.render('index', { rows });
                    console.log(rows);
                } else {
                    console.log(err);
                }
            })
        });

    }
}
