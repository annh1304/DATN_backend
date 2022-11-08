const pool = require('../../web_connect');

exports.getAll = async (req, res) => {
    if (!req.session || !req.session.user) {
        res.redirect('/dang-nhap');
    } else {
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            connection.query(`SELECT  tblfood.FOODNAME, tblfood.PRICE, SUM(tblorderdetail.QUANTITY) AS 'SOLDQUANTITY' FROM (tblfood INNER JOIN tblorderdetail ON tblfood.FOODID = tblorderdetail.FOODID) INNER JOIN tblorder ON tblorderdetail.ORDERID = tblorder.ORDERID WHERE tblorder.ORDSTATUS = 3 GROUP BY tblfood.FOODID, tblfood.FOODNAME `, (err, rows) => {
                connection.release();
                if (!err) {
                    console.log(rows);
                    const bestSeller = getBestSeller(rows);
                    res.render('index', { rows, bestSeller });
                } else {
                    console.log(err);
                }
            })
        });
    }

}

function getBestSeller(soldFoods) {

    let bestSeller = soldFoods[0];
    for (let i = 0; i < soldFoods.length; i++) {
        if (bestSeller.SOLDQUANTITY <= soldFoods[i].SOLDQUANTITY) {
            bestSeller = soldFoods[i];
        }
    }
    // console.log('best Seller', bestSeller);
    return bestSeller;

}

