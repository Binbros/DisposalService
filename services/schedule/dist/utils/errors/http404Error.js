"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpClientError_1 = require("./httpClientError");
class HTTP404Error extends httpClientError_1.HTTPClientError {
    constructor(message = 'Not found') {
        super(message);
        this.statusCode = 404;
    }
}
exports.HTTP404Error = HTTP404Error;
//# sourceMappingURL=http404Error.js.map