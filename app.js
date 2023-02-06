var express = require('express');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fileUpload = require('express-fileupload');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');

var app = express();

app.use(fileUpload({ useTempFiles: true }));
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const DbConnector = require("./db/db_connector");
const dbConnector = new DbConnector();

dbConnector.connect().then((connected) => {
  // console.log(connected);
  app.use(apiRouter);
  app.use('/', indexRouter);
  app.use('/users', usersRouter);

}).catch(error => { throw (error) });


module.exports = app;
