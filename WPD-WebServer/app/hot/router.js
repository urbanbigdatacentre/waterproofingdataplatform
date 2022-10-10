var express           = require('express')
var expressWs         = require('@small-tech/express-ws')
var join              = require('path').join
// var cors           = require('cors')
// var createSubscriber  = require('pg-listen');
var pgp               = require('pg-promise')(/* options */)
var bole              = require('bole');
var dbSubscriber    = require('../initPglisten')
var sql_query         = require('../hot/sql_query')
var config            = require('../config')
// const WebSocket     = require('ws');

// var expressWs = require('express-ws')(express());

var router = new express.Router()
var expressWs = expressWs(express());
var log = bole('wpd-server')

// global variable of WebSocket Server
let globalWss = null;

/* const cn = {
  host: 'localhost',
  port: 25432,
  database: 'wpdWiki',
  user: 'admin',
  password: 'admin',
  max: 30, // use up to 30 connections
  ssl: false
  // "types" - in case you want to set custom type parsers on the pool level
}; */

var db = pgp(config.azurePostgresdb)

// const dbSchema = 'datalake';
const dbSchema = 'public';
const userSchema = 'auth';
// let dbSubscriber = null;
const channel = `datalake-data-change`;

let resTemplate = {
  'responseTimestamp': null,
  'responseData': null,
  'success': true
}

// initpgListen()

/* function initpgListen() {
  // pg-listen
  // const url = 'postgres://username:password@localhost/database'
  // const databaseURL = 'postgres://admin:admin@localhost:25432/wpdWiki'
  // const databaseURL = `postgres://${cn.user}:${cn.password}@${cn.host}:${cn.port}/${cn.database}`

  // Accepts the same connection config object that the "pg" package would take
  // dbSubscriber = createSubscriber({ connectionString: databaseURL })
  dbSubscriber = createSubscriber(config.azurePostgresdb)
  console.log(`Subscribed to postgres notification channel: ${channel}`);
  // log.info('Subscribed to postgres notification channel: ', channel)
  
  dbSubscriber.events.on("error", (error) => {
    console.error("Fatal database connection error:", error)
    process.exit(1)
  })

  process.on("exit", () => {
    dbSubscriber.close();
  })

  dbSubscriber.connect().then(
    ()=>{
      // console.log('>>> connected to wpd-db '+cn.host)
      log.info('connected to wpd-db '+ config.azurePostgresdb.host)
      dbSubscriber.listenTo(channel)
    },
    ()=>{
      dbSubscriber.close();
      // console.log("Could not connect to wpd-db");
      log.warn("Could not connect to wpd-db "+ config.azurePostgresdb.host)
    }
  );
} */

