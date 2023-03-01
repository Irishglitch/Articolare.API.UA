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
const {
    userRegistrationValidation,
    userLoginValidation,
    passwordRecoveryValidation,
    passwordRecoveryValidationToken
} = require('../validations/validation') // All validations for login and registration.
const { default: mongoose } = require('mongoose') // Ability to connect to the DB.
const { v4: uuidv4 } = require('uuid');
// const baseAddress = process.env.BASE_ADDRESS; REMOVED AS REQUESTED BY DEVELOPER
const clientAddress = process.env.Client_BASE_ADDRESS;
const accessVerify = require('../validations/tokenVerification')

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
     const activationToken =  uuidv4()

     // Inserting data into DB.
    const addNewUser = UserHandler.GetNewUser(
        req.body.name,
        req.body.lastName,
        req.body.email,
        req.body.languageChoice,
        hashedPassword,
        activationToken
    )
     // Try catch to validate and enter data into DB.
     try{
         const userAddedDB = await addNewUser.save()
         res.send(userAddedDB)
         const body = getConfirmationMailBody(req.body.name, activationToken);
         sendMail(req.body.email, 'Articolare - email confirmation.', body);
     }catch(error){
         res.status(400).send({message:error})
     }
})

// User login - will require a token to be passed - this will have to be changed
router.post('/login', async(req, res) => {
    const {error} = userLoginValidation(req.body)
    if(error){
        // Validation 1 - Summarised error message
        return res.status(401).send({message:error['details'][0]['message']})
    }

    // Validation 2 - Check user is not registered
    const userExists = await User.findOne({email:req.body.email})
    if(!userExists){
        return res.status(401).send({message:'Invalid credentials information. Please check your credentials an try again.'})
    }

    // Validation 3 - Password decription and validation
    const userPasswordValidation = await bcryptjs.compare(req.body.password, userExists.password)
    if(!userPasswordValidation){
        return res.status(401).send({message:'Invalid credentials information. Please check your credentials an try again.'})
    }

    // Auth-Token Generation
    const authToken = jsonwebtoken.sign({
        _id:userExists._id,
        userFullName: `${userExists.name} ${userExists.lastName}`,
        userMail: userExists.email,
        isActive: userExists.isActive},
        process.env.TOKEN_SECRET,{
            expiresIn: '3h'
        })
    res.header('auth-token', authToken).send({'token':authToken})

})

router.put('/recoveryPassword',async(req, res) => {
    const {error} = passwordRecoveryValidation(req.body)
    if(error) {
        return res.status(400).send({message: error['details'][0]['message']})
    }
    const curUser = await User.findOne({email:req.body.email})
    if(curUser){
        const now = Date.now();
        curUser.passwordRecoveryToken = uuidv4();
        curUser.recoveryTokenExpireDate = (now + 86400000);
        curUser.updatedAt = now;
        curUser.save();
        const body = getPassRecoveryMailBody(curUser.name, curUser.passwordRecoveryToken);
        sendMail(curUser.email, 'Articolare - recovery password.', body);
    }

    res.end();
})

router.put('/recoveryPassword/:token',async(req, res) => {
    // const {error} = passwordRecoveryValidationToken(req.params.token)
    //TODO - //Implement token validation
    // if(error) {
    //     return res.status(400).send({message: error['details'][0]['message']})
    // }

    const token = req.params['token'];
    const curUser = await User.findOne({passwordRecoveryToken:token})
    if(curUser){
        const now = Date.now();

        if(curUser.recoveryTokenExpireDate <= now){
            res.status(400).send({message: 'Error: Expired password recovery token.'});
            return;
        }

        const salt = await bcryptjs.genSalt(8)
        const hashedPassword = await bcryptjs.hash(req.body.password,salt)

        curUser.recoveryTokenExpireDate = (now - 1000);
        curUser.updatedAt = now;
        curUser.password = hashedPassword;
        curUser.save();
        res.end();
        return;
    }
    else{
        res.status(400).send({message: 'Error: Invalid password recovery token.'})
        return;
    }

})

