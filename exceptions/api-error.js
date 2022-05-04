module.exports = class ApiError extends Error {
    status;
    error;
   
    constructor(status, message, error = null) {
        super(message);
        this.status = status;
        this.error = error;
    } 

    static UnauthorizedError() {
        return new ApiError(401, 'Пользователь не авторизован.');
    }

    static BadRequest(message) {
        return new ApiError(400, message);
    }

    static FilesEmpty() {
        return new ApiError(400, 'Файлы не заполнены.');
    }

    
    static UserDataEmpty() {
        return new ApiError(400, 'Не все данные о пользователе заполнены.');
    }

    static UserIdNotCorrectly() {
        return new ApiError(400, 'Длина ID пользователя должна быть 24 символа.');
    }

    static UserNotFound() {
        return new ApiError(400, 'Пользователь с таким ID не найден.');
    }


    static PostDataEmpty() {
        return new ApiError(400, 'Не все данные о посте заполнены.');
    }

    static PostIdNotCorrectly() {
        return new ApiError(400, 'Длина ID поста должна быть 24 символа.');
    }

    static PostNotFound() {
        return new ApiError(400, 'Пост с таким ID не найден.');
    }


    static CommentDataEmpty() {
        return new ApiError(400, 'Не все данные о комментарии заполнены.');
    }

    static CommentIdNotCorrectly() {
        return new ApiError(400, 'Длина ID комментария должна быть 24 символа.');
    }

    static CommentNotFound() {
        return new ApiError(400, 'Комментарий с таким ID не найден.');
    }
}