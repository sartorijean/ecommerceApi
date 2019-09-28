const winston = require('winston');

var options = {
    file: {
        level: 'info',
        filename: './logs/app.log',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5Mb
        maxFiles: 5
    },
    console: {
        level: 'debug',
        handleExceptions: true
    }
}

var logger = winston.createLogger( {
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ], exitOnError: false 
});

logger.stream = {
    write: function(mensagem, enconding) {
        logger.info(mensagem);
    }
}

module.exports = logger;