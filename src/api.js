'use strict';

const Member = require('./model').Member;
const Subteam = require('./model').Subteam;
const debug = require('debug')('cuair:api');

function respond(req, res, err, result, s) {
  debug('response: ' + JSON.stringify(result));
  let msg;
  if (err) {
    res.status(400);
    msg = 'ERROR: ' + err;
  }
  else
    msg = s + ': ' + JSON.stringify(result, null, 2) + '\n';
  return res.send(msg + '\n');
}

exports.insert = function (req, res) {
  debug('insert: ' + JSON.stringify(req.query));
  if (! req.query.type)
    return respond(req, res, 'missing type');
  if (req.query.type === 'member') {
    if (! req.query.name || ! req.query.year || ! req.query.subteam)
      return respond(req, res, 'missing name, year or subteam');
    const m = new Member({name : req.query.name, year : req.query.year, subteam : req.query.subteam});
    m.save().then((result) => respond(req, res, null, result, 'Inserted'));
  } else if (req.query.type === 'subteam') {
    if (! req.query.name || ! req.query.num_people || ! req.query.lead)
      return respond(req, res, 'missing name, num_people or lead');
    const s = new Subteam({name : req.query.name, num_people : req.query.num_people, lead : req.query.lead});
    s.save().then((result) => respond(req, res, null, result, 'Inserted'));
  } else
    respond(req, res, 'invalid type');
};

async function getSubteams(q) {
  const result = await Subteam.find(q).exec();
  return await Promise.all(result.map(async (s) => {
    const st = s.toObject();
    st.leadInfo = await Member.findById(st.lead).exec();
    delete st.lead;
    return st;
  }));
}

async function getMembers(q) {
  const result = await Member.find(q).exec();
  return await Promise.all(result.map(async (m) => {
    const mo = m.toObject();
    let so = await Subteam.find({name: mo.subteam}).exec();
    if (so && so[0])
      mo.subteamInfo = await getSubteams({ "name": so[0].name});
    return mo;
  }));
}

exports.select = function (req, res) {
  debug('select: ' + JSON.stringify(req.query));
  if (! req.query.field || (! req.query.value && req.query.field !== 'all') )
    return respond(req, res, 'missing field or value' );
  const q = {};
  q[req.query.field] = req.query.value;
  if (req.query.type === 'member')
    getMembers(q).then(members => respond(req, res, null, members, 'Retrieved'));
  else if (req.query.type === 'subteam')
    getSubteams(q).then(subteams => respond(req, res, null, subteams, 'Retrieved'));
  else
    respond(req, res, 'invalid type');
};

async function deleteMember(id) {
  const doc = await Member.findById(id).exec();
  return doc ? doc.remove() : 'not found: ' + id;
}

async function deleteSubteam(id) {
  const doc = await Subteam.findById(id).exec();
  return doc ? doc.remove() : 'not found: ' + id;
}

function getIdArray(ids) {
  let r;
  if (ids.indexOf('[') === 0 && ids.indexOf(']') === ids.length-1)
    r = ids.substring(1,ids.length-1).split(',');
  else
    r = [ids];
  return r;
}

exports.delete = function (req, res) {
  debug('delete: ' + JSON.stringify(req.query));
  if (! req.query.ids) {
    respond(req, res, 'missing ids' );
    return;
  }
  const ids = getIdArray(req.query.ids);
  if (req.query.type === 'member')
    Promise.all(ids.map(id => deleteMember(id)))
      .then(result => { respond(req, res, null, result, 'Deleted'); })
      .catch(e => { respond(req, res, e); });
  else if (req.query.type === 'subteam')
    Promise.all(ids.map(id => deleteSubteam(id)))
      .then(result => { respond(req, res, null, result, 'Deleted'); })
      .catch(e => { respond(req, res, e); });
  else
    respond(req, res, 'invalid type');
};
