module.exports = class UserDto {
    id;
    title;
    description;
    picture;
    date;
    likesCount;
    userId;

    constructor(model) {
        this.id = model.id;
        this.title = model.title;
        this.description = model.description;
        this.picture = model.picture;
        this.date = model.date;
        this.likesCount = model.likesCount;
        this.userId = model.userId;
    }
}