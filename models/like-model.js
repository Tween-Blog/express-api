const {Schema, model} = require('mongoose');

const LikeSchema = new Schema({
    postId: {type: Schema.Types.ObjectId, ref: 'Post'},
    userId: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = model('Like', LikeSchema);