/*jshint node: true, esversion: 6*/
'use strict';
const express = require('express');
const router = express.Router();
const Member = require('../model').Member;
const Subteam = require('../model').Subteam;

router.get('/', function(req, res) {
  (async () => {
    const members = await Member.find().exec();
    const subteams = await Subteam.find().exec();
    res.render('index', { title: 'CUAir Info', members : members, subteams : subteams });
  })();
});

module.exports = router;
