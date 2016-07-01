var Player = require("../models/Player")
var HighScore = require("../models/Highscore")

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
          Player.find(req.query)
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


}