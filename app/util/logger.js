var winston = require('winston');
winston.emitErrs = true;

var infoFile = process.env.PWD+'/logs/info.log';
var verboseFile = process.env.PWD+'/logs/verbose.log';
var debugFile = process.env.PWD+'/logs/debug.log';


var logger = new winston.Logger({
    transports: [
        new (winston.transports.File)({
            name: 'info-file',
	    	filename: infoFile,
	    	level: 'info',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
	    new (winston.transports.File)({
	    	name: 'verbose-file',
	    	filename: verboseFile,
	    	level: 'verbose'
	    }),
	    new (winston.transports.File)({
	    	name: 'debug-file',
	    	filename: debugFile,
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
console.log('I will log in '+infoFile+'\n'+verboseFile+'\n'+debugFile);

module.exports = logger;