function getData(ws, req) {
  log.info('>>> hot >>> getData')
  // sample url params
  // ws://localhost:9090/hot/data?type=stacao_pluviometricas&time=2021-07-15/2021-07-16&lat=-9.98132&lon=-67.81544&buffer=2000&limit=5

  let tempFormType = req.query.type
  // ISO 8601 time interval string eg: 2015-01-17T09:50:04/2015-04-17T08:29:55
  let timeRange = req.query.time
  let lat = req.query.lat
  let lon = req.query.lon
  let buffer = req.query.buffer
  let limit = req.query.limit
  let timeStart = null
  let timeEnd = null
  // let bbox = req.query.bbox
  if(timeRange) {
    timeStart = timeRange.substring(0, timeRange.indexOf('/'))
    timeEnd = timeRange.substring(timeRange.indexOf('/') + 1, timeRange.length)
  }

  // check what type of data requested based on params received
  // console.log(tempFormType, lat, lon, buffer, timeStart, timeEnd, limit, dbSchema)
  let tempSql_Query = ''
  let tempSql_QueryById = ''
  // spatial with point and buffer
  if((lat && lon && buffer) && (!timeStart && !timeEnd)){
    tempSql_Query = sql_query.dataQuery(tempFormType, lat, lon, buffer, timeStart, timeEnd, limit, dbSchema, userSchema)
    // no fcode required as we check fcode with tempFormType befreo firing query
    // no limit required as its query by ID which should return just 1 row
    tempSql_QueryById = sql_query.notifybyIdWithFia(tempFormType, lat, lon, buffer, timeStart, timeEnd, dbSchema, userSchema)
  }
  // temporal
  else if((!lat && !lon && !buffer) && (timeStart && timeEnd)){
    tempSql_Query = sql_query.dataQuery(tempFormType, lat, lon, buffer, timeStart, timeEnd, limit, dbSchema, userSchema)
    // if request is for temporal then newly inserted values 
    tempSql_QueryById = sql_query.notifybyIdWithFia(tempFormType, lat, lon, buffer, timeStart, timeEnd, dbSchema, userSchema)
  }
  // only bbox
  // else if(bbox && (!lat && !lon && !buffer))
  //   tempSql_Query = sql_query.dataByBbox(tempFormType, bbox, dbSchema)

  // spatio-temporal with point and buffer
  else if((lat && lon && buffer) && (timeStart && timeEnd)){
    tempSql_Query = sql_query.dataQuery(tempFormType, lat, lon, buffer, timeStart, timeEnd, limit, dbSchema, userSchema)
    tempSql_QueryById = sql_query.notifybyIdWithFia(tempFormType, lat, lon, buffer, timeStart, timeEnd, dbSchema, userSchema)
  }
  // only form name
  else if((!lat && !lon && !buffer) && (!timeStart && !timeEnd) && (tempFormType)){
    tempSql_Query = sql_query.dataQuery(tempFormType, lat, lon, buffer, timeStart, timeEnd, limit, dbSchema, userSchema)
    tempSql_QueryById = sql_query.notifybyIdWithFia(tempFormType, lat, lon, buffer, timeStart, timeEnd, dbSchema, userSchema)
  }
  else {
    log.error('Invalid Parameter passed')
    resTemplate.success = false
    resTemplate.responseData = 'Invalid Parameter passed'
    resTemplate.responseTimestamp = new Date().toISOString()
    ws.send(JSON.stringify(resTemplate))
    ws.close()
    return
  }
  // console.log('tempSql_Query = ', tempSql_Query)
  
  db.one(tempSql_Query)
  .then( data => {
    // check if form type doesn't exist in DB
    if(!data.array_to_json) {
      log.error('No data for type :'+ tempFormType)
      resTemplate.success = false
      resTemplate.responseData = 'No data for type :'+ tempFormType
      resTemplate.responseTimestamp = new Date().toISOString()
      ws.send(JSON.stringify(resTemplate))
      // ws.close()
      // return
    } else {
      resTemplate.success = true
      resTemplate.responseTimestamp = new Date().toISOString()
      resTemplate.responseData = data
      // console.log('sent response at ', resTemplate.responseTimestamp)
      log.info('sent response at ', resTemplate.responseTimestamp)
      ws.send(JSON.stringify(resTemplate))
    }
    // send any delta changes/newly added data to all clients listening to it
    // get all clients listening to ws
    if(tempSql_QueryById !== '')
    dbSubscriber.notifications.on(channel, (payload) => {
      // Payload as passed to dbSubscriber.notify() (see below)

      if(ws.readyState === ws.OPEN) 
      if(payload.formtypecode)
        if(payload.formtypecode === tempFormType)
          if(payload.formsanswersid) {
            log.info("Received notification in 'datalake-data-change':", payload)
            // db.one(sql_query.byId(payload.formsanswersid, dbSchema))
            db.oneOrNone(tempSql_QueryById, [payload.formsanswersid])
              .then( data => {
                if(data && data.array_to_json){
                  resTemplate.success = true
                  resTemplate.responseTimestamp = new Date().toISOString()
                  resTemplate.responseData = data
                  ws.send(JSON.stringify(resTemplate))
                  log.info("New data send ", payload)
                }
              })
              .catch( error => {
                // console.log('ERROR:', error)
                // console.log('ERROR while executing DB-query to fetch data :', error)
                log.error('ERROR while executing DB-query to fetch data :'+ error.message)
                resTemplate.success = false
                resTemplate.responseData = 'ERROR while executing DB-query to fetch data :'+ error.message
                resTemplate.responseTimestamp = new Date().toISOString()
                ws.send(JSON.stringify(resTemplate))
                // ws.close()
              })
          }
    })

  })
  .catch( error => {
    // console.log('ERROR while executing DB-query to fetch data :', error)
    log.error('ERROR while executing DB-query to fetch data :'+ error.message)
    resTemplate.success = false
    resTemplate.responseData = 'ERROR while executing DB-query to fetch data :'+ error.message
    resTemplate.responseTimestamp = new Date().toISOString()
    ws.send(JSON.stringify(resTemplate))
    ws.close()
  })

}

