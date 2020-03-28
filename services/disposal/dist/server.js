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
const redis_1 = __importDefault(require("redis"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./utils/logger"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
dotenv_1.default.config();
process.on('uncaughtException', (e) => {
    logger_1.default.error('uncaught exception', e);
    process.exit(1);
});
process.on('unhandledRejection', (e) => {
    logger_1.default.error('Unhandled Promise rejection', e);
    process.exit(1);
});
const router = express_1.default();
router.use(morgan_1.default('combined', { stream: {
        write: (message) => {
            logger_1.default.info(message);
        },
    } }));
// const graphqlServer = new ApolloServer({
// })
// graphqlServer.applyMiddleware({app: router, path:'/graphql'})
utils_1.applyMiddleware(middleware_1.default, router);
utils_1.applyRoutes(route_1.default, router);
utils_1.applyMiddleware(errorHandler_1.default, router);
const redisClient = redis_1.default.createClient(`${process.env.REDISURL}`);
// process.env.REDIS_URL is the redis url config variable name on heroku. 
// if local use redis.createClient()
redisClient.on('connect', () => {
    logger_1.default.warn('Redis client connected');
});
redisClient.on('error', (error) => {
    logger_1.default.error(error);
});
const { PORT = 3000 } = process.env;
const server = http_1.default.createServer(router);
server.listen(PORT, () => {
    // tslint:disable-next-line: no-console
    logger_1.default.warn(`Disposal service is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map