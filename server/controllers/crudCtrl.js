var Player = require("../models/Player")
var HighScore = require("../models/Highscore")
var User = require("../models/User")

module.exports = {
    create: function(req, res) {
        var newPlayer = new Player(req.body);
        newPlayer.save(function(err, result) {

          if (err){   console.log(err)
            return res.status(500).send(err);}
          else{ res.send(result);}
        });
      },

      read: function(req, res) {
        console.log(req.params.id);
          Player.find({user: req.params.id})
            .exec(function(err, result) {
                  if (err) return res.status(500).send(err);
                  else res.send(result);
                });
      },

  update: function(req, res) {
        Player.findByIdAndUpdate(req.params.id, req.body, function(err, result) {
          if (err) return res.status(500).send(err);
          else res.send(result);
        });
    },

    delete: function(req, res) {
        Player.findByIdAndRemove(req.params.id, function(err, result) {
          if (err) return res.status(500).send(err);
          else res.send(result);
        });
    },
    createHighscore: function(req, res) {
        var newHighscore = new HighScore(req.body);
        newHighscore.save(function(err, result) {

          if (err){   console.log(err)
            return res.status(500).send(err);}
          else{ res.send(result);}
        });
      },

      readHighscore: function(req, res) {
          HighScore.find(req.query)
          .exec(function(err, result) {
            if (err) return res.status(500).send(err);
            else res.send(result);
          });
      },
      createUser: function(req, res) {
          var newUser = new User(req.body);
          newUser.save(function(err, result) {

            if (err){   console.log(err)
              return res.status(500).send(err);}
            else{ res.send(result);}
          });
        },

        readUser: function(req, res) {
            User.find(req.query)
            .exec(function(err, result) {
              if (err) return res.status(500).send(err);
              else res.send(result);
            });
        },


}