function getDataByBbox(ws, req) {
  log.info('>>> hot >>> getDataByBbox')
  // sample url params
  // ws://localhost:9090/hot/databybbox?type=PLUVIOMETERS_OFFICIAL&bbox=-67.98451956245826,-10.09049971309554,-67.69796501946632,-9.900096285440455

  let tempFormType = req.query.type
  let limit = req.query.limit
  let bbox = req.query.bbox

  // check what type of data requested based on params received
  let tempSql_Query = ''
  // only bbox
  if(bbox)
    tempSql_Query = sql_query.dataByBbox(tempFormType, bbox, dbSchema, userSchema)

  db.one(tempSql_Query)
  .then( data => {
    // check if form type doesn't exist in DB
    if(!data.array_to_json) {
      log.error('No data for type :'+ tempFormType)
      resTemplate.success = false
      resTemplate.responseData = 'No data for type :'+ tempFormType
      resTemplate.responseTimestamp = new Date().toISOString()
      ws.send(JSON.stringify(resTemplate))
      // ws.close()
      // return
    } else {
      resTemplate.success = true
      resTemplate.responseTimestamp = new Date().toISOString()
      resTemplate.responseData = data
      // console.log('sent response at ', resTemplate.responseTimestamp)
      log.info('sent response at ', resTemplate.responseTimestamp)
      ws.send(JSON.stringify(resTemplate))
    }
    // send any delta changes/newly added data to all clients listening to it
    // get all clients listening to ws
    dbSubscriber.notifications.on(channel, (payload) => {
      // Payload as passed to dbSubscriber.notify() (see below)
      
      if(ws.readyState === ws.OPEN) 
      if(payload.formtypecode)
        if(payload.formtypecode === tempFormType)
          if(payload.formsanswersid) {
            log.info("Received notification in 'datalake-data-change':", payload)

            db.oneOrNone(sql_query.byIdWithBbox(payload.formsanswersid, bbox, dbSchema, userSchema))
              .then( data => {
                if(data && data.array_to_json){
                  resTemplate.success = true
                  resTemplate.responseTimestamp = new Date().toISOString()
                  resTemplate.responseData = data
                  ws.send(JSON.stringify(resTemplate))
                  // broadcastToAllClients(ws, resTemplate)
                  log.info("New data send ", payload)
                }
              })
              .catch( error => {
                // console.log('ERROR:', error)
                // console.log('ERROR while executing DB-query to fetch data :', error)
                log.error('ERROR while executing DB-query to fetch data :'+ error.message)
                resTemplate.success = false
                resTemplate.responseData = 'ERROR while executing DB-query to fetch data :'+ error.message
                resTemplate.responseTimestamp = new Date().toISOString()
                ws.send(JSON.stringify(resTemplate))
                // ws.close()
              })
          }
    })
  })
  .catch( error => {
    // console.log('ERROR while executing DB-query to fetch data :', error)
    log.error('ERROR while executing DB-query to fetch data :'+ error.message)
    resTemplate.success = false
    resTemplate.responseData = 'ERROR while executing DB-query to fetch data :'+ error.message
    resTemplate.responseTimestamp = new Date().toISOString()
    ws.send(JSON.stringify(resTemplate))
    ws.close()
  })

  

}

function getHttpDataByBbox(req, res) {
  log.info('>>> hot >>> getDataByBbox')
  // sample url params
  // ws://localhost:9090/hot/databybbox?type=PLUVIOMETERS_OFFICIAL&bbox=-67.98451956245826,-10.09049971309554,-67.69796501946632,-9.900096285440455

  let tempFormType = req.query.type
  let limit = req.query.limit
  let bbox = req.query.bbox

  // check what type of data requested based on params received
  let tempSql_Query = ''
  // only bbox
  if(bbox)
    tempSql_Query = sql_query.dataByBbox(tempFormType, bbox, dbSchema, userSchema)

  db.one(tempSql_Query)
  .then( data => {
    // check if form type doesn't exist in DB
    if(!data.array_to_json) {
      log.error('No data for type :'+ tempFormType)
      resTemplate.success = false
      resTemplate.responseData = 'No data for type :'+ tempFormType
      resTemplate.responseTimestamp = new Date().toISOString()
      res.send(JSON.stringify(resTemplate))
      return
    }
    resTemplate.success = true
    resTemplate.responseTimestamp = new Date().toISOString()
    resTemplate.responseData = data
    // console.log('sent response at ', resTemplate.responseTimestamp)
    log.info('sent response at ', resTemplate.responseTimestamp)
    res.send(JSON.stringify(resTemplate))
  })
  .catch( error => {
    // console.log('ERROR while executing DB-query to fetch data :', error)
    log.error('ERROR while executing DB-query to fetch data :'+ error.message)
    resTemplate.success = false
    resTemplate.responseData = 'ERROR while executing DB-query to fetch data :'+ error.message
    resTemplate.responseTimestamp = new Date().toISOString()
    res.send(JSON.stringify(resTemplate))
  })

  

}

