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
    isActive:{ // All accounts are going to be set as 'False' if paid, change to True.
        type:Boolean,
        required: true,
        default:false
    },
    changePasswordNextAccess:{ // Forces user to redefine the password on the next access.
        type:Boolean,
        required: true,
        default:false
    },
    createdAt:{
        type:Date,
        required: true,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        required: false,
        default:null
    }
})
const User = mongoose.model('users', userSchema)
function getNewUser(
    name,
    lastName,
    email,
    hashedPassword
){
    return new User({
        name:name,
        lastName:lastName,
        email:email,
        password:hashedPassword
    })
}
// Module Exports
module.exports ={
    User: User,
    GetNewUser:getNewUser
}

