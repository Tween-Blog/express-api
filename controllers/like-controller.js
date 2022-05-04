const likeService = require('../service/like-service');

class LikeController {
    async like(req, res, next) {
        try {  
            const likedPost = await likeService.like(req.body);
            res.json(likedPost);
        } catch (e) {
            next(e);
        }
    }

    async dislike(req, res, next) {
        try {
            const dislikedPost = await likeService.dislike(req.body);
            res.json(dislikedPost);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new LikeController();