const ApiError = require('../exceptions/api-error');

module.exports = function (err, req, res, next) {
    console.log(err);

    if(err instanceof ApiError) {
        let errorResponse = {message: err.message};
        if(err.error != null) errorResponse.error = err.error;

        return res.status(err.status).json(errorResponse);
    }

    return res.status(500).json({message: 'Непредвиденная ошибка.'});
}