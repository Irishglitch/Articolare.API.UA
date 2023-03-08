const express = require('express')
const router = express.Router()
const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const bodyParser = require('body-parser');
const User = require('../models/User').User
const UserHandler = require('../models/User')


// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys

// Find your endpoint's secret in your Dashboard's webhook settings
const endpointSecret = ' whsec_9cdb6ec9c1bf8e3759d8294f785896cfafa0df2b65607f3cff4dafdbf4a29746';
const fulfillOrder = (session) => {
    // TODO: replace with the activation logic
    console.log("Fulfilling order", session);
}

const createOrder = (session) => {
    // TODO: fill me in
    console.log("Creating order", session);
}

const emailCustomerAboutFailedPayment = (session) => {
    // TODO: fill me in
    console.log("Emailing customer", session);
}

router.post('/webhook', bodyParser.raw({type: '*/*'}), (request, response) => {
    const sig = request.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            // Then define and call a function to handle the event payment_intent.succeeded
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
});

module.exports = router
