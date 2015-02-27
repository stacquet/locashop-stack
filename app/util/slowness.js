module.exports = {

	slow: function (req, res, next) {
		setTimeout(function(){
			return next();
			},500);
	}
};
