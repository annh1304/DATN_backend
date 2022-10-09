var express = require('express');
var router = express.Router();
const userController = require('../components/users/user_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.session || !req.session.user){
    res.redirect('/dang-nhap');
  }else{
    res.render('index');
  }
});

// trang đăng nhập
router.get('/dang-nhap', function(req, res, next){
  if(req.session.user && req.session){
    res.redirect('/');
  }
  res.render('login', {title:'login'});
});
router.get('/dang-xuat', function(req, res, next){
  req.session.destroy(function(err){
    res.redirect('/dang-nhap');
  });
});

router.post('/dang-nhap', async function(req, res, next){
  // res.render('login', {title:'login'})
  try {
    const {username, password} = req.body;
    const user = await userController.login(username, password);
    // console.log(user);
    if(user){
      req.session.user = user;
      console.log('.....', req.session.user);
      res.redirect('/');
    }else{
      res.redirect('/dang-nhap');
    }
  } catch (error) {
    res.render('error', {message:'looix roiof ddaay nef'});
  } 
  
});












//examples
//dò url chạy từ trên xuống;
// router.get('/dientich', function(req, res, next) {
  // console.log('from index.js');
  // res.render('dientich', { title: 'tính diện tích' });

//   let {dai, rong}= req.query;
//   let dienTich = Number(dai)*Number(rong);
//   res.render('dientich', {title: 'Hình chữ nhật', info: 'Diện tích', width: dai, height: rong, dienTich});
//   res.json({dai, rong, dienTich});
  
// });
// router.get('/dientich-tamgiac/canh-day/:canhday/chieu-cao/:chieucao', function(req, res, next){
//   let {canhday, chieucao} = req.params;
//   let dienTich = (Number(canhday)*Number(chieucao))/2;
//   res.render('dientich', {title:'Hình tam giác', infor: 'Diện tích', width: canhday, height: chieucao, dienTich});
// });

// router.post('/dientich-hv', function(req, res, next){
//   let {canh} = req.body;
//   let dienTich = Number(canh*canh);
//   res.render('dientich', {title:'Hình vuông', infor: 'Diện tích', canh, dienTich});
// });

// router.post('/dang-nhap', function(req, res, next){
//   res.render('login', {title:'login'})
//   const {username, password} = req.body;
//   if (username === 'admin' && password === 'admin'){
//     res.redirect('/',)// quay lại trang chính router.get('/',...
//   }else{
//     res.redirect('/login',)// quay lại trang login (router.get('/login))
//   }
  
// });
module.exports = router;
