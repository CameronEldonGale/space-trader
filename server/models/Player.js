var mongoose = require('mongoose');
var planet = require("./Planet")
// var user = require("./User")

var Schema = mongoose.Schema;

var playerSchema = new Schema({
  user: { type: Schema.ObjectId, ref: "User" },
  special: Schema.Types.Mixed,
  name: String,
  pilot: Number,
  fighter: Number,
  trader: Number,
  engineer: Number,
  credits: Number,
  ship: {
    name: String,
    range: Number,
    fuel: Number,
  cargobays: {
    filled: Number,
    total: Number
    }
  },
  planets: [planet],
  inventory: {

        firearms:{
          amount: Number,
          purchasePrice: Number,
          totalSpent: Number
        },

        food:{
          amount: Number,
          purchasePrice: Number,
          totalSpent: Number
        },

        furs:{
          amount: Number,
          purchasePrice: Number,
          totalSpent: Number
        },

        games:{
          amount: Number,
          purchasePrice: Number,
          totalSpent: Number
        },

        machines:{
          amount: Number,
          purchasePrice: Number,
          totalSpent: Number
        },

        medicine:{
          amount: Number,
          purchasePrice: Number,
          totalSpent: Number
        },

        narcotics:{
          amount: Number,
          purchasePrice: Number,
          totalSpent: Number
        },

        ore:{
          amount: Number,
          purchasePrice: Number,
          totalSpent: Number
        },

        robots:{
          amount: Number,
          purchasePrice: Number,
          totalSpent: Number
        },

        water:{
          amount: Number,
          purchasePrice: Number,
          totalSpent: Number
        }
      },
      currentSystem: planet




})


module.exports = mongoose.model("Player", playerSchema );
