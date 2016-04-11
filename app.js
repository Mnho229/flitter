// Module Dependencies

var express = require('express'); // Node JS Web Application Server framework
var mysql = require("mysql"); // Allows Web Application to access mysql
var router = require('./router'); //Includes the router.js file

// Setup Middleware

var app = express();
app.use('/static', express.static(__dirname + '/static')); //Designates the static folder for css and JS

// Routes (Allows GET and POST requests)
app.use('/', router); 
app.use('/main', router);
app.use('/fleet', router);
app.use('/generateFleets', router);
app.use('/showfollowers', router);
app.use('/removefollower', router);
app.use('/register', router);
app.use('/suggestions', router);
app.use('/follow', router);
app.use('/logout', router);
app.use('/currProfile', router);

// Default template engine to 'Jade' and set default views folder

app.set('views', '../views');
app.set('view engine', 'jade');

// Start Server
var server = app.listen(2688, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Web App listening at http://%s:%s', host, port);
});