router.delete('/users/:userId',accessVerify,async(req, res) => {
    const userId = req.params['userId'];
    if(!userId) {
        return res.status(400).send({message: 'Invalid userid.'})
    }
    try {
        mongoose.Types.ObjectId(userId)
    }
    catch (e){
        res.status(400).send({message: 'Error:  invalid userId'});
        return;
    }
    const curUser = await User.findOne({_id: userId})
    if(curUser){
        const now = Date.now();
        curUser.isActive = false;
        curUser.updatedAt = now;
        curUser.save();
        const body = getDeletedAccountMailBody(curUser.name, curUser.passwordRecoveryToken);
        sendMail(curUser.email, 'Articolare - account deactivation.', body);

        res.end();

    }
    else {
        res.status(400).send('Error:  userId not found.');
    }
})
//TODO - Move to an separated email service.
function sendMail(mailAddres,subject, body){
    const user = process.env.MAIL_ADDRESS;
    const pass = process.env.PASS;
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: user,
            pass: pass
        }
    });

    var mailOptions = {
        from: user,
        to: mailAddres,
        subject: subject,
        html: body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

router.put('/confirmEmail/:token',async(req, res) => {
    // const {error} = passwordRecoveryValidation(req.body) //TODO - User a meaningful name
    const token = req.params['token'];



    const curUser = await User.findOne({activationToken:token})
    if(curUser){

        if(curUser.isActive){
           return res.status(400).send({message: 'Error: User already active.'});
        }

        const now = Date.now();
        curUser.isActive = true;
        curUser.updatedAt = now;
        curUser.save();
        res.end();

    }else{
        res.status(400).send({message: 'Error: Active user error. Contact admin.'});
    }
})

function getPassRecoveryMailBody(userName, token){
    const link = `${clientAddress}/recoveryPassword/${token}`
    const mailBase = `<!DOCTYPE htmlPUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Articolare</title><style type="text/css">body{Margin:0;padding:0;background-color:#fff}table{border-spacing:0}td{padding:0}img{border:0}.wrapper{width:100%;table-layout:fixed;background-color:#fff;padding-bottom:40px}.webkit{max-width:600px;background-color:#fff}.outer{Margin:0 auto;width:100%;max-width:600px;border-spacing:0;font-family:sans-serif;color:#4a4a4a}</style></head><body><center class="wrapper"><div class="webkit"><table class="outer" align="center"><tr><td><table style="width:100%;border-spacing:0;padding-top:3rem"><tr><td style="text-align:center"><a href="https://articolare.com"><img src="https://storage.googleapis.com/assets-articolare/mainLogoLight.png" width="180" alt="Logo" title="Logo"></a></td></tr></table></td></tr><tr><td><br><br><p>Hello ${userName},</p><a href="${link}" target="_blank" style="max-width:100;font-weight:400">This is a password recovery email.</a><br></td></tr><tr><td><br><table style="width:100%;border-spacing:0;padding-top:3rem"><tr><td style="text-align:left"><a href="https://articolare.com"><img src="https://storage.googleapis.com/assets-articolare/better-writing.png" width="600" alt="Logo" title="Logo"></a></td></tr></table><p style="font-size:13px">By clicking on the link above you are agreeing to our terms andconditions.</p><p style="font-size:13px">All rights reserved. Copyright © 2021 Foireann | Made with<spam style="color:red;font-size:large">:hearts:</spam>by ourteam in London, Lisbon, &Milano.</p></td></tr></table></div></center></body></html>`
    return mailBase;
}

function getDeletedAccountMailBody(userName){
    const mailBase = `<!DOCTYPE htmlPUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Articolare</title><style type="text/css">body{Margin:0;padding:0;background-color:#fff}table{border-spacing:0}td{padding:0}img{border:0}.wrapper{width:100%;table-layout:fixed;background-color:#fff;padding-bottom:40px}.webkit{max-width:600px;background-color:#fff}.outer{Margin:0 auto;width:100%;max-width:600px;border-spacing:0;font-family:sans-serif;color:#4a4a4a}</style></head><body><center class="wrapper"><div class="webkit"><table class="outer" align="center"><tr><td><table style="width:100%;border-spacing:0;padding-top:3rem"><tr><td style="text-align:center"><a href="https://articolare.com"><img src="https://storage.googleapis.com/assets-articolare/mainLogoLight.png" width="180" alt="Logo" title="Logo"></a></td></tr></table></td></tr><tr><td><br><br><p>Hello ${userName},</p><a href="${link}" target="_blank" style="max-width:100;font-weight:400">This an account deactivation email.</a><br></td></tr><tr><td><br><table style="width:100%;border-spacing:0;padding-top:3rem"><tr><td style="text-align:left"><a href="https://articolare.com"><img src="https://storage.googleapis.com/assets-articolare/better-writing.png" width="600" alt="Logo" title="Logo"></a></td></tr></table><p style="font-size:13px">By clicking on the link above you are agreeing to our terms andconditions.</p><p style="font-size:13px">All rights reserved. Copyright © 2021 Foireann | Made with<spam style="color:red;font-size:large">:hearts:</spam>by ourteam in London, Lisbon, &Milano.</p></td></tr></table></div></center></body></html>`
    return mailBase;
}

function getConfirmationMailBody(userName, token){
    const link = `${clientAddress}/confirmEmail/${token}`
    const mailBase = `<!DOCTYPE htmlPUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Articolare</title><style type="text/css">body{Margin:0;padding:0;background-color:#fff}table{border-spacing:0}td{padding:0}img{border:0}.wrapper{width:100%;table-layout:fixed;background-color:#fff;padding-bottom:40px}.webkit{max-width:600px;background-color:#fff}.outer{Margin:0 auto;width:100%;max-width:600px;border-spacing:0;font-family:sans-serif;color:#4a4a4a}</style></head><body><center class="wrapper"><div class="webkit"><table class="outer" align="center"><tr><td><table style="width:100%;border-spacing:0;padding-top:3rem"><tr><td style="text-align:center"><a href="https://articolare.com"><img src="https://storage.googleapis.com/assets-articolare/mainLogoLight.png" width="180" alt="Logo" title="Logo"></a></td></tr></table></td></tr><tr><td><br><br><p>Hello ${userName},</p><a href="${link}" target="_blank" style="max-width:100;font-weight:400">This is an account confirmation email.</a><br><></td></tr><tr><td><br><table style="width:100%;border-spacing:0;padding-top:3rem"><tr><td style="text-align:left"><a href="https://articolare.com"><img src="https://storage.googleapis.com/assets-articolare/better-writing.png" width="600" alt="Logo" title="Logo"></a></td></tr></table><p style="font-size:13px">By clicking on the link above you are agreeing to our terms andconditions.</p><p style="font-size:13px">All rights reserved. Copyright © 2021 Foireann | Made with<spam style="color:red;font-size:large">:hearts:</spam>by ourteam in London, Lisbon, &Milano.</p></td></tr></table></div></center></body></html>`
    return mailBase;
}
module.exports = router
