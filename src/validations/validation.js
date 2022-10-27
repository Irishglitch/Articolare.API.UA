/**
 * The validation.js provides essential information about all required user authentication.
 * This file should not be amended without confirmation first. 
 * @version 1.0.1
 * @author Murilo Silvestre | Property of Articolare Ltd
 * @email info@foireann.com
 */

// Libraries
const joi = require('joi')


// Functions
// User registration validation 
const userRegistrationValidation = (data) =>{
    const userSchemaValidation = joi.object({
        name:joi.string().required().min(3).max(256),
        lastName:joi.string().required().min(3).max(256),
        email:joi.string().required().min(3).max(256).email(),
        password:joi.string().required().min(8).max(1026)
    })
    // returning the user validation 
    return userSchemaValidation.validate(data)
}

// Login vaidations
const userLoginValidation = (data) =>{
    const userLoginSchemaValidation = joi.object({
        email:joi.string().required().min(3).max(256).email(),
        password:joi.string().required().min(8).max(1026)
    })
    // returning the login user validation
    return userLoginSchemaValidation.validate(data)
}

const passwordRecoveryValidation = (data) =>{
    const userPasswordRecoveryValidation = joi.object({
        email:joi.string().required().min(3).max(256).email()
    })
    // returning the login user validation
    return userPasswordRecoveryValidation.validate(data)
}

const passwordRecoveryValidationToken = (data) =>{
    const userPasswordRecoveryValidation = joi.object({
        token:joi.string().required()
    })
    // returning the login user validation
    return userPasswordRecoveryValidation.validate(data)
}
// Module Exports
module.exports.userRegistrationValidation = userRegistrationValidation
module.exports.userLoginValidation = userLoginValidation
module.exports.passwordRecoveryValidation = passwordRecoveryValidation
module.exports.passwordRecoveryValidationToken = passwordRecoveryValidationToken