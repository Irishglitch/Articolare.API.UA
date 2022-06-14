/**
 * The tokenValidation.js provides essential information about token validation for user login and access.
 * This file should not be amended without confirmation first. 
 * @version 1.0.1
 * @author Murilo Silvestre | Property of Articolare Ltd
 * @email info@foireann.com
 */

// Libraries 
const jsonwebtoken = require('jsonwebtoken')

// Middleware
// Control functions for user related verification
function tokenAuthentication(req,res,next){
    const authTokenExtract = req.header('auth-token')
    if(!authTokenExtract){
        return res.status(401).send({message:'Please login with a valid account'})
    }
    try{
        const tokenVerified = jsonwebtoken.verify(authTokenExtract, process.env.TOKEN_SECRET)
        req.user = tokenVerified // Setting request.user = Token. Contains information about user ID.
        next()
    }catch(error){
        return res.status(401).send({message:'Please login with a valid account. Ivalid access'})
    }
}
