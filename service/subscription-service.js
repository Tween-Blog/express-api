const SubscriptionModel = require('../models/subscription-model');
const UserModel = require('../models/user-model');

const UserDto = require('../dtos/user-dto');

const ApiError = require('../exceptions/api-error');

class SubscriptionService {
    async subscribe({executorUserId, targetUserId}) {
        if(!executorUserId || executorUserId == '') throw ApiError.UserDataEmpty();
        if(!targetUserId || targetUserId == '') throw ApiError.UserDataEmpty();

        if(executorUserId.length != 24 || targetUserId.length != 24) throw ApiError.UserIdNotCorrectly();

        const executorUser = await UserModel.findById(executorUserId);
        if(!executorUser) throw ApiError.BadRequest('Executor User с таким ID не найден.');

        const targetUser = await UserModel.findById(targetUserId);
        if(!targetUser) throw ApiError.BadRequest('Target User с таким ID не найден.');

        const subscription = await SubscriptionModel.findOne({executorUserId, targetUserId});
        if(subscription) throw ApiError.BadRequest('Executor User уже подписан на Target User.');

        await SubscriptionModel.create({executorUserId, targetUserId});

        executorUser.subscriptionsCount += 1;
        targetUser.subscribersCount += 1;

        await executorUser.save();
        await targetUser.save();

        const executorUserDto = new UserDto(executorUser);
        const targetUserDto = new UserDto(targetUser);

        return {type: 'subscribe', executorUserDto, targetUserDto};
    }

    async unsubscribe({executorUserId, targetUserId}) {
        if(!executorUserId || executorUserId == '') throw ApiError.UserDataEmpty();
        if(!targetUserId || targetUserId == '') throw ApiError.UserDataEmpty();

        if(executorUserId.length != 24 || targetUserId.length != 24) throw ApiError.UserIdNotCorrectly();

        const executorUser = await UserModel.findById(executorUserId);
        if(!executorUser) throw ApiError.BadRequest('Executor User с таким ID не найден.');

        const targetUser = await UserModel.findById(targetUserId);
        if(!targetUser) throw ApiError.BadRequest('Target User с таким ID не найден.');

        const subscription = await SubscriptionModel.findOne({executorUserId, targetUserId});
        if(!subscription) throw ApiError.BadRequest('Executor User ещё не подписан на Target User.');

        await SubscriptionModel.findOneAndDelete({executorUserId, targetUserId});

        executorUser.subscriptionsCount -= 1;
        targetUser.subscribersCount -= 1;
        
        await executorUser.save();
        await targetUser.save();

        const executorUserDto = new UserDto(executorUser);
        const targetUserDto = new UserDto(targetUser);

        return {type: 'unsubscribe', executorUserDto, targetUserDto};
    }

    async getUserSubscribers(userId) {
        if(userId.length != 24) throw ApiError.UserIdNotCorrectly();
        const user = await UserModel.findById(userId);
        if(!user) throw ApiError.UserNotFound();

        const subscriptions = await SubscriptionModel.find();

        const userSubscribers = subscriptions.filter(subscription => subscription.targetUserId == userId);
        const userSubscribersDto = [];

        for(const subscriber of userSubscribers) {
            const user = await UserModel.findById(subscriber.executorUserId);
            userSubscribersDto.push(new UserDto(user));
        }

        return userSubscribersDto;
    }

    async getUserSubscriptions(userId) {
        if(userId.length != 24) throw ApiError.UserIdNotCorrectly();
        const user = await UserModel.findById(userId);
        if(!user) throw ApiError.UserNotFound();

        const subscriptions = await SubscriptionModel.find();

        const userSubscriptions = subscriptions.filter(subscription => subscription.executorUserId == userId);
        const userSubscriptionsDto = [];

        for(const subscription of userSubscriptions) {
            const user = await UserModel.findById(subscription.targetUserId);
            userSubscriptionsDto.push(new UserDto(user));
        }

        return userSubscriptionsDto;
    }

    async checkSubscribe({executorUserId, targetUserId}) {
        if(!executorUserId || !targetUserId) throw ApiError.UserDataEmpty();

        if(executorUserId.length != 24 || targetUserId.length != 24) throw ApiError.UserIdNotCorrectly();

        const executorUser = await UserModel.findById(executorUserId);
        if(!executorUser) throw ApiError.BadRequest('Executor User с таким ID не найден.');

        const targetUser = await UserModel.findById(targetUserId);
        if(!targetUser) throw ApiError.BadRequest('Target User с таким ID не найден.');

        const isSubscribe = await SubscriptionModel.findOne({executorUserId, targetUserId});

        return !isSubscribe ? {isSubscribe: false} : {isSubscribe: true};
    }
}

module.exports = new SubscriptionService();