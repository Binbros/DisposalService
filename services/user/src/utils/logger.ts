/* eslint-disable no-shadow */
import dotenv from "dotenv";
import path from "path";
import * as winston from "winston";
import {Loggly} from "winston-loggly-bulk";
dotenv.config();

const { format } = winston;
const {
  combine, label, json, timestamp, printf,
} = format;
// specify output format
const myFormat = printf(
  // tslint:disable-next-line: no-shadowed-variable
  ({ level, message, timestamp}) => `${timestamp} ${level}: ${message}`,
);
const logger = winston.createLogger({
  // combine both json and timestamp for log output
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(`./../logs`, "exceptions.log"),
    }),
  ],
  format: combine(
    label({ label: "category one" }),
    json(),
    timestamp(),
    myFormat,
  ),
  transports: [
    // all logs info and above should be looged in the info.log
    new winston.transports.File({
      filename: path.join(`./../logs`, "info.log"),
      level: "info",

    }),
    // all error logs should be logged in the file
    new winston.transports.File({
      filename: path.join(`./../logs`, "error.log"),
      level: "error",

    }),
    // all http request to be logged in the info
    new winston.transports.Http({
      host: "localhost",
      level: "http",

      port: 8080,
    }),
    // all log with level of warn should be outputed on the console
    new winston.transports.Console({ level: "warn" }),
  //   new Loggly({
  //     json: true,
  //     subdomain: "binbro",
  //     tags: ["Winston-NodeJs"],
  //     token: `${process.env.LOGTOKEN}`,

  // }),
  ],
  // all exceptions should be logged in the exceptions.log

  // loggers should not exit if there are exceptions, only log it
  exitOnError: false,
});

export default logger;
