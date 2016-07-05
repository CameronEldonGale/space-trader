var express = require("express");
var bodyParser = require('body-parser');
var cors = require("cors");
var mongoose = require ('mongoose');
var controller = require('./controllers/crudCtrl.js')
var http = require('http').Server(app);
var io = require('socket.io')(http);
var jwt = require('jsonwebtoken');
var app = express();
var server = require('http').createServer(app);
var socketioJwt = require('socketio-jwt');
var jwtSecret = require('./secret')
var sio = io.listen(server)

sio.set('authorization', socketioJwt.authorize({
  secret: jwtSecret,
  handshake: true
}));

sio.sockets
  .on('connection', function (socket) {
     console.log(socket.handshake.decoded_token.username, 'connected');
     //socket.on('event');
  });

  server.listen(9001, function () {
    console.log('listening on http://localhost:9001');
  });

app.post('/login', function (req, res) {
   console.log(req.query);
  // // TODO: validate the actual user user
  var profile = {
    username: "bob",
    password: "bob"
  };
  // var profile = req

  // we are sending the profile in the token
  var token = jwt.sign(profile, jwtSecret, { expiresInMinutes: 60*5 });

  res.json({token: token});
});


app.use(bodyParser.json());

app.use(cors(options));
app.use(express.static('../www'));

app.post('/api/player', controller.create);
app.get('/api/player', controller.read);
app.put('/api/player/:id', controller.update);
app.delete('/api/player/:id', controller.delete);

app.post('/api/user', controller.createUser);



app.post('/api/highscores', controller.createHighscore);
app.get('/api/highscores', controller.readHighscore);


mongoose.connect('mongodb://localhost/spacetrader');
