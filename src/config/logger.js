import winston, { format } from 'winston';
import { Writable } from 'stream';
import 'winston-daily-rotate-file';
import config from './config';
import path from 'path';

const enumerateErrorFormat = format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const stream = new Writable({
  objectMode: false,
  write: (raw) => console.log('stream ', raw.toString())
});

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: format.combine(
    enumerateErrorFormat(),
    config.env === 'development' ? format.colorize() : format.uncolorize(),
    format.splat(),
    format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error', 'warn', 'info']  // Thêm 'warn' và 'error' vào đây
    }),
    new winston.transports.DailyRotateFile({
      level: config.env === 'development' ? 'debug' : 'info',
      format: format.printf(({ level, message }) => `${level}: ${message}`),
      filename: path.join(__dirname, '..', 'logs', '%DATE%.log'),
      maxSize: '20m',
      maxFiles: '14d',
      datePattern: 'YYYY-MM-DD',
      prepend: true,
      json: false
    }),
    new winston.transports.Stream({ stream })
  ]
});

export default logger;
