// =============
// FILE IS OBSOLETE to DASHBOARD
// =============


var createSubscriber  = require('pg-listen');
var bole              = require('bole')
var config            = require('./config')

var log = bole('wpd-server')

const channel = `datalake-data-change`;

// pg-listen
// const url = 'postgres://username:password@localhost/database'
// const databaseURL = `postgres://${cn.user}:${cn.password}@${cn.host}:${cn.port}/${cn.database}`

// Accepts the same connection config object that the "pg" package would take
dbSubscriber = createSubscriber(config.azurePostgresdb)
// console.log(`Subscribed to postgres notification channel: ${channel}`);
log.info(`Subscribed to postgres notification channel: ${channel}`)

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

module.exports = dbSubscriber