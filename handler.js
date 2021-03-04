'use strict';
var mysql = require('mysql');
const config = require('./config.json');

var client  = mysql.createPool({
  connectionLimit : 10,
  host            : config.dbhost,
  user            : config.dbUsername,
  password        : config.dbPassword,
  database        : config.database
});

const db = require("./models");
const Measurements = db.measurements;

module.exports.transform = async (event) => {
  console.log(JSON.stringify(event));
  let records = [];
  for(let i = 0; i<event.records.length; i++) {
      let payload = new Buffer(event.records[i].data, 'base64').toString('ascii');
      console.log(`PAYLOAD: ${ JSON.stringify({payload}) }`)
      payload = JSON.parse(payload);
      payload.decoded = true;
      records.push({
        recordId: event.records[i].recordId,
        result: 'Ok',
        data: Buffer.from(JSON.stringify(payload)).toString('base64')});
        const now = new Date();
        console.log('--->data', data);
        try {
          const iotParams = await Measurements.create({
            lat: 2,
            lon: 3
            
          });
        console.log('--->created', iotParams);
        console.log('--->send message v1', now);
        } catch(err) {
          console.log('--->err', err);
        }
  }
  console.log(`Return: ${ JSON.stringify({records}) }`)
  return Promise.resolve({records});
};
