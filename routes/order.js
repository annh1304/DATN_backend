var express = require('express');
var router = express.Router();

const orderController = require('../components/orders/order_controller')
const categoryController = require('../components/categories/category_controller');
const middleware = require('../middleware/upload');


router.get('/', orderController.getAll);
// router.get('/them-san-pham', productController.addFoodForm);
// router.post('/them-san-pham', [middleware.single('image')], productController.addFood);
router.get('/detail/:id/:username', orderController.getById);
router.get('/confirm/:ordid/:username', orderController.confirmOrder);
router.get('/cancel/:ordid/:username', orderController.cancelOrder);

// router.post('/detail/:id', [middleware.single('image')], productController.update);
// router.post('/remove/:id', productController);

module.exports = router;