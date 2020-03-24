"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusHandler = (res, status, data) => {
    const statusCodes = {
        200: 'data',
        201: 'data',
    };
    res.status(status).json({
        status,
        [statusCodes[status]]: data,
    });
};
//# sourceMappingURL=successHandler.js.map