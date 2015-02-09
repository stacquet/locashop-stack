
module.exports = {

	findById : function(id,callback){
		global.winston.log('info', 'producteurSchema.findById');
		callback({name : 'moi'});
	}
}