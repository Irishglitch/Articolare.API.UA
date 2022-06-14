/**
 * The User.js provides essential information about user structure within the DB.
 * This file should not be amended without confirmation first. 
 * @version 1.0.1
 * @author Murilo Silvestre | Property of Articolare Ltd
 * @email info@foireann.com
 */


// Libraries 
const mongoose = require('mongoose')

// Data Model
const userSchema = mongoose.Schema({
    // This is the actual schema used within the database.
    email:{
        type:String,
        required:true, 
        min:3,
        max:256
    },
    password:{
        type:String,
        required:true, 
        min:8,
        max:1024
    },
    name:{
        type:String,
        required:true, 
        min:3,
        max:256
    },
    lastName:{
        type:String,
        required:true, 
        min:3,
        max:256
    },
    accountTypePremium:{ // All accounts are going to be set as 'False' if paid, change to True.
        type:Boolean,
        default:false
    },
    date:{
        type:Date,
        default:Date.now
    }
})

// Module Exports
module.exports = mongoose.model('users', userSchema)