const express = require('express')
const router = express.Router()
const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const bodyParser = require('body-parser');
const User = require('../models/User').User
const UserHandler = require('../models/User')


// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('sk_test_51MOLGXD2HcBdiVMRkXhH1baWoTDAFGO8LuDXNIZcDLZe64hqePEz6SoL6zopyadpNeh1MrRgILbTOH8CjVX7dq3G00kbE9Fx1m');

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

router.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
    const payload = request.body;
    const sig = request.headers['stripe-signature'];
    console.log('test',payload)
    let event;

    try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Fulfill the purchase...
        fulfillOrder(session);
    }
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;
            // Save an order in your database, marked as 'awaiting payment'
            createOrder(session);

            // Check if the order is paid (for example, from a card payment)
            //
            // A delayed notification payment will have an `unpaid` status, as
            // you're still waiting for funds to be transferred from the customer's
            // account.
            if (session.payment_status === 'paid') {
                fulfillOrder(session);
            }

            break;
        }

        case 'checkout.session.async_payment_succeeded': {
            const session = event.data.object;

            // Fulfill the purchase...
            fulfillOrder(session);

            break;
        }

        case 'checkout.session.async_payment_failed': {
            const session = event.data.object;

            // Send an email to the customer asking them to retry their order
            emailCustomerAboutFailedPayment(session);

            break;
        }
    }

    response.status(200).end();
});

module.exports = router