const LikeModel = require('../models/like-model');
const PostModel = require('../models/post-model');
const UserModel = require('../models/user-model');

const ApiError = require('../exceptions/api-error');

class LikeService {
    async like({postId, userId}) {
        if(!postId || !userId || postId == '' || userId == '') throw ApiError.BadRequest('Не все данные заполнены.');

        if(postId.length != 24) throw ApiError.PostIdNotCorrectly();
        const post = await PostModel.findById(postId);
        if(!post) throw ApiError.PostNotFound();

        if(userId.length != 24) throw ApiError.UserIdNotCorrectly();
        const user = await UserModel.findById(userId);
        if(!user) throw ApiError.UserNotFound();

        const isLike = await LikeModel.findOne({postId, userId});
        if(isLike) throw ApiError.BadRequest('Этот пост уже имеет лайк от пользователя с таким ID.');

        post.likesCount += 1;
        await post.save();

        await LikeModel.create({postId, userId});
        return post;
    }

    async dislike({postId, userId}) {
        if(!postId || !userId || postId == '' || userId == '') throw ApiError.BadRequest('Не все данные заполнены.');
        
        if(postId.length != 24) throw ApiError.PostIdNotCorrectly();
        const post = await PostModel.findById(postId);
        if(!post) throw ApiError.PostNotFound();

        if(userId.length != 24) throw ApiError.UserIdNotCorrectly();
        const user = await UserModel.findById(userId);
        if(!user) throw ApiError.UserNotFound();

        const isLike = await LikeModel.findOne({postId, userId});
        if(!isLike) throw ApiError.BadRequest('Этот пост не имеет лайка от пользователя с таким ID.');

        isLike.delete();

        post.likesCount -= 1;
        await post.save();

        return post;
    }
}

module.exports = new LikeService();