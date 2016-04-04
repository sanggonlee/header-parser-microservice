'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var session = require('express-session');

var app = express();
require('dotenv').load();

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

routes(app);

app.get('/api/whoami', function(req, res) {
	var ipaddress = req.headers['x-forwarded-for'] || 
		req.connection.remoteAddress || 
     	req.socket.remoteAddress ||
     	req.connection.socket.remoteAddress;
    var userLanguage = req.headers["accept-language"].replace(/,(.*)/, "");
    var osMatch = req.headers['user-agent'].match(/\(([^\(\)]*)\)/);
    var userOS = osMatch ? osMatch[1] : null;
    return res.end(JSON.stringify({
    	"ipaddress": ipaddress,
    	"language": userLanguage,
    	"software": userOS,
    }));
});

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
