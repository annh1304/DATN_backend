const categoriesService = require('./category_service');
var mysql = require('mysql')
const pool = require('../../web_connect');


exports.getAll = async (req, res) => {
    if (!req.session || !req.session.user) {
        res.redirect('/dang-nhap');
    } else {
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            const query = `SELECT tblcategories.CATID, CATNAME, COUNT(DISTINCT tblfood.FOODID) AS 'SOLUONG', tblcategories.IMAGE FROM tblcategories LEFT JOIN tblfood ON tblcategories.CATID = tblfood.CATID GROUP BY tblcategories.CATID`;
            connection.query(query, (err, rows) => {
                connection.release();
                if (!err) {
                    const username = req.session.user.USERNAME;
                    res.render('categories_table', { rows, username });
                } else {
                    console.log(err);
                }
            })
        });

    }
}

exports.create = async (req, res) => {
    let query = ``;
    let { body, file } = req;
    console.log(body.image);
    delete body.image;

    //up hinh len firebase
    let image = await storageUploader.uploadFile(file.path, file.filename);
    // xóa hình hiện tại trong sv;
    fs.unlinkSync(file.path);

    body = {
        ...body,
        image: image
    };
    query = `INSERT INTO tblcategories (CATNAME, IMAGE) VALUES ('${body.name}', '${body.image}');`;

    console.log('body', body);

    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        connection.query(`SELECT tblcategories.CATNAME FROM tblcategories WHERE tblcategories.CATNAME = '${body.name}'`, (err, rows) => {
            if (err) throw err;

            if (rows.length == 0) {
                // res.send({ message: 'Not existed' })
                connection.query(query, (err, rows) => {
                    if (err) throw err;

                })

            } else if (rows[0].CATNAME === body.name) {
                // res.send({ message: 'Existed' })
                console.log({ message: 'Existed' })
            }
        })
        // connection.query(`SELECT CATNAME FROM tblcategories`, (err, rows) => {
        //     if (!err) {
        //         res.render('categories_table', { rows });
        //     } else {
        //         console.log(err);
        //     }
        // })
    });
    res.redirect('/danh-muc');

}

exports.update = async (req, res) => {
    const { id, name } = req.params;

    const query = `UPDATE tblcategories
    SET CATNAME = '${name}' WHERE CATID = ${id};`;

    console.log('category checkkkkk', id + "name");
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        connection.query(query, (err, rows) => {
            connection.release();
            if (!err) {
                // res.redirect('/san-pham?size=5&page=1');
            } else {
                console.log(err);
            }
        })
    });
}

