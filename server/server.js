var express = require("express");
var bodyParser = require('body-parser');
var cors = require("cors");
var mongoose = require ('mongoose');
var controller = require('./controllers/crudCtrl.js')




var app = express();
app.use(bodyParser.json());
// // NOTE: comment out corsOptions and app.use(corsOptions) before pushing to git
// var corsOptions = {
// 	origin: 'http://localhost:8100'
// };
// for ionic serve
// app.use(cors(corsOptions))
app.use(cors());//---when pushing fix this
app.use(express.static('../www'));

app.post('/api/player', controller.create);
app.get('/api/player', controller.read);
app.put('/api/player/:id', controller.update);
app.delete('/api/player/:id', controller.delete);


app.post('/api/highscores', controller.createHighscore);
app.get('/api/highscores', controller.readHighscore);




var port = 80;
// var port = 9001;
app.listen(port, function(){
console.log("wubba lubba dub dub");});

// mongoose.connect('mongodb://localhost/spacetrader');

// mongoose.connect('mongodb://spacetrader.ninja/spacetrader');


var appConnection = mongoose.createConnection('mongodb://104.131.137.160/api');

appConnection.on('error', console.error.bind(console, 'connection error:'));
appConnection.once('open', function callback () {
  console.log("h");

});
