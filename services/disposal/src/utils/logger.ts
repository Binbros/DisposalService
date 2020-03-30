/* eslint-disable no-shadow */
import path from 'path';
import * as winston from 'winston';
import {Loggly} from 'winston-loggly-bulk';
import dotenv from 'dotenv'
dotenv.config()

const { format } = winston;
const {
  combine, label, json, timestamp, printf,
} = format;
// specify output format
const myFormat = printf(
  ({ level, message, timestamp}) => `${timestamp} ${level}: ${message}`,
);
const logger = winston.createLogger({
  // combine both json and timestamp for log output
  format: combine(
    label({ label: 'category one' }),
    json(),
    timestamp(),
    myFormat,
  ),
  transports: [
    // all logs info and above should be looged in the info.log
    new winston.transports.File({
      level: 'info',
      filename: path.join(`./../logs`, 'info.log'),
    }),
    // all error logs should be logged in the file
    new winston.transports.File({
      level: 'error',
      filename: path.join(`./../logs`, 'error.log'),
    }),
    // all http request to be logged in the info
    new winston.transports.Http({
      level: 'http',
      host: 'localhost',
      port: 8080,
    }),
    // all log with level of warn should be outputed on the console
    new winston.transports.Console({ level: 'warn' }),
    new Loggly({
      token: `${process.env.LOGTOKEN}`,
      subdomain: 'binbro',
      tags: ['Winston-NodeJs'],
      json: true
  })
  ],
  // all exceptions should be logged in the exceptions.log
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(`./../logs`, 'exceptions.log'),
    }),
  ],
  // loggers should not exit if there are exceptions, only log it
  exitOnError: false,
});

;

export default logger