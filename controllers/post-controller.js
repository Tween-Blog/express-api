const postService = require('../service/post-service');

class PostController {
    async create(req, res, next) {
        try {
            const post = await postService.create(req.body, req.files);
            res.json(post);
        } catch (e) {
            next(e);
        }
    }

    async update(req, res, next) {
        try {
            const post = await postService.update(req.body, req.files);
            res.json(post);
        } catch (e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            const post = await postService.delete(req.body);
            res.json(post);
        } catch (e) {
            next(e);
        }
    }

    async getAll(req, res, next) {
        try {
            const posts = await postService.getAll();
            res.json(posts);
        } catch (e) {
            next(e);
        }
    }

    async getOne(req, res, next) {
        try {
            const post = await postService.getOne(req.params.id);
            res.json(post);
        } catch (e) {
            next(e);
        }
    }

    async getUserPosts(req, res, next) {
        try {
            const userPosts = await postService.getUserPosts(req.params.userId);
            res.json(userPosts);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new PostController();