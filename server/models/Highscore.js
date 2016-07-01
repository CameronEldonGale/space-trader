var mongoose = require('mongoose');
var Player = require("./Player")

var Schema = mongoose.Schema;

var ScoreSchema = new Schema ({

  commander: { type: Schema.ObjectId, ref: "Player" },
  score: Number


})



module.exports = mongoose.model("Highscore", ScoreSchema );
