const CommentModel = require('../models/comment-model');
const PostModel = require('../models/post-model');
const UserModel = require('../models/user-model');

const CommentDto = require('../dtos/comment-dto');

const ApiError = require('../exceptions/api-error');

class CommentService {
    async create({postId, userId, text}) {
        if(!postId || !userId || !text || postId == '' || userId == '' || text == '') throw ApiError.CommentDataEmpty();

        if(postId.length != 24) throw ApiError.PostIdNotCorrectly();
        if(userId.length != 24) throw ApiError.UserIdNotCorrectly();

        const post = await PostModel.findById(postId);
        if(!post) throw ApiError.PostNotFound();
        
        const user = await UserModel.findById(userId);
        if(!user) throw ApiError.UserNotFound();

        const comment = await CommentModel.create({postId, userId, text});

        return new CommentDto(comment);
    }

    async update(body) {
        const commentId = body._id;

        if(!commentId || commentId == '') throw ApiError.BadRequest('ID комментария не указан');
        if(commentId.length != 24) throw ApiError.CommentIdNotCorrectly();

        const comment = await CommentModel.findById(commentId);
        if(!comment) throw ApiError.CommentNotFound();

        const updatedComment = await CommentModel.findByIdAndUpdate(commentId, body, {new: true});
        const updatedCommentDto = new CommentDto(updatedComment);

        return updatedCommentDto;
    }

    async delete(body) {
        const commentId = body._id;

        if(!commentId || commentId == '') throw ApiError.BadRequest('ID комментария не указан');
        if(commentId.length != 24) throw ApiError.CommentIdNotCorrectly();

        const comment = await CommentModel.findById(commentId);
        if(!comment) throw ApiError.CommentNotFound();

        const deletedComment = await CommentModel.findByIdAndDelete(commentId); 
        const deletedCommentDto = new CommentDto(deletedComment);

        return deletedCommentDto;
    }

    async getAll() {
        const comments = await CommentModel.find();
        const commentsDto = [];

        comments.forEach(comment => commentsDto.push(new CommentDto(comment)));

        return commentsDto;
    }

    async getOne(commentId) {
        if(commentId.length != 24) throw ApiError.CommentIdNotCorrectly();
        const comment = await CommentModel.findById(commentId);
        if(!comment) throw ApiError.CommentNotFound();

        return new CommentDto(comment);
    }

    async getPostComments(postId) {
        if(postId.length != 24) throw ApiError.PostIdNotCorrectly();
        const post = await PostModel.findById(postId);
        if(!post) throw ApiError.PostNotFound();

        const comments = await CommentModel.find();
        const postComments = comments.filter(comment => comment.postId == postId);
        const postCommentsDto = [];

        postComments.forEach(comment => postCommentsDto.push(new CommentDto(comment)));

        return postCommentsDto;
    }
}

module.exports = new CommentService();