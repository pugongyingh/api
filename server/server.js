var express = require('express'); //requiring express
var app = express(); // creating a new node application instance using express



app.get('/',function(req,res){
	res.send('This is the home page');
});

app.listen(80);
console.log('Listening on port 80');
