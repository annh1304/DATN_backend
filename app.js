var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mysql = require('mysql');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');

require('dotenv').config();

// const hbs = require('hbs');
// const helper = require('./helpers/HBSHelpers');
// hbs.registerHelper('ifEqual', helper.ifEqual);
const session = require('express-session');

//mongodb+srv://antroipro123:<password>@cluster0.ayktqy8.mongodb.net/?retryWrites=true&w=majority
//Tạo connection mysql;

//khai báo đường dẫn routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product');
var chartsRouter = require('./routes/charts');
var categoriesRouter = require('./routes/categories');
var orderRouter = require('./routes/order');
var apiRouter = require('./routes/api');
//const { connection } = require('mongoose');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.engine('hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//import pack
//parse application/x-www-form-urlencoded;
app.use(bodyParser.urlencoded({ extended: false }));
//Parse application.json
app.use(bodyParser.json());

// app.use(express.static('public'));
app.use(session({
  secret: 'heybro',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

//http://localhost:5000/
app.use('/', indexRouter);
app.use('/nguoi-dung', usersRouter);
app.use('/san-pham', productRouter);
app.use('/thong-ke', chartsRouter);
app.use('/api', apiRouter);
app.use('/danh-muc', categoriesRouter);
app.use('/don-hang', orderRouter);
// app.use('/product', productRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
