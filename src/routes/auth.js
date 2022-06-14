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

// User login - will require a token to be passed - this will have to be changed
router.post('/login', async(req, res) => {
    const {error} = userLoginValidation(req.body)
    if(error){
        // Validation 1 - Summarised error message
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // Validation 2 - Check user is not registered
    const userExists = await User.findOne({email:req.body.email})
    if(!userExists){
        return res.status(400).send({message:'Email account not found. Please log in with a valid account'})
    }

    // Validation 3 - Password decription and validation
    const userPasswordValidation = await bcryptjs.compare(req.body.password, userExists.password)
    if(!userPasswordValidation){
        return res.status(400).send({message:'Password is wrong'})
    }

    // Auth-Token Generation
    const authToken = jsonwebtoken.sign({_id:userExists._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', authToken).send({'auth-token':authToken})
    
})
 
// Model Export
module.exports = router