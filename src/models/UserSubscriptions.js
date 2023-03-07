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
const userSubscriptionSchema = mongoose.Schema({
    // This is the actual schema used within the database.
    _id:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    idUser:{
        type:mongoose.Types.ObjectId,
        ref:'users',
        required:true
    },
    idSubscription:{
        type:mongoose.Types.ObjectId,
        ref:'subscription',
        required:true
    },
    isActive:{ // All accounts are going to be set as 'False' if paid, change to True.
        type:Boolean,
        required: true,
        default:true
    },
    startDate:{
        type:Date,
        required: true,
        default:Date.now
    },
    expireDate:{
        type:Date,
        required: false
    },
})

const UserSubscription = mongoose.model('userSubscription', userSubscriptionSchema)

function addNewUserSubscription(
    _idUser,
    _idSubscriptionType,
    _expireDate
){
    return new UserSubscription({
        _id: mongoose.Types.ObjectId(),
        idUser: _idUser,
        idSubscriptionType: _idSubscriptionType,
        expireDate: _expireDate
    })
}
// Module Exports
module.exports ={
    AddNewUserSubscription: addNewUserSubscription
}

