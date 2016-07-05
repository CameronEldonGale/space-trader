var express = require("express");
var bodyParser = require('body-parser');
var cors = require("cors");
var mongoose = require ('mongoose');
var controller = require('./controllers/crudCtrl.js')
var User = require("./models/User")


var app = express();
var server = require('http').createServer(app);
// var io = require('socket.io').listen(app.listen(80))
var io = require('socket.io')(server);

io.on('connection', function(){
 console.log("listening on 9001");
});

server.listen(9001);



require('socketio-auth')(io, {

  authenticate: function (socket, data, callback) {
    //get credentials sent by the client
    var username = data.username;
    var password = data.password;
    console.log( "searching for :",username);
    User.findOne({"username":username},"username password" ,function(err, user) {
      console.log(user);
      console.log(err);
      //inform the callback of auth success/failure
      if (err || !user) return callback(new Error("User not found"));
      return callback(null, user.password == password);
    });
  }
});

// Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
//   if (err) return handleError(err);
//   console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.
// })






app.use(bodyParser.json());

app.use(cors());
app.use(express.static('../www'));

app.post('/api/player', controller.create);
app.get('/api/player', controller.read);
app.put('/api/player/:id', controller.update);
app.delete('/api/player/:id', controller.delete);

app.post('/api/user', controller.createUser);



app.post('/api/highscores', controller.createHighscore);
app.get('/api/highscores', controller.readHighscore);


mongoose.connect('mongodb://localhost/spacetrader');
