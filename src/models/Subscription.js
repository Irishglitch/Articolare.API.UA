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
const subscriptionSchema = mongoose.Schema({
    // This is the actual schema used within the database.
    _id:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    name:{
        type:String,
        required:true,
        min:3,
        max:256
    },
    features:{
        type: Map,
        of: Boolean

    }})

const Subscription = mongoose.model('subscription', subscriptionSchema)
async function populateSubscriptionTable(){
    await createFreeSubscription();
    await createBasicSubscription();
    await createPremiumSubscription();
}

async function createFreeSubscription(){
    const _count = await Subscription.count({name: 'Free'})
    if(_count === 0){
        const free = new Subscription({
            _id: mongoose.Types.ObjectId(),
            name:'Free',
            features:{
                multipleLanguages: false,
                BERT_OpenAI: false,
                translate: false,
                sentiment: false
            }
        })
        await free.save();
    }
}

async function createBasicSubscription(){
    const _count = await Subscription.count({name: 'Basic'})
    if(_count === 0){
        const basic = new Subscription({
            _id: mongoose.Types.ObjectId(),
            name:'Basic',
            features:{
                multipleLanguages: true,
                BERT_OpenAI: false,
                translate: false,
                sentiment: false
            }
        })
        await basic.save();
    }
}

async function createPremiumSubscription(){
    const _count = await Subscription.count({name: 'Premium'})

    if(_count === 0){
        const premium = new Subscription({
            _id: mongoose.Types.ObjectId(),
            name:'Premium',
            features:{
                multipleLanguages: true,
                BERT_OpenAI: true,
                translate: true,
                sentiment: true
            }
        })

        await premium.save();
    }
}

// Module Exports
module.exports ={
    PopulateSubscriptionTable: populateSubscriptionTable,
}

