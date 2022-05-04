const commentService = require('../service/comment-service');

class CommentController {
    async create(req, res, next) {
        try {
            const comment = await commentService.create(req.body);
            res.json(comment);
        } catch (e) {
            next(e);
        }
    }

    async update(req, res, next) {
        try {
            const comment = await commentService.update(req.body);
            res.json(comment);
        } catch (e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            const comment = await commentService.delete(req.body);
            res.json(comment);
        } catch (e) {
            next(e);
        }
    }

    async getAll(req, res, next) {
        try {
            const comments = await commentService.getAll();
            res.json(comments);
        } catch (e) {
            next(e);
        }
    }

    async getOne(req, res, next) {
        try {
            const comment = await commentService.getOne(req.params.id);
            res.json(comment);
        } catch (e) {
            next(e);
        }
    }

    async getPostComments(req, res, next) {
        try {
            const postComments = await commentService.getPostComments(req.params.postId);
            res.json(postComments);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new CommentController();