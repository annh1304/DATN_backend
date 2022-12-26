const pool = require('../../web_connect');
const firebaseAdmin = require('../../middleware/firebase_storage');
let constant = require('../../constants');

//đọc file tokens;
const fs = require('fs');
const path = require('path');

exports.getAll = async (req, res) => {
    if (!req.session || !req.session.user) {
        res.redirect('/dang-nhap');
    } else {
        const page = req.query.page;
        const skip = (parseInt(page) - 1) * 5;
        // const tO = parseInt(page) * 5;

        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected

            // connection.query(`SELECT TBLFOOD.FOODID, TBLFOOD.FOODNAME, TBLFOOD.PRICE, TBLFOOD.IMAGE, TBLFOOD.STATUS, TBLCATEGORIES.CATNAME FROM TBLFOOD INNER JOIN TBLCATEGORIES ON TBLFOOD.CATID = TBLCATEGORIES.CATID WHERE TBLFOOD.FOODID BETWEEN ${parseInt(from) + 1} AND ${tO}`, (err, rows) => {
            connection.query(`SELECT ORDERID, USERNAME, ADDRESS, ORDERTIME, CONFIRMTIME, ORDSTATUS FROM tblorder WHERE ORDSTATUS IN (2,3,0)`, (err, sentOrders) => {
                if (!err) {

                    sentOrders = sentOrders.map(order => {
                        order = { ...order };
                        if (order.ORDSTATUS === 3) {
                            order.ISCONFIRMED = true;
                        } else if (order.ORDSTATUS === 2) {
                            order.ISSENT = true;
                        } else if (order.ORDSTATUS === 0) {
                            order.ISCANCELED = true;
                        }
                        delete order.ORDSTATUS;
                        return order;
                    });
                    console.log('abc', sentOrders);
                    const username = req.session.user.USERNAME;
                    res.render('orders_table', { sentOrders, username });
                } else {
                    console.log(err);
                }
            })
        });

    }
}

exports.getById = async (req, res) => {
    if (!req.session || !req.session.user) {
        res.redirect('/dang-nhap');
    } else {
        const { id, username } = req.params;
        // const query = `SELECT tblfood.FOODID , tblfood.FOODNAME, tblfood.PRICE , tblfood.IMAGE, tblorderdetail.QUANTITY , tblorderdetail.TOTAL
        // , tblorder.ADDRESS, tblorder.PHONENUMBER, tblorder.ORDSTATUS, tblorder.VOUCHERDETAIL
        // FROM (tblorderdetail INNER JOIN tblfood ON tblorderdetail.FOODID = tblfood.FOODID)
        // INNER JOIN tblorder ON tblorderdetail.ORDERID = tblorder.ORDERID  WHERE tblorder.USERNAME = '${username}'  AND tblorder.ORDERID = ${id} AND tblorder.ORDSTATUS != 1`;
        const query = `SELECT tblfood.FOODID , tblfood.FOODNAME, tblfood.PRICE , tblfood.IMAGE, tblorderdetail.QUANTITY , tblorderdetail.TOTAL
        , tblorder.ADDRESS, tblorder.PHONENUMBER, tblorder.ORDSTATUS, tblvoucher.VOUCHER
        FROM ((tblorderdetail INNER JOIN tblfood ON tblorderdetail.FOODID = tblfood.FOODID)
        INNER JOIN tblorder ON tblorderdetail.ORDERID = tblorder.ORDERID) LEFT JOIN tblvoucher ON tblorder.VOUCHERCODE = tblvoucher.VOUCHERCODE WHERE tblorder.USERNAME = '${username}'  AND tblorder.ORDERID = ${id} AND tblorder.ORDSTATUS != 1`;
        //getFood;
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            connection.query(query, function (err, ordDetail) {
                if (err)
                    return console.log('error: ' + err.message);

                // console.log("length", ordDetail.length);
                //tính giá tổng đơn hàng
                let total = 0;
                for (let i = 0; i < ordDetail.length; i++) {
                    total += Number(ordDetail[i].TOTAL);
                }
                let isPending = true;
                console.log("test", ordDetail[0]);
                if (ordDetail[0].ORDSTATUS != 2) {
                    isPending = false;
                }
                // res.json(ordDetail);
                const usernameAdmin = req.session.user.USERNAME;
                const address = ordDetail[0].ADDRESS;
                const phone = ordDetail[0].PHONENUMBER;
                const voucher = ordDetail[0].VOUCHER;
                res.render('orders_detail', { ordDetail, username, total, id, isPending, usernameAdmin, address, phone, voucher });
            });
        });
    }
}

exports.confirmOrder = async (req, res) => {
    const { ordid, username } = req.params;

    let query = `UPDATE tblorder SET ORDSTATUS = 3, CONFIRMTIME = CURRENT_TIMESTAMP WHERE USERNAME = '${username}' AND ORDERID = '${ordid}'`;

    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        connection.query(query, (err, rows) => {
            connection.release();
            if (!err) {

                //đọc file
                let rawdata = fs.readFileSync(path.resolve(__dirname, '../../tokens.json'));
                let tokens = JSON.parse(rawdata);

                let registrationTokens = constant.getTokenObjectByUsername(tokens, username);
                registrationTokens.push('abc')

                const message = {
                    notification: {
                        title: 'Order confirmation',
                        body: `Your Order#${ordid} been comfirmed`
                    },
                    tokens: registrationTokens,
                }

                firebaseAdmin.NotiDeliver(message);
                res.redirect('/don-hang');
            } else {
                console.log(err);
            }
        })
    });
}

exports.cancelOrder = async (req, res) => {
    const { ordid, username } = req.params;

    let query = `UPDATE tblorder SET ORDSTATUS = 0 WHERE USERNAME = '${username}' AND ORDERID = '${ordid}'`;

    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        connection.query(query, (err, rows) => {
            connection.release();
            if (!err) {

                //đọc file
                let rawdata = fs.readFileSync(path.resolve(__dirname, '../../tokens.json'));
                let tokens = JSON.parse(rawdata);

                let registrationTokens = constant.getTokenObjectByUsername(tokens, username);
                // console.log('test', registrationTokens);
                registrationTokens.push('abc')
                const message = {
                    notification: {
                        title: 'Order cancelation',
                        body: `Your Order#${ordid} been canceled`
                    },
                    tokens: registrationTokens,
                }

                firebaseAdmin.NotiDeliver(message);
                res.redirect('/don-hang');
            } else {
                console.log(err);
            }
        })
    });
}




// module.exports = new ProductController();
/*

const getById = async (id) => {
    //select id, name from product...
    const product = await productService.getById(id);
    let categories = await categoryService.getAll();
    // console.log(product);
    // console.log(categories);
    // old
    // categories = categories.map(category =>{
    //     category = { ...category, isSelected:false};
    //     if (product.category_id.toString() == category._id.toString()){
    //         category.isSelected = true;
    //     }
    //     return category;
    // }); 
    //new
    categories = categories.map(category => {
        let c = {
            _id: category._id,
            name: category.name,
            description: category.description,
            isSelected: false
        }
        if (product.category_id._id.toString() == c._id.toString()) {
            c.isSelected = true;
        }
        return c;
    });
    return { product, categories };
}

const insert = async (product) => {
    await productService.insert(product);
}

const update = async (id, product) => {
    await productService.update(id, product);
}

const deleteById = async (id) => {
    await productService.deleteById(id);
}

module.exports = { getAll, getById, insert, update, deleteById };

*/