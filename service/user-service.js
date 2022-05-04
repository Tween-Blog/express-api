const bcrypt = require('bcrypt');
const uuid = require('uuid');

const UserModel = require('../models/user-model');

const mailService = require('./mail-service');
const tokenService = require('./token-service');
const fileService = require('./file-service');

const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

class UserService {
    async registration({email, password, nick}) {
        if(!email || !password || !nick || email == '' || password == '' || nick == '') throw ApiError.UserDataEmpty();

        const candidate = await UserModel.findOne({email});

        if(candidate) throw new ApiError(200, 'Пользователь с таким E-Mail уже существует.', ['email_already_exists']);

        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();

        const user = await UserModel.create({email, password: hashPassword, activationLink, nick});
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto};
    }

    async login({email, password}) {
        if(!email || !password || email == '' || password == '') throw ApiError.UserDataEmpty();

        const user = await UserModel.findOne({email});
        if(!user) throw new ApiError(200, 'Пользователь с таким E-Mail не найден.', ['email_not_found']);

        const isPasswordEquals = await bcrypt.compare(password, user.password);
        if(!isPasswordEquals) throw new ApiError(200, 'Неверный пароль.', ['wrong_password']);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto};
    }

    async logout(refreshToken) {
        const token = tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if(!refreshToken) throw ApiError.UnauthorizedError();

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await tokenService.findToken(refreshToken);

        if(!userData || !tokenFromDB) throw ApiError.UnauthorizedError();

        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto};
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink});

        if(!user) throw ApiError.BadRequest('Ссылка активации не действительна.');

        user.isActivated = true;
        await user.save();
    }

    async getAllUsers() {
        const users = await UserModel.find();
        const usersDto = [];

        users.forEach(user => usersDto.push(new UserDto(user)));

        return usersDto;
    }

    async getUser(userId) {
        if(userId.length !== 24) throw ApiError.UserIdNotCorrectly();
        const user = await UserModel.findById(userId);
        if(!user) throw ApiError.UserNotFound();

        const userDto = new UserDto(user);
        return userDto;
    }

    async updateUser(userData, filesData) {
        const userId = userData._id;
        if(!userId || userId == '') throw ApiError.BadRequest('ID пользователя не указан.');

        let isAvatar = false;
        if(filesData != null) {
            if(filesData.avatar) isAvatar = true;
        }

        if(userId.length !== 24) throw ApiError.UserIdNotCorrectly();
        const user = await UserModel.findById(userId);
        if(!user) throw ApiError.UserNotFound();

        const updatedUser = await UserModel.findByIdAndUpdate(userId, userData, {new: true});

        if(isAvatar) {
            const avatarName = fileService.saveFile(filesData.avatar, 'avatars');

            if(updatedUser.avatar.split('.')[0] != 'default-avatar') fileService.removeFile(updatedUser.avatar, 'avatars');

            updatedUser.avatar = avatarName;
            updatedUser.save();
        } else {
            delete userData.avatar;
        }

        if(userData.password && userData.password != '') {
            const hashPassword = await bcrypt.hash(userData.password, 3);
            user.password = hashPassword;
            await user.save();
        }

        if(userData.subscribersCount) delete userData.subscribersCount;
        if(userData.subscriptionsCount) delete userData.subscriptionsCount;
        if(userData.isActivated) delete userData.isActivated;
        if(userData.activationLink) delete userData.activationLink;

        const updatedUserDto = new UserDto(updatedUser);
        
        return updatedUserDto;
    }

    async deleteUser(userId) {
        if(!userId || userId == '') throw ApiError.BadRequest('ID пользователя не указан.');

        if(userId.length !== 24) throw ApiError.UserIdNotCorrectly();
        const user = await UserModel.findById(userId);
        if(!user) throw ApiError.UserNotFound();

        const deletedUser = await UserModel.findByIdAndDelete(userId);
        const deletedUserDto = new UserDto(deletedUser);
        
        return deletedUserDto;
    }
}

module.exports = new UserService();