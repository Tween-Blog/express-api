const {Schema, model} = require('mongoose');

const CommentSchema = new Schema({
    postId: {type: Schema.Types.ObjectId, ref: 'Post'},
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    text: {type: String, required: true}
});

module.exports = model('Comment', CommentSchema);