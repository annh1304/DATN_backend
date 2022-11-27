const pool = require('../../web_connect');


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
        const query = `SELECT tblfood.FOODID , tblfood.FOODNAME, tblfood.PRICE , tblfood.IMAGE, tblorderdetail.QUANTITY , tblorderdetail.TOTAL, tblorder.ADDRESS, tblorder.PHONENUMBER, tblorder.ORDSTATUS
        FROM (tblorderdetail INNER JOIN tblfood ON tblorderdetail.FOODID = tblfood.FOODID)
        INNER JOIN tblorder ON tblorderdetail.ORDERID = tblorder.ORDERID  WHERE tblorder.USERNAME = '${username}'  AND tblorder.ORDERID = ${id} AND tblorder.ORDSTATUS != 1`;
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
                if (ordDetail[0].ORDSTATUS != 2) {
                    isPending = false;
                }
                // res.json(ordDetail);
                const usernameAdmin = req.session.user.USERNAME;
                const address = ordDetail[0].ADDRESS;
                const phone = ordDetail[0].PHONENUMBER;
                res.render('orders_detail', { ordDetail, username, total, id, isPending, usernameAdmin, address, phone });
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
                res.redirect('/don-hang');
            } else {
                console.log(err);
            }
        })
    });
}

exports.addFoodForm = async (req, res) => {
    if (!req.session || !req.session.user) {
        res.redirect('/dang-nhap');
    } else {
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected

            connection.query(`SELECT CATID, CATNAME FROM tblcategories`, (err, categories) => {
                connection.release();
                if (!err) {

                    res.render('empty_product_form', { categories, status });
                } else {
                    console.log(err);
                }
            })
        });
    }
}

exports.addFood = async (req, res) => {
    let query;
    let { body, file } = req;

    delete body.image;
    if (file) {
        let image = `/images/data/${file.filename}`;
        body = {
            ...body,
            image: image
        };
        query = `INSERT INTO tblfood (FOODNAME, QUANTITY, PRICE, CATID, STATUS, IMAGE)
            VALUES ('${body.name}', ${body.quantity}, ${body.price}, ${body.category_id}, ${body.status}, '${body.image}');`;
    }
    if (!body.image) {
        delete body.image;

        query = `INSERT INTO tblfood (FOODNAME, QUANTITY, PRICE, CATID, STATUS)
            VALUES ('${body.name}', ${body.quantity}, ${body.price}, ${body.category_id}, ${body.status});`;
    }

    console.log('body', body);

    pool.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(query, (err, rows) => {
            connection.release();
            if (!err) {
                res.redirect('/san-pham?size=5&page=1');
            } else {
                console.log(err);
            }
        })
    })
}



let status = [{
    "_id": 1,
    "name": 'new'
}, {
    "_id": 2,
    "name": "hot"
}, {
    "_id": 3,
    "name": "removed"
}]



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