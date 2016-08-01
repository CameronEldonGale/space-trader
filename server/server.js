var express = require("express");
var bodyParser = require('body-parser');
var cors = require("cors");
var mongoose = require ('mongoose');
var controller = require('./controllers/crudCtrl.js')
var http = require('http').Server(app);
var jwt = require('jsonwebtoken');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var socketioJwt = require('socketio-jwt');
var jwtSecret = require('./secret')
// var sio = io.listen(server)
var options = {
  origin: 'http://localhost:8100'
}

app.use(cors(options));
app.use(bodyParser())

io.use(socketioJwt.authorize({
  secret: jwtSecret,
  handshake: true
}));

io.on('connection', function (socket) {
  // in socket.io 1.0
  console.log('hello! ', socket.decoded_token.name);
})


  server.listen(9001, function () {
    console.log('listening on http://localhost:9001');
  });


app.post('/login', function (req, res) {


 var User = require("./models/User");

 User.findOne({name: req.body.username})
 .lean()
  .exec()
  .then(function(user){
    if (user.password !== req.body.password) {
      return res.send("combination not found")
    }
      var token = jwt.sign(user, jwtSecret, { expiresIn: "2 days" });
      // console.log(user);
      var returnObj = {
        token: token,
        id: user._id
      }
      res.json(returnObj);
  }).catch(function(err){
    res.json(err)
  })

});


app.use(bodyParser.json());


app.use(express.static('../www'));

app.post('/api/player', controller.create);
// app.get('/api/player', controller.read);//get rid off yeah?

app.get('/api/player/:id', controller.read)

app.put('/api/player/:id', controller.update);
app.delete('/api/player/:id', controller.delete);

app.post('/api/user', controller.createUser);



app.post('/api/highscores', controller.createHighscore);
app.get('/api/highscores', controller.readHighscore);


mongoose.connect('mongodb://localhost/spacetrader');
