"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const utils_1 = require("./utils");
const middleware_1 = __importDefault(require("./middleware"));
const route_1 = __importDefault(require("./src/route"));
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = __importDefault(require("./utils/logger"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
process.on('uncaughtException', e => {
    console.log(e);
    process.exit(1);
});
process.on('unhandledRejection', e => {
    console.log(e);
    process.exit(1);
});
const router = express_1.default();
router.use(morgan_1.default('combined', { stream: {
        write: (message) => {
            logger_1.default.info(message);
        },
    } }));
utils_1.applyMiddleware(middleware_1.default, router);
utils_1.applyRoutes(route_1.default, router);
utils_1.applyMiddleware(errorHandler_1.default, router);
const { PORT = 3000 } = process.env;
const server = http_1.default.createServer(router);
server.listen(PORT, () => {
    // tslint:disable-next-line: no-console
    logger_1.default.warn(`Disposal service is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map