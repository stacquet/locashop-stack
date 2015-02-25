
module.exports = {
	home: function (req, res, next) {
		res.sendfile('./public/app/index.html');
	}
}