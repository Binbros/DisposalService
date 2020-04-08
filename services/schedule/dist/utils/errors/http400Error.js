"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpClientError_1 = require("./httpClientError");
class HTTP400Error extends httpClientError_1.HTTPClientError {
    constructor(message = 'Bad Request') {
        super(message);
        this.statusCode = 400;
    }
}
exports.HTTP400Error = HTTP400Error;
//# sourceMappingURL=http400Error.js.map