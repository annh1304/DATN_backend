const pool = require('../../web_connect');


exports.getAll = async (req, res) => {
    if (!req.session || !req.session.user) {
        res.redirect('/dang-nhap');
    } else {
        let query = `SELECT tblfood.FOODNAME, tblfood.PRICE, SUM(tblorderdetail.QUANTITY) AS 'SOLDQUANTITY', SUM(tblorderdetail.TOTAL) AS 'SOLDTOTAL' FROM (tblfood INNER JOIN tblorderdetail ON tblfood.FOODID = tblorderdetail.FOODID) INNER JOIN tblorder ON tblorderdetail.ORDERID = tblorder.ORDERID WHERE tblorder.ORDSTATUS = 3 GROUP BY tblfood.FOODID, tblfood.FOODNAME ORDER BY SUM(tblorderdetail.TOTAL) DESC`;
        // const tO = parseInt(page) * 5;

        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected

            connection.query(query, (err, rows) => {
                connection.release();
                if (!err) {
                    // rows = rows.map(row => {
                    //     row = { ...row };
                    //     if (row.STATUS.toString() == 'removed') {
                    //         row.STATUS = true;
                    //     } else {
                    //         row.STATUS = false;
                    //     }
                    //     return row;
                    // });
                    const lables = getLabels(rows);
                    const values = getValues(rows);
                    const username = req.session.user.USERNAME;
                    res.render('thong_ke', { lables, values, username });
                } else {
                    console.log(err);
                }
            })
        });

    }
}

function getLabels(rows) {

    let labels = [];
    for (let i = 0; i < rows.length; i++) {
        labels.push(rows[i].FOODNAME);
        if (i === 2) break;
    }
    labels.push('khác');
    console.log('labels', labels);
    return labels;

}

function getValues(rows) {

    let generalVal = 0;
    let valuess = [];
    let percenttOther = 100;
    //get generalVal
    for (let i = 0; i < rows.length; i++) {
        generalVal += Number(rows[i].SOLDTOTAL);
    }
    for (let i = 0; i < rows.length; i++) {
        percentt = 100 / generalVal * Number(rows[i].SOLDTOTAL);
        percentt = Math.round(percentt * 100) / 100;
        percenttOther -= percentt;
        valuess.push(percentt);
        if (i === 2) break;
    }
    valuess.push(Math.round(percenttOther * 100) / 100);
    // console.log('valuess', valuess);
    return valuess;

}