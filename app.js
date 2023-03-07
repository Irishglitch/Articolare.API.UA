/**
 * The app.js provides essential information to start and run this RESTful API for Articolare's user management and user authentication.
 * @version 1.0.1
 * @author Murilo Silvestre | Property of Articolare Ltd
 * @email info@foireann.com
 */


// Libraries needed
const express = require('express')
const app = express ()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
var cors = require('cors');

require('dotenv/config')
// Middleware & Routers
app.use(bodyParser.json())
const userAuthRoute = require('./src/routes/auth')
const userDetailsGet = require('./src/routes/retrival')
const paymentsRoutes = require('./src/routes/payments')
const subscription = require('./src/models/Subscription')
// app.use(cors({
//     origin: 'http://localhost:8080',
// }))
app.use(cors())
// Endpoints
app.use('/', userAuthRoute) // For user access login and register
app.use('/', userDetailsGet)
app.use('/',paymentsRoutes)
// Connection to the mongoDB
mongoose.connect(process.env.DB_CONNECTOR, () =>{
    console.log('DB connection is running!')
})

subscription.PopulateSubscriptionTable()
    .then(()=> console.log('Subscription table populated with success.'))
    .catch(() => console.error('Error population subscription table.'))
// Port
app.listen(3000, () =>{
    console.log('Server is running!')
})
