var express = require('express');
var router = express.Router();

const productController = require('../components/products/product_controller');
const categoryController = require('../components/categories/category_controller');
const middleware = require('../middleware/upload');

/* GET products listing.
http://localhost:1304/danh-muc */
router.get('/', categoryController.getAll);
//Add product http://localhost:1304/san-pham/them-san-pham*/
router.post('/them-danh-muc', [middleware.single('image')], categoryController.create);
router.get('/cap-nhat/:id/:name', categoryController.update);

//middleware
/*Get product by ID
http://localhost:1304/san-pham*/
// router.get('/detail/:id', async function (req, res, next) {
//     const { id } = req.params;// hoặc const _id = req.params.id
//     const { product, categories } = await productController.getById(id);
//     // const categories = await categoryController.get();
//     const username = req.session.user.USERNAME;
//     res.render('product_detail', { username, categories });
//     console.log({ product }, id);
// });


router.post('/remove/:id', async function (req, res, next) {
    let { id } = req.params;
    await productController.deleteById(id);
    res.json({ success: true });
});
module.exports = router;
