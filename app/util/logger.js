var winston = require('winston');
winston.emitErrs = true;

var logger = new winston.Logger({
    transports: [
        new (winston.transports.File)({
            name: 'info-file',
	    	filename: process.env.PWD+'/logs/info.log',
	    	level: 'info',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
	    new (winston.transports.File)({
	    	name: 'verbose-file',
	    	filename: process.env.PWD+'/logs/verbose.log',
	    	level: 'verbose'
	    }),
	    new (winston.transports.File)({
	    	name: 'debug-file',
	    	filename: process.env.PWD+'/logs/debug.log',
	    	level: 'debug'
	    }),
        new (winston.transports.Console)({
            level: 'info',
            handleExceptions: true,
            json: true,
            colorize: true
        })
    ],
    exitOnError: false
});

module.exports = logger;