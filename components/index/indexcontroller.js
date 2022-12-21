const { response } = require('express');
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
            connection.query(`SELECT tblfood.FOODNAME FROM (tblfood INNER JOIN tblorderdetail ON tblfood.FOODID = tblorderdetail.FOODID) INNER JOIN tblorder ON tblorderdetail.ORDERID = tblorder.ORDERID WHERE tblorder.ORDSTATUS = 3 GROUP BY tblfood.FOODID, tblfood.FOODNAME
            ORDER BY SUM(tblorderdetail.QUANTITY) DESC LIMIT 1`, (err, food) => {
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
                            const username = req.session.user.USERNAME;
                            res.render('index', {
                                food,
                                money,
                                count,
                                json,
                                username
                            });
                        });
                    });
                });
            });
        });
    }

}

exports.getChart = async (req, res) =>{

    //old
    // let query = `SELECT  tblorder.ORDERID, MONTH(tblorder.CONFIRMTIME) AS 'MONTH', SUM(tblorderdetail.TOTAL) AS 'SOLDTOTAL' 
    // FROM (tblorder INNER JOIN tblorderdetail ON tblorder.ORDERID = tblorderdetail.ORDERID) WHERE tblorder.ORDSTATUS = 3 GROUP BY tblorder.ORDERID ORDER BY tblorder.CONFIRMTIME ASC`;
    
    let query = `SELECT MONTH(tblorder.CONFIRMTIME) AS 'MONTH', SUM(tblorderdetail.TOTAL) AS 'SOLDTOTAL' 
    FROM (tblorder INNER JOIN tblorderdetail ON tblorder.ORDERID = tblorderdetail.ORDERID) WHERE tblorder.ORDSTATUS = 3 GROUP BY MONTH ORDER BY tblorder.CONFIRMTIME ASC`;

    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected

        connection.query(query, (err, rows) => {
            connection.release();
            if (err) {
                console.log(err);
            } else {

                const labels = months.map(function(item) {
                    return item["name"]; 
                   });
                const values = getValues(rows);
                console.log(rows)
                res.json({labels,values});
            }
        })
    });
}


function getValues(rows) {
    // console.log(rows[1].MONTH);
    let values = [];
    for(let i=0 ;i < 12; i++){
        values.push(0);
    }
    for(let u=0; u < rows.length; u++){
        values[rows[u].MONTH-1] = rows[u].SOLDTOTAL;
    }
    return values;
}

let months = [{
    "numb": 1,
    "name": 'January'
},{
    "numb": 2,
    "name": 'February'
},{
    "numb": 3,
    "name": 'March'
},{
    "numb": 4,
    "name": 'April'
},{
    "numb": 5,
    "name": 'May'
},{
    "numb": 6,
    "name": 'June'
},{
    "numb": 7,
    "name": 'July'
},{
    "numb": 8,
    "name": 'August'
},{
    "numb": 9,
    "name": 'September'
},{
    "numb": 10,
    "name": 'October'
},{
    "numb": 11,
    "name": 'November'
},{
    "numb": 12,
    "name": 'December'
}]



// async..await is not allowed in global scope, must use a wrapper
// async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  
// }



// for (let i = 0; i < rows.length; i++) {

//     for (let y = 0; y < months.length; y++){
//         if (Number(rows[i].MONTH) == Number(months[y].numb)){
//             for (let u = 0; u < labels.length; u++){
//                 if (labels[u].toString() === months[y].name.toString()){
//                     console.log(Number(rows[i].MONTH));
//                     console.log(Number(months[y].numb));
//                 }else{labels.push(months[y].name);}
//             }
//         }
//     }
    
//     // labels.push(rows[i].FOODNAME);
// }


//old
// connection.query(`SELECT  tblfood.FOODNAME, tblfood.PRICE, SUM(tblorderdetail.QUANTITY) AS 'SOLDQUANTITY' FROM (tblfood INNER JOIN tblorderdetail ON tblfood.FOODID = tblorderdetail.FOODID) INNER JOIN tblorder ON tblorderdetail.ORDERID = tblorder.ORDERID WHERE tblorder.ORDSTATUS = 3 GROUP BY tblfood.FOODID, tblfood.FOODNAME `, (err, rows) => {
//     connection.release();
//     if (!err) {
//         console.log(rows);
//         const bestSeller = getBestSeller(rows);
//         res.render('index', { rows, bestSeller });
//     } else {
//         console.log(err);
//     }
// })


// function getBestSeller(soldFoods) {

//     let bestSeller = soldFoods[0];
//     for (let i = 0; i < soldFoods.length; i++) {
//         if (bestSeller.SOLDQUANTITY <= soldFoods[i].SOLDQUANTITY) {
//             bestSeller = soldFoods[i];
//         }

//     }
//     // console.log('best Seller', bestSeller);
//     return bestSeller;

// }


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

