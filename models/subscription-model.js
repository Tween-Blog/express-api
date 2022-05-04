const {Schema, model} = require('mongoose');

const SubscriptionSchema = new Schema({
    executorUserId: {type: Schema.Types.ObjectId, ref: 'User'},
    targetUserId: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = model('Subscription', SubscriptionSchema);