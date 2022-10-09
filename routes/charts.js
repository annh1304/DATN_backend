var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (!req.session || !req.session.user){
    res.redirect('/dang-nhap');
  }else{
    res.render('thong_ke');
  }
  });

module.exports = router;