var dateFormat = require('dateformat');

exports.home = function(req, res) {
	
	
	res.render('index.ejs', {
		title : "home"
	
	 });
	 
}
