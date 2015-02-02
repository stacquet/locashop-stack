
module.exports = function(){
	producteurSchema={};

	producteurSchema.findById = function(id,callback){
		global.winston.log('info', 'producteurSchema.findById');
		callback({name : 'moi'});
	};
	return producteurSchema;
};
// create the model for users and expose it to our app
//module.exports =  producteurSchema;