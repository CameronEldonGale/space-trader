var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var planetSchema = new Schema ({

    x: Number,
    y: Number,
    visited: Boolean,
    days: Number,
    traders: Number,
    size: String, // enum???
    tech: String,
    name: String,
    pirates: String,
    police: String,
    government: String,
    pressure: String,
    resource: String,
    buyPrice: {
        firearms: Number,
        food: Number,
        furs: Number,
        games: Number,
        machines: Number,
        medicine: Number,
        narcotics: Number,
        ore: Number,
        robots: Number,
        water: Number
    },
    sellPrice: {
      firearms: Number,
      food: Number,
      furs: Number,
      games: Number,
      machines: Number,
      medicine: Number,
      narcotics: Number,
      ore: Number,
      robots: Number,
      water: Number
    },
    inventory: {
      firearms: {
        name: String,
        demand: Number,
        supply: Number,
        sold: Boolean,
        defaultSupply: Number
      },
      food: {
        name: String,
        demand: Number,
        supply: Number,
        sold: Boolean,
        defaultSupply: Number
      },
      furs: {
        name: String,
        demand: Number,
        supply: Number,
        sold: Boolean,
        defaultSupply: Number
      },
      games: {
        name: String,
        demand: Number,
        supply: Number,
        sold: Boolean,
        defaultSupply: Number
      },
      machines: {
        name: String,
        demand: Number,
        supply: Number,
        sold: Boolean,
        defaultSupply: Number
      },
      medicine: {
        name: String,
        demand: Number,
        supply: Number,
        sold: Boolean,
        defaultSupply: Number
      },
      narcotics: {
        name: String,
        demand: Number,
        supply: Number,
        sold: Boolean,
        defaultSupply: Number
      },
      ore: {
        name: String,
        demand: Number,
        supply: Number,
        sold: Boolean,
        defaultSupply: Number
      },
      robots: {
        name: String,
        demand: Number,
        supply: Number,
        sold: Boolean,
        defaultSupply: Number
      },
      water: {
        name: String,
        demand: Number,
        supply: Number,
        sold: Boolean,
        defaultSupply: Number
      }
    }


})

module.exports = planetSchema
