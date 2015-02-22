var models   	= require('../models/');
var nodemailer	= require('nodemailer');
var mg 			= require('nodemailer-mailgun-transport');
var env       	= process.env.NODE_ENV || "development";
var conf    	= require(__dirname + '/../../config/database.json')[env];

module.exports = {
	emailVerification: function (req, res, next) {


 
		// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails) 
		var auth = {
		  auth: {
		    api_key: 'key-bf82948bf12196434f0a92d5b8061f5e'/*,
		    domain: 'one of your domain names listed at your mailgun.com/app/domains'*/
		  }
		}
		 
		rand=Math.floor((Math.random() * 100) + 54);
	    host=req.get('host');
	    link="http://"+req.get('host')+"/verify?id="+rand;
		var nodemailerMailgun = nodemailer.createTransport(mg(auth));
		nodemailerMailgun.sendMail({
			  from: 'locashoptata@gmail.com',
			  to: req.user.email,
			  subject: 'LOCASHOP : Vérification d\'email',
			  //You can use "html:" to send HTML email content. It's magic! 
		       html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
			}, function (err, info) {
			  if (err) {
			    console.log('Error: ' + err);
			  }
			  else {
			    console.log('Response: ' + info);
			  }
		});

	    console.log(mailOptions);
	}
};
