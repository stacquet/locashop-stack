var formidable 		= require('formidable');
var HttpStatus	= require('http-status-codes');
var fs   = require('fs-extra');
var util = require('util');

module.exports = {
	media: function (req, res, next) {

	      var form = new formidable.IncomingForm();
		  form.parse(req, function(err, fields, files) {
		      res.writeHead(200, {'content-type': 'text/plain'});
		      res.write('received upload:\n\n');
		      res.end(util.inspect({fields: fields, files: files}));
		  });
		  form.on('end', function(fields, files) {
	        /* Temporary location of our uploaded file */
	        var temp_path = this.openedFiles[0].path;
	        /* The file name of the uploaded file */
	        var file_name = this.openedFiles[0].name;
	        /* Location where we want to copy the uploaded file */
	        var new_location = 'c:/locashop/storage/';
	 
	        fs.copy(temp_path, new_location + file_name, function(err) {  
	            if (err) {
	                console.error(err);
	            } else {
	                console.log("success!")
	            }
	        });
	    });

	},
	userInfos : function(req,res,next){
		setTimeout(function(){
			if(req.isAuthenticated()){
				res.send(req.user);
			}
			else{
				res.status(HttpStatus.NOT_FOUND).send();
			}
		},30);
	},
	logout: function (req, res, next) {
		console.log('logout user : '+req.user);
		req.logout();
		res.send({status : "ok"});
	},
	checkEmailAvailable : function(req, res, next) {
			models.User.find({where : {email : req.body.email }})
				.then(function(user){
				res.send({"checkEmailAvailable" : (user!==null?false:true)});
			})
				.catch(function(err){
				res.send({"checkEmailAvailable" : false});
			});
	},
	signup : function(req, res, next) {
		req.id_profil='P_CONSOMMATEUR';
		passport.authenticate('local-signup', function(err, user, info) {
			if (err) { return next(err); }
			if (!user) { return res.send({'statut' : false, 'loginMessages' : req.flash('loginMessage')}); }
			req.logIn(user, function(err) {
				if (err) { return next(err); }
					return res.send({'statut' : true, 'user' : user});
			});
		})(req, res, next);
	},
	facebook : function(req,res,next){
		passport.authenticate('facebook',{ scope : 'email' })(req, res, next);
	},
	facebook_callback : function(req,res,next){
		passport.authenticate('facebook', {
            successRedirect : '/',
            failureRedirect : '/'
        })(req, res, next);
	}
};
