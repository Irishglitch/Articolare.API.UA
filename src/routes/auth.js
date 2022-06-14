/**
 * The auth.js provides essential information about all required user authentication.
 * This file should not be amended without confirmation first. 
 * @version 1.0.1
 * @author Murilo Silvestre | Property of Articolare Ltd
 * @email info@foireann.com
 */


// Libraires
const express = require('express')
const router = express.Router()

const User = require('../models/User')

router.post('/register', async(req, res)=>{
    console.log(req.body)
})

// Model Export
module.exports = router