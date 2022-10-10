var config = module.exports
var PRODUCTION = process.env.NODE_ENV === 'production'

config.express = {
  port: process.env.EXPRESS_PORT || 9090,
  ip: '127.0.0.1'
}

config.postgresdb = {
  port: process.env.POSTGRESDB_PORT || 25432,
  host: process.env.POSTGRESDB_HOST || 'localhost',
  databaseName: 'wpdWiki',
  schema: 'wpdapi'
}

config.azurePostgresdb = {
  host: 'database.azure.com',
  port: 5432,
  database: 'database',
  user: 'username',
  password: 'password',
  max: 20, // use up to 20 connections
  ssl: true
  // "types" - in case you want to set custom type parsers on the pool level
}

config.wiki = {
  port: process.env.WIKI_PORT || 8080,
  host: process.env.WIKI_HOST || 'localhost',
  groupId: 4
}

config.wikiApi = {
  url: 'http://'+ config.wiki.host +':'+ config.wiki.port +'/graphql'
}

config.wikiApiUserCredentials = {
  username: "api@wpd.com",
  password: "api@wpd.com"
}

config.websocketTimeout = 900000

if (PRODUCTION) {
  // for example
  config.express.ip = '0.0.0.0';
  config.postgresdb.host = 'waterproofing.geog.uni-heidelberg.de';
  config.wiki.host = 'waterproofing.geog.uni-heidelberg.de';
}
