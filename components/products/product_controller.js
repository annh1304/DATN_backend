const productService = require('./product_service');
const categoryService = require('../categories/category_service');
var mysql = require('mysql')

const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});


exports.getAll = async (req, res) => {
    const page = req.query.page;

    const from = (parseInt(page) - 1) * 5;
    const tO = parseInt(page) * 5;

    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected

        connection.query(`SELECT TBLFOOD.FOODID, TBLFOOD.FOODNAME, TBLFOOD.PRICE, TBLFOOD.IMAGE, TBLCATEGORIES.CATNAME FROM TBLFOOD INNER JOIN TBLCATEGORIES ON TBLFOOD.CATID = TBLCATEGORIES.CATID WHERE TBLFOOD.FOODID BETWEEN ${parseInt(from) + 1} AND ${tO}`, (err, rows) => {
            connection.release();
            if (!err) {

                res.render('products_table', { rows });
            } else {
                console.log(err);
            }
        })
    });
}

exports.getById = async (req, res) => {
    const { id } = req.params;

    //getFood;
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        connection.query(`SELECT * FROM TBLFOOD WHERE FOODID = ${id}`, function (err, food) {
            if (err) {
                return console.log('error: ' + err.message);
            }
            connection.query(`SELECT CATID, CATNAME FROM TBLCATEGORIES`, function (err, categories) {
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

                console.log(categories, food);

                res.render('product_detail', { food, categories });
            });
        });
    });

}

exports.update = async (req, res) => {
    let { body, file } = req;
    const { id } = req.params;

    let query = ``;

    delete body.image;
    if (file) {
        let image = `/images/data/${file.filename}`;
        body = {
            ...body,
            image: image
        };
        query = `UPDATE TBLFOOD
            SET FOODNAME = '${body.name}', QUANTITY = ${body.quantity}, PRICE = ${body.price}
            , CATID = ${body.category_id}, IMAGE = '${body.image}'
            WHERE FOODID = ${id};`
    }
    if (!body.image) {
        delete body.image;
        query = `UPDATE TBLFOOD
            SET FOODNAME = '${body.name}', QUANTITY = ${body.quantity}, PRICE = ${body.price}
            , CATID = ${body.category_id} WHERE FOODID = ${id};`;
    } else {

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