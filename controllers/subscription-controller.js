const subscriptionService = require('../service/subscription-service');

class SubscriptionController {
    async subscribe(req, res, next) {
        try {
            const users = await subscriptionService.subscribe(req.body);
            res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async unsubscribe(req, res, next) {
        try {
            const users = await subscriptionService.unsubscribe(req.body);
            res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async getUserSubscribers(req, res, next) {
        try {
            const subscribers = await subscriptionService.getUserSubscribers(req.params.userId);
            res.json(subscribers);
        } catch (e) {
            next(e);
        }
    }

    async getUserSubscriptions(req, res, next) {
        try {
            const subscriptions = await subscriptionService.getUserSubscriptions(req.params.userId);
            res.json(subscriptions);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new SubscriptionController();