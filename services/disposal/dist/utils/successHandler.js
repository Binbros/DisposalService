"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successHandler = (res, status, data) => {
    res.status(status).json({
        status,
        data,
    });
};
//# sourceMappingURL=successHandler.js.map