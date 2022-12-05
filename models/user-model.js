const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    nick: {type: String, required: true},
    description: {type: String, default: 'Пусто.'},
    avatar: {type: String, default: 'default-avatar.png'},
    postsCount: {type: Number, default: 0},
    subscribersCount: {type: Number, default: 0},
    subscriptionsCount: {type: Number, default: 0},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String, required: true}
});

module.exports = model('User', UserSchema);
