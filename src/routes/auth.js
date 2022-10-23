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

const User = require('../models/User').User
const UserHandler = require('../models/User')
const {userRegistrationValidation, userLoginValidation, passwordRecoveryValidation} = require('../validations/validation') // All validations for login and registration.
const { default: mongoose } = require('mongoose') // Ability to connect to the DB.
const { v4: uuidv4 } = require('uuid');

;

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
    const addNewUser = UserHandler.GetNewUser(
        req.body.name,
        req.body.lastName,
        req.body.email,
        hashedPassword
    )
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

router.patch('/recoveryPassword',async(req, res) => {
    const {error} = passwordRecoveryValidation(req.body)
    if(error) {
        // Validation 1 - Summarised error message
        return res.status(400).send({message: error['details'][0]['message']})
    }
    const curUser = await User.findOne({email:req.body.email})
    if(curUser){
        const now = Date.now();
        curUser.passwordRecoveryToken = uuidv4();
        curUser.recoveryTokenExpireDate = (now + 86400000);
        curUser.updatedAt = now;
        curUser.save();
    }

    res.end();

})


function sendMail(){
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'youremail@gmail.com',
            pass: 'yourpassword'
        }
    });

    var mailOptions = {
        from: 'youremail@gmail.com',
        to: 'myfriend@yahoo.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
// Model Export
module.exports = router