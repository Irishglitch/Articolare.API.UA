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
    _id:{
        type:mongoose.Types.ObjectId,
        required:true
    },
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
    accountType:{ // All accounts are going to be set as 'False' if paid, change to True.
        type:String,
        required: false,
        default: null
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
    passwordRecoveryToken:{
        type:String,
        required:false,
        min:36,
        max:36,
        default: null
    },
    activationToken:{
        type:String,
        required:false,
        min:36,
        max:36,
        default: null
    },
    recoveryTokenExpireDate:{
        type:Date,
        required: false,
        default:null
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
    },
    language:{
        type:String,
        required: false,
        default: null
    }

})
const User = mongoose.model('users', userSchema)
function getNewUser(
    name,
    lastName,
    email,
    hashedPassword,
    newActivationToken,
    language,
){
    return new User({
        _id: mongoose.Types.ObjectId(),
        name:name,
        lastName:lastName,
        email:email,
        password:hashedPassword,
        activationToken: newActivationToken,
        isActive: false,
        language: language
    })
}
// Module Exports
module.exports ={
    User: User,
    GetNewUser:getNewUser
}

