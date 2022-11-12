const pool = require('../../web_connect');


exports.getAll = async (req, res) => {
    if (!req.session || !req.session.user) {
        res.redirect('/dang-nhap');
    } else {
        let query = '';
        // const tO = parseInt(page) * 5;

        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected

            // connection.query(query, (err, rows) => {
            //     connection.release();
            //     if (!err) {
            //         rows = rows.map(row => {
            //             row = { ...row };
            //             if (row.STATUS.toString() == 'removed') {
            //                 row.STATUS = true;
            //             } else {
            //                 row.STATUS = false;
            //             }
            //             return row;
            //         });
            res.render('thong_ke');
            //     } else {
            //         console.log(err);
            //     }
            // })
        });

    }
}