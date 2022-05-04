const userService = require('../service/user-service');

class UserController {
    async registration(req, res, next) {
        try {
            const userData = await userService.registration(req.body);
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const userData = await userService.login(req.body);
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.body;
            const token = await userService.logout(refreshToken);
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.body;
            const userData = await userService.refresh(refreshToken);
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);

            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async getUser(req, res, next) {
        try {
            const user = await userService.getUser(req.params.id);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async updateUser(req, res, next) {
        try {
            const user = await userService.updateUser(req.body, req.files);
            res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const deletedUser = await userService.deleteUser(req.body._id); 
            res.json(deletedUser);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();