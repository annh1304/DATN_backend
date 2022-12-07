var express = require('express');
var router = express.Router();
const userController = require('../components/users/user_controller');

/* GET users listing. */
// router.get('/', function (req, res, next) {
//   if (!req.session || !req.session.user) {
//     res.redirect('/dang-nhap');
//   } else {
//     res.render('user_table');
//   }
// });


router.get('/', userController.getAll);
router.get('/infor/:username', userController.getById);
router.post('/infor/status', userController.updateStatus);


module.exports = router;
