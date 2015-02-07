var express = require('express');
var routes = require('./routes/main');
var path = require('path');
var app = express();

//for views
app.use(express.static(path.join(__dirname + '/views')));
app.set('view engine', 'ejs');
//use public folder
app.use(express.static(path.join(__dirname, 'public')));
//add routes
app.use('/', routes);

app.listen(80, function(){
	console.log("Server started");
});