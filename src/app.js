/*jslint node: true, esversion: 6*/
'use strict';
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const db = require('./mongo.js');

const app = express();
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

const router = express.Router();
app.use(router);

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json()); // turns form data into json in req.body
router.use(cookieParser('secret'));
router.use(session({store: new session.MemoryStore(), secret: "super-duper-secret-secret", saveUninitialized: false, resave: false}));
router.use(express.static(path.join(__dirname, '../public')));

// API routes
const api = require('./api');
router.get('/select', api.select);
router.post('/insert', api.insert);
router.delete('/delete', api.delete);

router.use('/', require('./routes/index'));

// catch 404 and forward to error handler
router.use(function(req, res, next) {
  const err = new Error('Not Found : ' + req.url);
  err.status = 404;
  next(err);
});

// error handler
router.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Internal Error' } );
});

module.exports = app;
