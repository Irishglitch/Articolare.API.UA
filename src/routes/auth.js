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
const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

const User = require('../models/User')
const {userRegistrationValidation, userLoginValidation} = require('../validation/validation') // All validations for login and registration.
const { default: mongoose } = require('mongoose') // Ability to connect to the DB.


// User registration
router.post('/register', async(req, res) => {
    const {error} = userRegistrationValidation(req.body)
    if(error){
        // Summarised error message - for any error.
        return res.status(400).send({message:error['details'][0]['message']})
    }
     // Check user already exists in DB
     const userAlreadyExists = await User.findOne({email:req.body.email})
     if(userAlreadyExists){
         return res.status(400).send({message:'Email already in use'})
     }
 
     // Creating a hash representation for user password.
     const salt = await bcryptjs.genSalt(8)
     const hashedPassword = await bcryptjs.hash(req.body.password,salt)
 
     // Inserting data into DB.
     const addNewUser = new User({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        adminStatus:false,
        password:hashedPassword
     })

     // Try catch to validate and enter data into DB.
     try{
         const userAddedDB = await addNewUser.save()
         res.send(userAddedDB)
     }catch(error){
         res.status(400).send({message:error})
     }
})

// Model Export
module.exports = router