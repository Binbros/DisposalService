"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpClientError_1 = require("./httpClientError");
const http404Error_1 = require("./http404Error");
const http400Error_1 = require("./http400Error");
const logger_1 = __importDefault(require("../logger"));
exports.notFoundError = () => {
    throw new http404Error_1.HTTP404Error();
};
exports.badRequestError = () => {
    throw new http400Error_1.HTTP400Error();
};
exports.clientError = (err, res, next) => {
    if (err instanceof httpClientError_1.HTTPClientError) {
        logger_1.default.error(err);
        res.status(err.statusCode).send(err.message);
    }
    else {
        next(err);
    }
};
exports.serverError = (err, res, next) => {
    logger_1.default.error(err);
    if (process.env.NODE_ENV === 'production') {
        res.status(500).send('Internal Server Error');
    }
    else {
        res.status(500).send(err.stack);
    }
};
//# sourceMappingURL=errorHandler.js.map