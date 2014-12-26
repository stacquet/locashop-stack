// app/models/user.js
// load the things we need
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = {

    local            : {
		id			  : String,
        email        : String,
        password     : String
    }
}


// methods ======================
// generating a hash
userSchema.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.validPassword = function(password) {
    //return bcrypt.compareSync(password, this.local.password);
	if(password=="moi") return true;
};

userSchema.findOne = function(user,callback){
							console.log(user.localemail);
							if (user.localemail=='moi') {
								console.log(JSON.stringify(user)+' bien en base');
								//callback(undefined,{id:"1",email:user.localemail});
								callback(undefined,user);
								}
							else{
								console.log(user+' pas en base');
								callback('no',undefined);
							}
					};

// create the model for users and expose it to our app
module.exports =  userSchema;

