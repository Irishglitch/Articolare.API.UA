/**
 * The retrival.js allows information to be retrived by users when logged into the application.
 * This file should not be amended without confirmation first. 
 * @version 1.0.1
 * @author Murilo Silvestre | Property of Articolare Ltd
 * @email info@foireann.com
 */

// Libraries
const express = require('express')
const router = express.Router()
const accessVerify = require('../validations/tokenVerification') // Token verification.

// Middleware and routers
const User = require('../models/User')
const {default: mongoose} = require('mongoose') // Access to DB.
const {response} = require('express') // Ability to return something to the user. 



// Access view
// Retrieve user information 'Email', 'Name' and 'Account Type'
router.get('/user', async(req, res) => {
    try {
        const userDataRetrival = await User.findOne(req.user._id)
        if (userDataRetrival) {
            console.log('here')
        } else {
            console.log('else here')
        }
        
    } catch (error) {
        console.log(error.stack)
    }
    
})
// Model Export
module.exports = router