const express = require('express');
const port = process.env.PORT || 3000;
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {


});

app.get('/admin', (req, res) => {


});

app.listen(port, () => {
	console.log("server Open on " + port);

});