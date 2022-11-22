const { request } = require('express');
var express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authen = require('../middleware/authen');

const cartCtrl = require('../components/app_controller/tblCartController');
const foodCtrl = require('../components/app_controller/tblFoodController');
const userCtrl = require('../components/app_controller/tblUserController');
const orderCtrl = require('../components/app_controller/tblOrderController');
const typeFoodCtrl = require('../components/app_controller/tblTypeFoodController');
//đăng ký


//cart
// router.get("/tblcart", cartCtrl.getcart);
router.post("/postcart", cartCtrl.postcart);
router.post("/postitemcard", cartCtrl.postitemcard);
//food 
// router.get("/getfood", foodCtrl.getfood);
router.get("/getfood", foodCtrl.getfood);
router.get("/getfoodPopular", foodCtrl.getfoodPopular);
router.get("/getfoodFeatured", foodCtrl.getfoodFeatured);
router.get("/getfoodNew", foodCtrl.getfoodNew);

//type food (menu)
router.get("/gettypefood1", typeFoodCtrl.gettypefood1);
router.get("/gettypefood2", typeFoodCtrl.gettypefood2);
router.get("/gettypefood3", typeFoodCtrl.gettypefood3);
router.get("/gettypefood4", typeFoodCtrl.gettypefood4);

//user
router.get("/getuser", userCtrl.getuser);
router.post("/postuser", userCtrl.postuser);
router.post("/update-infor", userCtrl.updateInfor);
router.post("/update-password", userCtrl.updatePassword);
router.get("/getuser-infor", userCtrl.getUserInfor);
router.post("/reset-password-request", userCtrl.reqMail);
router.get("/reset-password-form/:username/:token", userCtrl.newPwForm);
router.post("/new-password-send", userCtrl.newPwSend);

//order

//gui don hang
router.post("/updateOrderStatus", orderCtrl.updateorder);
//ds history
router.get("/orderList", orderCtrl.orderHistory);
//history detail
router.get("/orderList/detail", orderCtrl.orderHistoryDetail);

module.exports = router;














// router.post('/signup', async function (req, res, next) {
//     try {
//         const { username, password } = req.body;
//         const user = await userController.signup(username, password);
//         console.log(user);
//         res.status(200).json(user);
//     } catch (error) {
//         res.status(500).json({ error });
//     }
// })
// //đăng nhập
// router.post('/signin', async function (req, res, next) {
//     try {
//         const { username, password } = req.body;
//         const token = await userController.signin(username, password);
//         console.log(token);
//         res.status(200).json({ error: false, token });
//     } catch (error) {
//         res.status(500).json({ error });
//     }
// })

// router.get('/user-info', async function (req, res, next) {
//     try {
//         const token = req.headers.authorization.split(' ')[1];
//         // const {id} = req.query;
//         const user = await userController.getInfo(token);
//         res.status(200).json(user);
//     } catch (error) {
//         res.status(501).json({ error });
//     }
// });


// //đăng nhập web
// router.post('/dang-nhap', async function (req, res, next) {
//     try {
//         const { username, password } = req.body;
//         const user = await userController.login(username, password);
//         if (user) {
//             req.session.user = user;
//         } else {

//         }
//     } catch (error) {

//     }
// })