/**
 * Gets only Forms data. Can have Spatial filter params
 * 
 * @param {*} ws 
 * @param {*} req 
 */
function getFormData(ws, req) {
  log.info('>>> hot >>> getFormData')
  // sample url params
  // ws://localhost:9090/hot/formsanswers?type=RAIN_FORM&lat=-23.623&lon=-46.5637&buffer=50000&limit=30
  // wss://waterproofing.geog.uni-heidelberg.de/wss/hot/formsanswers?type=RAIN_FORM&lat=-23.623&lon=-46.5637&buffer=50000&time=2021-09-13/2021-09-17
  // ws://localhost:9090/hot/formsanswers?type=PLUVIOMETERS_OFFICIAL&bbox=-67.98451956245826,-10.09049971309554,-67.69796501946632,-9.900096285440455

  let tempFormType = req.query.type
  let lat = req.query.lat
  let lon = req.query.lon
  let buffer = req.query.buffer
  let limit = req.query.limit
  let bbox = req.query.bbox
  // ISO 8601 time interval string eg: 2015-01-17T09:50:04/2015-04-17T08:29:55
  let timeRange = req.query.time
  let timeStart = null
  let timeEnd = null
  let fiaAttribute = null
  let user = req.query.user
  
  if(timeRange) {
    timeStart = timeRange.substring(0, timeRange.indexOf('/'))
    timeEnd = timeRange.substring(timeRange.indexOf('/') + 1, timeRange.length)
  }

  // check what type of data requested based on params received
  // console.log(tempFormType, lat, lon, buffer, timeStart, timeEnd, limit, dbSchema)
  let tempSql_Query = ''
  let tempSql_QueryById = ''

  // check if the tempFormType is citizen generated data. TIP: _FORM ending 
  if(tempFormType.indexOf('_FORM') !== -1) {
    fiaAttribute = 'situation'
  } 
  // spatial with point and buffer
  if((lat && lon && buffer) && (tempFormType) && (!bbox) && (!timeStart && !timeEnd)) {
    tempSql_Query = sql_query.formsAnswersData(tempFormType, lat, lon, buffer, null, null, limit, fiaAttribute, user, dbSchema, userSchema)
    // no limit required as its query by ID which should return just 1 row
    tempSql_QueryById = sql_query.notifybyId(lat, lon, buffer, null, null, fiaAttribute, user, dbSchema, userSchema)
  }
  // only bbox
  else if(bbox && tempFormType && (!timeStart && !timeEnd)){
    tempSql_Query = sql_query.formAnswersByBbox(tempFormType, bbox, dbSchema, userSchema)
    // tempSql_QueryById = sql_query.notifybyId(lat, lon, buffer, dbSchema)
    tempSql_QueryById = sql_query.byIdWithBbox(tempFormType, bbox, dbSchema, userSchema)
  }
  // spatio-temporal with point and buffer
  else if((lat && lon && buffer) && (timeStart && timeEnd) && (tempFormType) && (!bbox)){
    tempSql_Query = sql_query.formsAnswersData(tempFormType, lat, lon, buffer, timeStart, timeEnd, limit, fiaAttribute, user, dbSchema, userSchema)
    tempSql_QueryById = sql_query.notifybyId(lat, lon, buffer, timeStart, timeEnd, fiaAttribute, user, dbSchema, userSchema)
  }
  // only form name
  else if((!lat && !lon && !buffer) && (tempFormType) && (!bbox) && (!timeStart && !timeEnd)){
    tempSql_Query = sql_query.formsAnswersData(tempFormType, lat, lon, buffer, null, null, limit, fiaAttribute, user, dbSchema, userSchema)
    tempSql_QueryById = sql_query.notifybyId(lat, lon, buffer, null, null, fiaAttribute, user, dbSchema, userSchema)
  }
  else {
    log.error('Invalid Parameter passed')
    resTemplate.success = false
    resTemplate.responseData = 'Invalid Parameter passed'
    resTemplate.responseTimestamp = new Date().toISOString()
    ws.send(JSON.stringify(resTemplate))
    ws.close()
    return
  }
  // console.log('tempSql_Query = ', tempSql_Query)
  // console.log('tempSql_QueryById = ', tempSql_QueryById)

  if(tempSql_Query)
  db.one(tempSql_Query)
  .then( data => {
    // check if form type doesn't exist in DB
    if(!data.array_to_json) {
      log.error('No data for type :'+ tempFormType)
      resTemplate.success = false
      resTemplate.responseData = 'No data for type :'+ tempFormType
      resTemplate.responseTimestamp = new Date().toISOString()
      ws.send(JSON.stringify(resTemplate))
      // ws.close()
      // return
    } else {
      resTemplate.success = true
      resTemplate.responseTimestamp = new Date().toISOString()
      resTemplate.responseData = data
      // console.log('sent response at ', resTemplate.responseTimestamp)
      log.info('sent response at ', resTemplate.responseTimestamp)
      ws.send(JSON.stringify(resTemplate))
    }
    // send any delta changes/newly added data to all clients listening to it
    // get all clients listening to ws
    if(tempSql_QueryById !== '')
    dbSubscriber.notifications.on(channel, (payload) => {
      // Payload as passed to dbSubscriber.notify() (see below)

      if(ws.readyState === ws.OPEN) 
      if(payload.formtypecode)
        if(payload.formtypecode === tempFormType)
          if(payload.formsanswersid) {
            log.info("Received notification in 'datalake-data-change':", payload)
            // db.one(sql_query.byId(payload.formsanswersid, dbSchema))
            db.oneOrNone(tempSql_QueryById, [payload.formsanswersid])
              .then( data => {
                if(data && data.array_to_json){
                  resTemplate.success = true
                  resTemplate.responseTimestamp = new Date().toISOString()
                  resTemplate.responseData = data
                  ws.send(JSON.stringify(resTemplate))
                  log.info("New data send ", payload)
                }
              })
              .catch( error => {
                // console.log('ERROR:', error)
                // console.log('ERROR while executing DB-query to fetch data :', error)
                log.error('ERROR while executing DB-query to fetch data :'+ error.message)
                resTemplate.success = false
                resTemplate.responseData = 'ERROR while executing DB-query to fetch data :'+ error.message
                resTemplate.responseTimestamp = new Date().toISOString()
                ws.send(JSON.stringify(resTemplate))
                // ws.close()
              })
          }
    })

  })
  .catch( error => {
    // console.log('ERROR while executing DB-query to fetch data :', error)
    log.error('ERROR while executing DB-query to fetch data :'+ error.message)
    resTemplate.success = false
    resTemplate.responseData = 'ERROR while executing DB-query to fetch data :'+ error.message
    resTemplate.responseTimestamp = new Date().toISOString()
    ws.send(JSON.stringify(resTemplate))
    ws.close()
  })

}

