
module.exports = {
	home: function (req, res, next) {
		res.sendfile('./public/views/index.html');
	}
}