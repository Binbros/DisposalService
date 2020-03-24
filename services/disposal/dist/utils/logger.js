"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-shadow */
const path_1 = __importDefault(require("path"));
const winston = __importStar(require("winston"));
const winston_loggly_bulk_1 = require("winston-loggly-bulk");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { format } = winston;
const { combine, label, json, timestamp, printf, } = format;
// specify output format
const myFormat = printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`);
const logger = winston.createLogger({
    // combine both json and timestamp for log output
    format: combine(label({ label: 'category one' }), json(), timestamp(), myFormat),
    transports: [
        // all logs info and above should be looged in the info.log
        new winston.transports.File({
            level: 'info',
            filename: path_1.default.join(`./../logs`, 'info.log'),
        }),
        // all error logs should be logged in the file
        new winston.transports.File({
            level: 'error',
            filename: path_1.default.join(`./../logs`, 'error.log'),
        }),
        // all http request to be logged in the info
        new winston.transports.Http({
            level: 'http',
            host: 'localhost',
            port: 8080,
        }),
        // all log with level of warn should be outputed on the console
        new winston.transports.Console({ level: 'warn' }),
    ],
    // all exceptions should be logged in the exceptions.log
    exceptionHandlers: [
        new winston.transports.File({
            filename: path_1.default.join(`./../logs`, 'exceptions.log'),
        }),
    ],
    // loggers should not exit if there are exceptions, only log it
    exitOnError: false,
});
logger.add(new winston_loggly_bulk_1.Loggly({
    token: `${process.env.LOGTOKEN}`,
    subdomain: 'binbro',
    tags: ['Winston-NodeJS'],
    json: true
}));
exports.default = logger;
//# sourceMappingURL=logger.js.map