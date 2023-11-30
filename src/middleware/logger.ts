import winston from 'winston'; 
 
const options = { 
  file: { 
    level: 'info', 
    filename: `./logs/app.log`, 
    handleExceptions: true, 
    json: true, 
    maxsize: 5242880, // 5MB 
    maxFiles: 5, 
    colorize: false, 
  } 
} 
 
const logger = winston.createLogger({ 
  levels: winston.config.npm.levels, 
  transports: [ 
    new winston.transports.File(options.file) 
  ], 
  exitOnError: false 
});

export default logger;
