var express = require("express");
var bodyParser = require('body-parser');
var cors = require("cors");
var mongoose = require ('mongoose');
var controller = require('./controllers/crudCtrl.js')

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(app.listen(80))

io.on('connection', function(){
 console.log("listening on 80");
});




app.use(bodyParser.json());

app.use(cors());
app.use(express.static('../www'));

app.post('/api/player', controller.create);
app.get('/api/player', controller.read);
app.put('/api/player/:id', controller.update);
app.delete('/api/player/:id', controller.delete);


app.post('/api/highscores', controller.createHighscore);
app.get('/api/highscores', controller.readHighscore);



var port = 80;
// var port = 9001;
server.listen(port);
// app.listen(port, function(){
// console.log("wubba lubba dub dub");});

mongoose.connect('mongodb://localhost/spacetrader');