function getHttpFormData(req, res) {
  log.info('>>> hot >>> getHttpFormData')
  // sample url params
  // ws://localhost:9090/hot/formsanswers?type=RAIN_FORM&lat=-23.623&lon=-46.5637&buffer=50000&limit=30
  // wss://waterproofing.geog.uni-heidelberg.de/wss/hot/formsanswers?type=RAIN_FORM&lat=-23.623&lon=-46.5637&buffer=50000&time=2021-09-13/2021-09-17
  // ws://localhost:9090/hot/formsanswers?type=PLUVIOMETERS_OFFICIAL&bbox=-67.98451956245826,-10.09049971309554,-67.69796501946632,-9.900096285440455

  let tempFormType = req.query.type
  let lat = req.query.lat
  let lon = req.query.lon
  let buffer = req.query.buffer
  let limit = req.query.limit
  let bbox = req.query.bbox
  // ISO 8601 time interval string eg: 2015-01-17T09:50:04/2015-04-17T08:29:55
  let timeRange = req.query.time
  let timeStart = null
  let timeEnd = null
  
  if(timeRange) {
    timeStart = timeRange.substring(0, timeRange.indexOf('/'))
    timeEnd = timeRange.substring(timeRange.indexOf('/') + 1, timeRange.length)
  }

  // check what type of data requested based on params received
  // console.log(tempFormType, lat, lon, buffer, timeStart, timeEnd, limit, dbSchema)
  let tempSql_Query = ''
  let tempSql_QueryById = ''
  // spatial with point and buffer
  if((lat && lon && buffer) && (tempFormType) && (!bbox) && (!timeStart && !timeEnd)) {
    tempSql_Query = sql_query.formsAnswersData(tempFormType, lat, lon, buffer, null, null, limit, dbSchema, userSchema)
    // no fcode required as we check fcode with tempFormType befreo firing query
    // no limit required as its query by ID which should return just 1 row
    // tempSql_QueryById = sql_query.notifybyId(lat, lon, buffer, dbSchema)
  }
  // only bbox
  else if(bbox && tempFormType && (!timeStart && !timeEnd)){
    tempSql_Query = sql_query.formAnswersByBbox(tempFormType, bbox, dbSchema, userSchema)
    // tempSql_QueryById = sql_query.notifybyId(lat, lon, buffer, dbSchema)
    // tempSql_QueryById = sql_query.byIdWithBbox(tempFormType, bbox, dbSchema)
  }
  // spatio-temporal with point and buffer
  else if((lat && lon && buffer) && (timeStart && timeEnd) && (tempFormType) && (!bbox)){
    tempSql_Query = sql_query.formsAnswersData(tempFormType, lat, lon, buffer, timeStart, timeEnd, limit, dbSchema, userSchema)
    // tempSql_QueryById = sql_query.notifybyId(lat, lon, buffer, timeStart, timeEnd, dbSchema)
  }
  // only form name
  else if((!lat && !lon && !buffer) && (tempFormType) && (!bbox) && (!timeStart && !timeEnd)){
    tempSql_Query = sql_query.formsAnswersData(tempFormType, lat, lon, buffer, null, null, limit, dbSchema, userSchema)
    // tempSql_QueryById = sql_query.notifybyId(lat, lon, buffer, dbSchema)
  }
  else {
    log.error('Invalid Parameter passed')
    resTemplate.success = false
    resTemplate.responseData = 'Invalid Parameter passed'
    resTemplate.responseTimestamp = new Date().toISOString()
    res.send(JSON.stringify(resTemplate))
  }
  // console.log('tempSql_Query = ', tempSql_Query)

  if(tempSql_Query)
  db.one(tempSql_Query)
  .then( data => {
    // check if form type doesn't exist in DB
    if(!data.array_to_json) {
      log.error('No data for type :'+ tempFormType)
      resTemplate.success = false
      resTemplate.responseData = 'No data for type :'+ tempFormType
      resTemplate.responseTimestamp = new Date().toISOString()
      res.send(JSON.stringify(resTemplate))
    }
    resTemplate.success = true
    resTemplate.responseTimestamp = new Date().toISOString()
    resTemplate.responseData = data
    // console.log('sent response at ', resTemplate.responseTimestamp)
    log.info('sent response at ', resTemplate.responseTimestamp)
    res.send(JSON.stringify(resTemplate))
  })
  .catch( error => {
    // console.log('ERROR while executing DB-query to fetch data :', error)
    log.error('ERROR while executing DB-query to fetch data :'+ error.message)
    resTemplate.success = false
    resTemplate.responseData = 'ERROR while executing DB-query to fetch data :'+ error.message
    resTemplate.responseTimestamp = new Date().toISOString()
    res.send(JSON.stringify(resTemplate))
  })

}

