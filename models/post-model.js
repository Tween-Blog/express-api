const {Schema, model} = require('mongoose');

const PostSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    picture: {type: String, required: true},
    date: {type: String, required: true},
    likesCount: {type: Number, default: 0},
    userId: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = model('Post', PostSchema);