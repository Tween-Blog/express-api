module.exports = class UserDto {
    id;
    email;
    nick;
    description;
    avatar;

    postsCount;
    subscribersCount;
    subscriptionsCount;

    isActivated;

    constructor(model) {
        this.id = model.id;
        this.email = model.email;
        this.nick = model.nick;
        this.description = model.description;
        this.avatar = model.avatar;

        this.postsCount = model.postsCount;
        this.subscribersCount = model.subscribersCount;
        this.subscriptionsCount = model.subscriptionsCount;

        this.isActivated = model.isActivated;
    }
}