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
const service = express_1.default();
utils_1.applyMiddleware(middleware_1.default, service);
utils_1.applyRoutes(route_1.default, service);
const { PORT = 3000 } = process.env;
const server = http_1.default.createServer(service);
server.listen(PORT, () => {
    // tslint:disable-next-line: no-console
    console.log(`Disposal service is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map