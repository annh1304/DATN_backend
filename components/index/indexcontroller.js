const pool = require('../../web_connect');

// exports.getAll = async (req, res) => {
//     if (!req.session || !req.session.user) {
//         res.redirect('/dang-nhap');
//     } else {
//         pool.getConnection((err, connection) => {
//             if (err) throw err; // not connected
//             connection.query(`SELECT  tblfood.FOODNAME FROM (tblfood INNER JOIN tblorderdetail ON tblfood.FOODID = tblorderdetail.FOODID) INNER JOIN tblorder ON tblorderdetail.ORDERID = tblorder.ORDERID WHERE tblorder.ORDSTATUS = 1 GROUP BY tblfood.FOODID, tblfood.FOODNAME LIMIT 1`, (err, rows) => {
//                 connection.release();
//                 if (!err) {
//                     connection.query(`SELECT CATID, CATNAME FROM tblcategories`, function (err, categories) {
//                         if (err) {
//                             return console.log('error: ' + err.message);
//                         }
//                         res.render('index', { rows, categories });

//                     }); 
//                     // res.render('index', { rows, categories });
//                     console.log(rows, categories);
//                 } else {
//                     console.log(err);
//                 }
//             })
//         });

//     }
// }
exports.getAll = async (req, res) => {
    if (!req.session || !req.session.user) {
        res.redirect('/dang-nhap');
    } else {
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            connection.query(`SELECT  tblfood.FOODNAME FROM (tblfood INNER JOIN tblorderdetail ON tblfood.FOODID = tblorderdetail.FOODID) INNER JOIN tblorder ON tblorderdetail.ORDERID = tblorder.ORDERID WHERE tblorder.ORDSTATUS = 3 GROUP BY tblfood.FOODID, tblfood.FOODNAME LIMIT 1`, (err, food) => {
                if (err) {
                    return console.log('error: ' + err.message);
                }
                connection.query(`SELECT SUM(tblorderdetail.TOTAL) AS 'MONTHTOTAL' FROM tblorderdetail INNER JOIN tblorder ON tblorderdetail.ORDERID = tblorder.ORDERID WHERE tblorder.ORDSTATUS = 3`, (err, money) => {
                    if (err) {
                        return console.log('error: ' + err.message);

                    }
                    connection.query(`SELECT COUNT (tblorder.ORDERID) AS 'COUNTOTAL' FROM tblorder  WHERE tblorder.ORDSTATUS = 3`, (err, count) => {
                        if (err) {
                            return console.log('error: ' + err.message);
                        }
                        connection.query(`SELECT  tblfood.FOODNAME, SUM(tblorderdetail.QUANTITY) AS 'SOLDQUANTITY' FROM (tblfood INNER JOIN tblorderdetail ON tblfood.FOODID = tblorderdetail.FOODID) INNER JOIN tblorder ON tblorderdetail.ORDERID = tblorder.ORDERID WHERE tblorder.ORDSTATUS = 3 GROUP BY tblfood.FOODID, tblfood.FOODNAME ORDER BY SUM(tblorderdetail.QUANTITY) DESC`, (err, data) => {
                            if (err) {
                                return console.log('error: ' + err.message);
                            }
                            
                            var list = JSON.stringify(data);
                            var json = JSON.parse(list);
                            console.log(json);
                            res.render('index', {
                                food,
                                money,
                                count,
                                json
    
                            });
                        });
                       
                        

                    });


                });
            });
        });
    }
}

// exports.getChartData = async (req, res) => {
    
//         pool.getConnection((err, connection) => {
//             if (err) {
//                 throw err;
//             } else {
//                 connection.query(`SELECT  tblfood.FOODNAME, SUM(tblorderdetail.QUANTITY) AS 'SOLDQUANTITY' FROM (tblfood INNER JOIN tblorderdetail ON tblfood.FOODID = tblorderdetail.FOODID) INNER JOIN tblorder ON tblorderdetail.ORDERID = tblorder.ORDERID WHERE tblorder.ORDSTATUS = 3 GROUP BY tblfood.FOODID, tblfood.FOODNAME ORDER BY SUM(tblorderdetail.QUANTITY) DESC`, (err, data) => {
//                     if (err) {
//                         return console.log('error: ' + err.message);
//                     }
//                     // var d = JSON.parse(JSON.stringify(data))
//                     // console.log(d);
//                     // return d;
//                     // res.render('index', {
//                     //     data
//                     // });

//                 }
//                 );
                
//             }
//         });

//     }