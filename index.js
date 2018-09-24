const path = require('path');
var express = require('express');
var logger = require('morgan');
var app = express();
var server = require('http').Server(app);
let port  = 82;

var index = require('./application/config/routes/JSONTREE');

app.set('views', path.join(__dirname, './application/views'));
app.set('view engine', 'ejs');
app.use('/static', express.static(__dirname + '/public'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', index);
require('./application/controllers/soket')(server);
server.listen(port, function (err) {
	if (err) return console.log(err);
	console.log("Servidor corriendo en http://localhost:" , port);
});