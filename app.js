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
require('dotenv/config')


// Middleware & Routers
app.use(bodyParser.json())
const userAuthRoute = require('./src/routes/auth')

// Endpoints
app.use('/', userAuthRoute)


// Connection to the mongoDB
mongoose.connect(process.env.DB_CONNECTOR, () =>{
    console.log('DB connection is running!')
})

// Port
app.listen(3000, () =>{
    console.log('Server is running!')
})