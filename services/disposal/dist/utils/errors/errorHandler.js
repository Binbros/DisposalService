"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpClientError_1 = require("./httpClientError");
const http404Error_1 = require("./http404Error");
const http400Error_1 = require("./http400Error");
exports.notFoundError = () => {
    throw new http404Error_1.HTTP404Error();
};
exports.badRequestError = () => {
    throw new http400Error_1.HTTP400Error();
};
exports.clientError = (err, res, next) => {
    if (err instanceof httpClientError_1.HTTPClientError) {
        console.warn(err);
        res.status(err.statusCode).send(err.message);
    }
    else {
        next(err);
    }
};
exports.serverError = (err, res, next) => {
    console.error(err);
    if (process.env.NODE_ENV === 'production') {
        res.status(500).send('Internal Server Error');
    }
    else {
        res.status(500).send(err.stack);
    }
};
//# sourceMappingURL=errorHandler.js.map