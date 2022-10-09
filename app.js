var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// const hbs = require('hbs');
// const helper = require('./helpers/HBSHelpers');
// hbs.registerHelper('ifEqual', helper.ifEqual);
const session = require('express-session');
const mongoose = require('mongoose');
//theo thứ tự user>category>product.
require('./components/users/user_model');
require('./components/categories/category_model');
require('./components/products/product_model');

//mongodb+srv://antroipro123:<password>@cluster0.ayktqy8.mongodb.net/?retryWrites=true&w=majority

mongoose.connect('mongodb+srv://antroipro123:aloalo123@cluster0.ayktqy8.mongodb.net/NODEJS_PROJECT?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('>>>>>>>>>> DB Connected!!!!!!'))
  .catch(err => console.log('>>>>>>>>> DB Error: ', err));

//khai báo đường dẫn routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product');
var chartsRouter = require('./routes/charts');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//import pack
app.use(session({
  secret:'heybro',
  resave: true,
  saveUninitialized:true,
  cookie:{secure:false}
}));

//http://localhost:1304/
app.use('/', indexRouter);
app.use('/nguoi-dung', usersRouter);
app.use('/san-pham', productRouter);
app.use('/thong-ke', chartsRouter);
app.use('/api', apiRouter);
// app.use('/product', productRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
