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
        // const { lat, lon, level, speed } = payload;
        try {
          let payload = new Buffer(event.records[i].data, 'base64').toString('ascii');
      console.log(`PAYLOAD: ${ JSON.stringify({payload}) }`)
      payload = JSON.parse(payload);
      payload.decoded = true;
        const now = new Date();
        if (!payload) break;
        const { lat, lon, level, speed, operatorname, mcc, mnc, node, cellid, network_type, qual, snr, cqi, lterssi, psc,
          arfcn, ta, ip, dl_bitrate, nlac1, ncellid1, nrxlev1, nqual1, narfcn1, nlac2, ncellid2,
          nrxlev2, nqual2, narfcn2, nlac3, ncellid3, nrxlev3, 
          // nqual3, narfcn3, nlac4, ncellid4, nrxlev4, nqual4, narfcn4, nlac5, ncellid5, nrxlev5, nqual5, narfcn5, nlac6, ncellid6, nrxlev6, nqual6, narfcn6, event, eventdetails,
          // accuracy, locationsource, altitude, conntype, conninfo, avgping, minping, maxping, stdevping, pingloss, testdlbitrate, testulbitrate, testulmaxbitrate, network_typenum, msisdn, imsi, imei, phone_type, band, bandwidth, comment,
          // battery, charging, username, password, teststate, buffer, credits, ctime, imported, versionname,
        } = payload;


        const latestRecord = await Measurements.findOne({
          where: {}, 
          order: [['created_at', 'DESC']]
        })
        const counterRecord = await Measurements.count(); 
        if (counterRecord > 0) {
          console.log('-->latest Record', latestRecord);
          const { cellid: selectedCellid, lterssi: selectedLteRssi } = latestRecord;
          console.log('--->selected cellid', selectedCellid);
          console.log('-->cellid', cellid);
          if (selectedCellid!= null && selectedCellid != cellid) {
            throw new Error('Cellid Data has been changed')
          }
          if (selectedLteRssi && (selectedLteRssi > 15 && lterssi < 15)) {
            throw new Error('Rssi is Unable state ')
          }
            
        }
        const iotParams = await Measurements.create({
          lat,
          lon,
          level,
          speed,
          operatorname,
          cellid,
          lterssi,
        });
      
        } catch(err) {
          console.log('--->err', err);
          throw err;
        }
  }
  console.log(`Return: ${ JSON.stringify({records}) }`)
  return Promise.resolve({records});
};
