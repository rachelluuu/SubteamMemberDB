/*jslint node: true, esversion: 6*/
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberSchema = new Schema(
  {
    name: { type: String },
    year: { type: String },
    subteam: { type: String },
  },
  { versionKey: false }
);

const subteamSchema = new Schema(
  {
    name: { type: String },
    num_people: { type: Number },
    lead: { type: mongoose.Schema.Types.ObjectId },
  },
  { versionKey: false }
);

module.exports = {
  Member: mongoose.model('member', memberSchema),
  Subteam: mongoose.model('subteam', subteamSchema)
};
