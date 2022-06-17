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
const userDataFunction = require('../validations/functions')

// Middleware and routers
const User = require('../models/User')
const {default: mongoose} = require('mongoose') // Access to DB.
const {response} = require('express') // Ability to return something to the user. 



// Access view
// Retrieve user information 'Email', 'Name' and 'Account Type'
router.get('/user', accessVerify, async (req, res) => {
    // The the endpoint collects the id of the user logged in, and once logged in passes to the function.
   try {
       const userFound = await User.findById(req.user._id)

       // Passing the user detail to the function.
       const getUserDetail = userDataFunction.getUserName(userFound)

       if(getUserDetail){
           res.send(getUserDetail)
       } else {
           res.status(400)
       }
   } catch (error) {
       res.status(400)
   }
})

// Delete user account
router.delete('/delete/:id', function(req, res){
    // Variable for the user id.
    let id = req.params.id;
    
    // Delete user account.
    User.findOneAndRemove({_id: id}, function(error){
        if(error){
            console.log(error);
            return res.status(500).send();
        }
        return res.status(200).send();
    })
})







// Model Export
module.exports = router