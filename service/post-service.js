const PostModel = require('../models/post-model');
const UserModel = require('../models/user-model');

const fileService = require('../service/file-service');

const PostDto = require('../dtos/post-dto');
const ApiError = require('../exceptions/api-error');

class PostService {
    async create({title, description, userId}, files) {
        if(files == null) throw ApiError.FilesEmpty();
        if(!files.picture) throw ApiError.BadRequest('Картинка поста не передана.');
        const picture = files.picture;

        if(!title || !description || !userId || title == '' || description == '' || userId == '') throw ApiError.BadRequest('Не все данные о посте заполнены.');

        const date = new Date();
        const dateOutput = String(date.getDate()).padStart(2, '0') + '.' + String(date.getMonth() + 1).padStart(2, '0') + '.' + date.getFullYear();

        if(userId.length !== 24) throw ApiError.UserIdNotCorrectly();
        const user = await UserModel.findById(userId);
        if(!user) throw ApiError.UserNotFound();

        const pictureName = fileService.saveFile(picture, 'posts');

        user.postsCount += 1;
        await user.save();

        const post = await PostModel.create({title, description, picture: pictureName, date: dateOutput, userId});
        const postDto = new PostDto(post);

        return postDto;
    }

    async update(body, files) {
        const postId = body._id;
        if(!postId || postId == '') throw ApiError.BadRequest('ID поста не указан.');

        let isPicture = false;
        if(files != null) {
            if(files.picture) isPicture = true;
        }

        if(postId.length !== 24) throw ApiError.PostIdNotCorrectly();
        const post = await PostModel.findById(postId);
        if(!post) throw ApiError.PostNotFound();

        const updatedPost = await PostModel.findByIdAndUpdate(postId, body, {new: true});

        if(isPicture) {
            const pictureName = fileService.saveFile(files.picture, 'posts');

            fileService.removeFile(updatedPost.picture, 'posts');

            updatedPost.picture = pictureName;
            await updatedPost.save();
        } else {
            delete body.picture;
        }

        const updatedPostDto = new PostDto(updatedPost);
        return updatedPostDto;
    }

    async delete(body) {
        const postId = body._id;
        if(!postId || postId == '') throw ApiError.BadRequest('ID поста не указан.');

        if(postId.length !== 24) throw ApiError.PostIdNotCorrectly();
        const post = await PostModel.findById(postId);
        if(!post) throw ApiError.PostNotFound();

        const user = await UserModel.findById(post.userId);
        
        user.postsCount -= 1;
        await user.save();

        fileService.removeFile(post.picture, 'posts');

        post.delete();
        return new PostDto(post);
    }

    async getAll() {
        const posts = await PostModel.find();
        const postsDto = [];

        posts.forEach(post => postsDto.push(new PostDto(post)));

        return postsDto;
    }

    async getOne(postId) {
        if(postId.length !== 24) throw ApiError.PostIdNotCorrectly();
        const post = await PostModel.findById(postId);
        if(!post) throw ApiError.PostNotFound();

        return new PostDto(post);
    }

    async getUserPosts(userId) {
        if(userId.length !== 24) throw ApiError.UserIdNotCorrectly();
        const user = await UserModel.findById(userId);
        if(!user) throw ApiError.UserNotFound();

        const posts = await PostModel.find();
        const userPosts = posts.filter(post => post.userId == userId);
        const userPostsDto = [];

        userPosts.forEach(post => userPostsDto.push(new PostDto(post)));

        return userPostsDto;
    }
}

module.exports = new PostService();