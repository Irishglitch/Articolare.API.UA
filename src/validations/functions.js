/**
 * The functions.js allows information to be retrived by users when logged into the application. All functions within the API.
 * This file should not be amended without confirmation first. 
 * @version 1.0.1
 * @author Murilo Silvestre | Property of Articolare Ltd
 * @email info@foireann.com
 */

// Libraries
const express = require('express')
const router = express.Router()


// Functions
// Get user data 'Name', 'LastNem', 'Email', and 'Account type'
function getUserName (item) {
    // The endpoint provides the user detail. Function will only collected and display the information. 
    let userDetail = []
    let accountT = 'Premium'
    
    // Checking account type
    if(!item.accountTypePremium){
        accountT = 'Free'
    }
    
    // Adding data to array
    userDetail.push({
        name: item.name,
        email: item.email,
        accountType: accountT
    })
    return userDetail;

}

module.exports = {getUserName}