var express = require('express')

// ** *
// var app = express()
// var expressWs = require('express-ws')
var expressWs = require('@small-tech/express-ws')
var expressWs = expressWs(express());
var app = expressWs.app;

app.set('views', __dirname)

app.use(express.json()) // for parsing application/json
// app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// See the README about ordering of middleware
// Load the routes ("controllers" -ish)
app.use(require('./site/router'))
app.use('/floodmemory', require('./floodmemory/router'))
app.use('/users', require('./user/router'))
app.use('/hot', require('./hot/router'))
app.use('/dashboard', require('./dashboard/router'))

// FINALLY, use any error handlers
app.use(require('./error/not-found'))


// Export the app instance for unit testing via supertest
module.exports = app
