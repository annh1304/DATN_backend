const productService = require('./product_service');
const categoryService = require('../categories/category_service');
const pool = require('../../web_connect');
const storageUploader = require('../../middleware/firebase_storage');
var fs = require('fs');

exports.getAll = async (req, res) => {
    if (!req.session || !req.session.user) {
        res.redirect('/dang-nhap');
    } else {
        const { page, size } = req.query;
        if (!page) res.redirect('/san-pham?size=5&page=1');
        const skip = (parseInt(page) - 1) * size;
        // const tO = parseInt(page) * 5;

        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected

            // connection.query(`SELECT TBLFOOD.FOODID, TBLFOOD.FOODNAME, TBLFOOD.PRICE, TBLFOOD.IMAGE, TBLFOOD.STATUS, TBLCATEGORIES.CATNAME FROM TBLFOOD INNER JOIN TBLCATEGORIES ON TBLFOOD.CATID = TBLCATEGORIES.CATID WHERE TBLFOOD.FOODID BETWEEN ${parseInt(from) + 1} AND ${tO}`, (err, rows) => {
            connection.query(`SELECT tblfood.FOODID, tblfood.FOODNAME, tblfood.PRICE, tblfood.IMAGE, tblfood.STATUS, tblcategories.CATNAME FROM tblfood INNER JOIN tblcategories ON tblfood.CATID = tblcategories.CATID ORDER BY tblfood.FOODID LIMIT ${size} OFFSET ${skip}`, (err, rows) => {
                connection.release();
                if (!err) {
                    rows = rows.map(row => {
                        row = { ...row };
                        if (row.STATUS.toString() == 'removed') {
                            row.STATUS = true;
                        } else {
                            row.STATUS = false;
                        }
                        return row;
                    });
                    const usernameAdmin = req.session.user.USERNAME;
                    console.log('check username', usernameAdmin)
                    res.render('products_table', { rows, usernameAdmin });
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
        const { id } = req.params;
        //getFood;
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            connection.query(`SELECT * FROM tblfood WHERE FOODID = ${id}`, function (err, food) {
                if (err) {
                    return console.log('error: ' + err.message);
                }
                connection.query(`SELECT CATID, CATNAME FROM tblcategories`, function (err, categories) {
                    if (err) {
                        return console.log('error: ' + err.message);
                    }
                    categories = categories.map(category => {
                        let c = {
                            CATID: category.CATID,
                            CATNAME: category.CATNAME,
                            isSelected: false
                        }
                        if (food[0].CATID.toString() === c.CATID.toString()) {
                            c.isSelected = true;
                        }
                        return c;
                    });

                    status = status.map(sts => {
                        let s = {
                            ...sts,
                            isSelected: false
                        }
                        if (food[0].STATUS.toString() === s.name.toString()) {
                            s.isSelected = true;
                        }
                        return s;
                    })

                    // console.log(categories, food);
                    const usernameAdmin = req.session.user.USERNAME;
                    res.render('product_detail', { food, categories, status, usernameAdmin });
                });
            });
        });
    }
}

exports.update = async (req, res) => {
    let { body, file } = req;
    const { id } = req.params;

    let query = ``;

    delete body.image;
    if (file) {
        //up hinh len firebase
        let image = await storageUploader.uploadFile(file.path, file.filename);
        // xóa hình hiện tại trong sv;
        fs.unlinkSync(file.path);
        body = {
            ...body,
            image: image
        };
        query = `UPDATE tblfood
            SET FOODNAME = '${body.name}', QUANTITY = ${body.quantity}, PRICE = ${body.price}
            , CATID = ${body.category_id}, IMAGE = '${body.image}', STATUS = '${body.status}'
            WHERE FOODID = ${id};`
    }
    if (!body.image) {
        delete body.image;
        query = `UPDATE tblfood
            SET FOODNAME = '${body.name}', QUANTITY = ${body.quantity}, PRICE = ${body.price}
            , CATID = ${body.category_id}, STATUS = '${body.status}' WHERE FOODID = ${id};`;
    }

    console.log('body', body);
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected

        connection.query(query, (err, rows) => {
            connection.release();
            if (!err) {
                res.redirect('/san-pham?size=5&page=1');
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
                    const usernameAdmin = req.session.user.USERNAME;
                    res.render('empty_product_form', { categories, status, usernameAdmin });
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
    console.log('image test', file);

    delete body.image;
    if (file) {
        //up hinh len firebase
        let image = await storageUploader.uploadFile(file.path, file.filename);
        // xóa hình hiện tại trong sv;
        fs.unlinkSync(file.path);
        body = {
            ...body,
            image: image
        };
        query = `INSERT INTO tblfood (FOODNAME, QUANTITY, PRICE, CATID, STATUS, IMAGE)
            VALUES ('${body.name}', ${body.quantity}, ${body.price}, ${body.category_id}, '${body.status}', '${body.image}');`;
    }
    if (!body.image) {
        delete body.image;

        query = `INSERT INTO tblfood (FOODNAME, QUANTITY, PRICE, CATID, STATUS)
            VALUES ('${body.name}', ${body.quantity}, ${body.price}, ${body.category_id}, '${body.status}');`;
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
    "name": "featured"
}, {
    "_id": 4,
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