/**
 * Gets FieldsAnswers data from the requested FormsAnswersId. Can have Temporal filter params
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getFieldAnswersData(req, res) {
  log.info('>>> hot >>> getFieldAnswersData ', req.query)
  const faid = req.query.faid

  // ISO 8601 time interval string eg: 2015-01-17T09:50:04/2015-04-17T08:29:55
  let timeRange = req.query.time
  let timeStart = null
  let timeEnd = null
  if(timeRange) {
    timeStart = timeRange.substring(0, timeRange.indexOf('/'))
    timeEnd = timeRange.substring(timeRange.indexOf('/') + 1, timeRange.length)
  }

  let tempSql_Query = sql_query.fieldsAnswersData(faid, timeStart, timeEnd, dbSchema, userSchema)
  // console.log('tempSql_Query ', tempSql_Query)

  if(faid)
    db.one(tempSql_Query)
    .then(function (data) {
      resTemplate.success = true
      resTemplate.responseTimestamp = new Date().toISOString()
      resTemplate.responseData = data
      console.log('sent response at ', resTemplate.responseTimestamp)
      log.info('sent response at ', resTemplate.responseTimestamp)
      res.send(resTemplate)
    })
    .catch(function (error) {
      console.log('ERROR while executing DB-query to fetch data :', error)
      log.error('ERROR while executing DB-query to fetch data :'+ error.message)
      resTemplate.success = false
      resTemplate.responseData = 'ERROR while executing DB-query to fetch data :'+ error.message
      resTemplate.responseTimestamp = new Date().toISOString()
      res.send(resTemplate)
    })
}

function echo(ws, req) {
  console.log('>>> hot >>> echo')
  ws.on('message', function(msg) {
    ws.send(msg);
  });
}

function broadcast(ws, req) {
  console.log('/hot/broadcast aWss = ', aWss.clients)
  ws.on('message', message => {
    this.getWss().clients.forEach(client => {
      client.send(message)
    })
  })
}

function getLastData(req, res){
  log.info('>>> hot >>> getLastData')

  let type = req.query.type
  let id = req.query.id

  let pluvType = 'PLUVIOMETER_FORM'
  let othersType = ['RAIN_FORM', 'FLOODZONES_FORM', 'RIVERFLOOD_FORM']

  let tempSql_Query = ''

  if (type && id){
    if(othersType.includes(type)){
      tempSql_Query = sql_query.getLastDataForms(type, id, dbSchema, userSchema)
    }else if(type === pluvType){
      tempSql_Query = sql_query.getLastDataPluv(type, id, dbSchema, userSchema)
    }else{
      log.error('Forms type not found (type): '+type)
      resTemplate.success = false
      resTemplate.responseData = 'Forms type not found (type): '+type
      resTemplate.responseTimestamp = new Date().toISOString()
      res.send(JSON.stringify(resTemplate))
      return
    } 
  }else{
    log.error('Need to specify type and id')
    resTemplate.success = false
    resTemplate.responseData = 'Need to specify type and id'
    resTemplate.responseTimestamp = new Date().toISOString()
    res.send(JSON.stringify(resTemplate))
    return
  }

  if(tempSql_Query !== ''){
    db.one(tempSql_Query)
    .then( data => {
      // check if form type doesn't exist in DB
      if(!data.array_to_json) {
        log.error('No data for id :'+ id)
        resTemplate.success = false
        resTemplate.responseData = 'No data for id :'+ id
        resTemplate.responseTimestamp = new Date().toISOString()
        res.send(JSON.stringify(resTemplate))
        return
      }
      resTemplate.success = true
      resTemplate.responseTimestamp = new Date().toISOString()
      resTemplate.responseData = data
      // console.log('sent response at ', resTemplate.responseTimestamp)
      log.info('sent response at ', resTemplate.responseTimestamp)
      res.send(JSON.stringify(resTemplate))
      return
    })
    .catch( error => {
      // console.log('ERROR while executing DB-query to fetch data :', error)
      log.error('ERROR while executing DB-query to fetch data :'+ error.message)
      resTemplate.success = false
      resTemplate.responseData = 'ERROR while executing DB-query to fetch data :'+ error.message
      resTemplate.responseTimestamp = new Date().toISOString()
      res.send(JSON.stringify(resTemplate))
      return
    })
  }
}

function requestHandler(client, request) {
  // console.log('>>> requestHandler ', request.query)
  
  client.room = this.setRoom(request);
  if(Object.keys(request.query).length === 0){
    // console.log('Object.keys(request.query).length ', client)
    resTemplate.success = false
    resTemplate.responseData = 'This endpoint needs a \'type\' param'
    resTemplate.responseTimestamp = new Date().toISOString()
    client.send(JSON.stringify(resTemplate))
    client.close()
    return
  }
  // console.log(`New client connected to ${client.room}`);
  log.info(`New client ${request.socket.remoteAddress} connected to ${client.room}`);
  globalWss = this.getWss()
  
  if(request.url.indexOf('databybbox') !== -1 && request.url.indexOf('formsanswers') === -1)
    getDataByBbox(client, request)
  else if(request.url.indexOf('databybbox') === -1 && request.url.indexOf('formsanswers') === -1)
    getData(client, request)
  else if(request.url.indexOf('formsanswers') !== -1 && request.url.indexOf('databybbox') === -1)
    getFormData(client, request)

  // timeout after 15 min = 900000 milliseconds
  // since we dont want unlimited time ws
  setTimeout(() => {
    closeOnTimeout(client)
  }, config.websocketTimeout)

  client.on('close', () => {
    log.info(`client ${request.socket.remoteAddress} disconnected which was connected to ${client.room}`)
    dbSubscriber.notifications.off(channel, () => {
      console.log('db notifications turned off ')
    })
  });

}

function closeOnTimeout(client) {
  if(client.readyState === client.OPEN) {
    log.info(`Server Timeout, disconnecting... ${client.room}`);
    resTemplate.success = false
    resTemplate.responseData = 'Server Timeout, disconnecting...'
    resTemplate.responseTimestamp = new Date().toISOString()
    client.send(JSON.stringify(resTemplate))
    client.close()
  }
}

function getCapability(req, res) {
  log.info('>>> hot >>> getCapability ', req.query)

  if(! req.query.withtimes){
    // console.log('No time param sent with request')
    log.error('No time param sent with request')
    resTemplate.success = false
    resTemplate.responseData = 'No time parameter sent with request. Please sent withtimes=true or withtimes=false'
    resTemplate.responseTimestamp = new Date().toISOString()
    res.send(resTemplate)
  }
  if(req.query.withtimes && !(req.query.withtimes === 'true' || req.query.withtimes === 'false')){
    // console.log('No time param sent with request')
    log.error('No time param sent with request')
    resTemplate.success = false
    resTemplate.responseData = 'No correct value for time parameter sent. Please sent withtimes=true or withtimes=false'
    resTemplate.responseTimestamp = new Date().toISOString()
    res.send(resTemplate)
  }

  if(req.query.withtimes && req.query.withtimes === 'true')
    db.one(sql_query.getAllFormsTypesWithTime(dbSchema))
    .then(function (data) {
      resTemplate.success = true
      resTemplate.responseTimestamp = new Date().toISOString()
      resTemplate.responseData = data
      console.log('sent response at ', resTemplate.responseTimestamp)
      log.info('sent response at ', resTemplate.responseTimestamp)
      res.send(resTemplate)
    })
    .catch(function (error) {
      console.log('ERROR while executing DB-query to fetch data :', error)
      log.error('ERROR while executing DB-query to fetch data :'+ error.message)
      resTemplate.success = false
      resTemplate.responseData = 'ERROR while executing DB-query to fetch data :'+ error.message
      resTemplate.responseTimestamp = new Date().toISOString()
      res.send(resTemplate)
    })
  
  if(req.query.withtimes && req.query.withtimes === 'false')
    db.one(sql_query.getAllFormsTypesWithoutTime(dbSchema))
    .then(function (data) {
      resTemplate.success = true
      resTemplate.responseTimestamp = new Date().toISOString()
      resTemplate.responseData = data
      console.log('sent response at ', resTemplate.responseTimestamp)
      log.info('sent response at ', resTemplate.responseTimestamp)
      res.send(resTemplate)
    })
    .catch(function (error) {
      console.log('ERROR while executing DB-query to fetch data :', error)
      log.error('ERROR while executing DB-query to fetch data :'+ error.message)
      resTemplate.success = false
      resTemplate.responseData = 'ERROR while executing DB-query to fetch data :'+ error.message
      resTemplate.responseTimestamp = new Date().toISOString()
      res.send(resTemplate)
    })
}

router.use(express.static(join(__dirname, '../../wwwroot')))
// router.use(cors())
router.ws('/echo', echo)
router.ws('/broadcast', broadcast)
router.ws('/data', requestHandler)
router.ws('/databybbox', requestHandler)
router.get('/databybbox', getHttpDataByBbox)
router.ws('/formsanswers', requestHandler)
router.get('/formsanswers', getHttpFormData)
// router.post('/capability', getCapability)
router.get('/capability', getCapability)
router.get('/fieldsanswers', getFieldAnswersData)
// router.ws('/lastdata', requestHandler)
router.get('/lastdata', getLastData)

module.exports = router
