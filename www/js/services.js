angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])
.service("diceRollService", function(){

  function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  this.d20 = function d20(num){
    if (!num) {
      num = 0;
    }
    return getRandomIntInclusive(1,20)+num
  }

  this.d6 = function d6(num){
    if (!num) {
      num = 0;
    }
    return getRandomIntInclusive(1,6)+num
  }




})

.service("shipService",function(){

  var shipList =[
    {
      ship: "Flea",
      hullStrength: 25,
      hullHealth: 100,
      hull: 25,
      sheild: 0
    },
    {
      ship: "Gnat",
      hullStrength: 100,
      hullHealth: 100,
      hull: 100,
      sheild: 0
    },
    {
      ship: "Firefly",
      hullStrength: 100,
      hullHealth: 100,
      hull: 100,
      sheild: 100,
    },
    {
      ship: "Mosquito",
      hullStrength: 100,
      hullHealth: 100,
      hull: 100,
      sheild: 100,
    },
    {
      ship: "Bumblebee",
      hullStrength: 100,
      hullHealth: 100,
      hull: 100,
      sheild: 100,
    },
    {
      ship: "Beetle",
      hullStrength: 100,
      hullHealth: 100,
      hull: 100,
      sheild: 100,
    },
    {
      ship: "Hornet",
      hullStrength: 100,
      hullHealth: 100,
      hull: 100,
      sheild: 100,
    },
    {
      ship: "Grasshopper",
      hullStrength: 100,
      hullHealth: 100,
      hull: 100,
      sheild: 100,
    },
    {
      ship: "Termite",
      hullStrength: 100,
      hullHealth: 100,
      hull: 100,
      sheild: 100,
    },
    {
      ship: "Wasp",
      hullStrength: 100,
      hullHealth: 100,
      hull: 100,
      sheild: 100,
    }
  ]

  var shipPilot ={
    pilot: 6,
    trader: 6,
    fighter: 6,
    engineer: 6,
  }

  this.getShip = function(encounterShip){
    // console.log(encounterShip);
    for (var i = 0; i < shipList.length; i++) {
    if (encounterShip.ship === shipList[i].ship) {
      return Object.assign(encounterShip, shipList[i], shipPilot)
    }
    }
  }

})

.service("encounterService", function(){

  function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function rollD1000(){
    return getRandomIntInclusive(1,1000)
  }


  var ships =[
    "Flea",
    "Gnat",
    "Firefly",
    "Mosquito",
    "Bumblebee",
    "Beetle",
    "Hornet",
    "Grasshopper",
    "Termite",
    "Wasp"
  ]

  function isThereAnEncounter(popOfGroup){
    var check = rollD1000();
    // var check = 14;
    if (popOfGroup === 0) {
      return false;
    }
    if (popOfGroup === 1 && check <= 14) {
      return true;
    }
    if (popOfGroup === 2 && check <= 34) {
      return true
    }
    if (popOfGroup === 3 && check <= 67) {
      return true
    }
    if (popOfGroup ===4 && check <= 108) {
      return true
    }
    return false;
  }

  function getShip(num, job){
    var random = getRandomIntInclusive(1, 9);
    return {
      class: job,
      clicks: 20 - num,
      ship: ships[random],
    }
  }

   function getNumberofEncounters(popOfGroup){
    var result =[];
    for (var i = 1; i <= 20; i++) {
      var index = i;
      var isEncounter = isThereAnEncounter(popOfGroup)
      if (isEncounter) {
        result.push(index)
      }

    }
    return result
  }

  function num2obj (array, job){
    var result = [];
    for (var i = 0; i < array.length; i++) {
      result.push(getShip(array[i], job))
    }
    // console.log(result);
    return result
  }
  function orderTheArray(array){
    var result =[]
    for (var i = 20; i >= 1; i--) {
      for (var j = 0; j < array.length; j++) {
        if (array[j].clicks === i) {
          result.push(array[j])
        }
      }
    }
    return result;
  }

this.getEncounters = function (pirates, police, traders){
  var pirateArray = getNumberofEncounters(pirates);
  var policeArray = getNumberofEncounters(police);
  var traderArray = getNumberofEncounters(traders);

  pirateArray = num2obj(pirateArray, "pirate")
  policeArray = num2obj(policeArray, "police")
  traderArray = num2obj(traderArray, "trader")

  var unordered = pirateArray.concat(policeArray).concat(traderArray)
  var result = orderTheArray (unordered)
  return result;
}


})
.service('questService', function(){
  this.getQuest = function(string){
    if (string === 'moon') {
      return "A planetiod real estate agent has a Utopian moon for sale. For just 500000 credits you can retire in luxury on your very own moon! <br> do you accept?"
    }
  }

})

.service('playerService', function($http){

  this.saveGame = function (obj){

  if (obj._id) {

    if (obj._id === "need a new game") {
      return "make a new one"
    }
    return $http({
      method: "PUT",
      url:"/api/player/" + obj._id,
      data: obj
    })
  }
  return $http({
    method: 'POST',
    url:'/api/player',
    data: obj
  })
}
this.loadGame= function(id){

  return $http({
    method: 'GET',
    url:'/api/player/'+id
  })

}
this.deleteGame = function (id){
  return $http({
    method: 'DELETE',
    url:host+'/api/player/'+id
  })
}

this.retire= function(player){
  return $http({
    method: 'POST',
    url:'/api/highscores',
    data: player
  })
}

this.createUser = function(user){
  return $http({
    method: 'POST',
    url:'/api/user',
    data: user
  })
}

this.loginUser = function(user){
  // console.log(user);
  return $http({
    method: 'POST',
    url:'/login',
    data: user
  })
}



})


.service('tradeService', function(){




  var Good = function(name, min, max, legal){
    this.name = name;
    this.basePrice = min;
    this.max = max;
    this.avgPrice = Math.ceil((min + ((max-min)/2)));
    this.legal = legal;
    if (legal === undefined) {
      this.legal = true;
    }
  }

  var tradeGoods = {
    water: new Good("Water",30,54),
    furs: new Good("Furs",250,320),
    food: new Good("Food",105,135),
    ore: new Good("Ore",390,490),
    games: new Good("Games",180,240),
    machines: new Good("Machines",690,810),
    firearms: new Good("Firearms",725,1125,false),
    medicine: new Good("Medicine",510,630),
    narcotics: new Good("Narcotics",2625,3500,false),
    robots: new Good("Robots",2625,3500)
  };

  var tradeGoodsList = [
    new Good("Water",30,54),
    new Good("Furs",250,320),
    new Good("Food",105,135),
    new Good("Ore",390,490),
    new Good("Games",180,240),
    new Good("Machines",690,810),
    new Good("Firearms",725,1125,false),
    new Good("Medicine",510,630),
    new Good("Narcotics",2625,3500,false),
    new Good("Robots",2625,3500)
  ]
  this.getTradeGoodsList = tradeGoodsList;


  this.getTradeGoods = tradeGoods;

  var List = function() {
    this.water= 0;
    this.furs= 0;
    this.food= 0;
    this.ore= 0;
    this.games= 0;
    this.firearms= 0;
    this.medicine= 0;
    this.machines= 0;
    this.narcotics= 0;
    this.robots= 0;
    }

  var getPurchasePrice = function(avgPrice, supply, demand, traderSkill){
    var demandQuotient = (demand-supply)/demand
    var price = Math.ceil(avgPrice + (avgPrice * demandQuotient)-( avgPrice * (traderSkill * 0.005)))
    if (price < avgPrice) {
      return avgPrice;
    }
    return price;
  }

  var getSellPrice = function(avgPrice, maxPrice, supply, demand, traderSkill){
    var demandQuotient = (demand-supply)/demand
    var price = Math.ceil(avgPrice + (avgPrice * demandQuotient)+( avgPrice * (traderSkill * 0.005)))
    var highest = Math.ceil(maxPrice + ( avgPrice * (traderSkill * 0.005)))
    if (price > highest) {
      return highest;
    }
    return price;
  }


  this.getSellPrice = function(planet, tradeSkill){


    var planetInventory = planet.inventory
    var sellPrices = new List();

    for (var prop in sellPrices) {
      if (sellPrices.hasOwnProperty(prop)) {
        sellPrices[prop] = getSellPrice(tradeGoods[prop].avgPrice, tradeGoods[prop].max ,planetInventory[prop].supply, planetInventory[prop].demand, tradeSkill)
      }
    }
    return sellPrices
  }.bind(this)

  this.getPurchasePrice =  function(planet, tradeSkill){

    var planetInventory = planet.inventory

    var purchasePrices = new List();

    for (var prop in purchasePrices) {
      if (purchasePrices.hasOwnProperty(prop)) {
        purchasePrices[prop] = getPurchasePrice(tradeGoods[prop].avgPrice, planetInventory[prop].supply, planetInventory[prop].demand, tradeSkill)
      }
    }
    return purchasePrices
  }.bind(this)

  this.getPriceDiff = function(currentPlanet, targetPlanet){
    var currentPlanetPrices = currentPlanet.buyPrice;
    targetPlanet.sellPrice = this.getSellPrice(targetPlanet, 6)
    var targetPlanetPrices = targetPlanet.sellPrice;
    var priceDiff = {}
    for (var item in currentPlanetPrices) {
      priceDiff[item] = targetPlanetPrices[item] - currentPlanetPrices[item]
      if (priceDiff[item] > 0) {
        priceDiff[item] = "+" + priceDiff[item]
      }
    }

    return priceDiff;
  }.bind(this);





})



.service('planets', function(commanderService, questService){

    function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  var getSize = function(){
    var number = getRandomIntInclusive(0,4)
    var sizeArray = ["tiny","small", "medium","large","huge"]
    for (var i = 0; i < sizeArray.length; i++) {
      if (number === i) {
        return sizeArray[i]
      }
    }
  }
  var getTech =function(min, max){
    var tech =[
      "Pre-agricultural",
      "Agricultural",
      "Medieval",
      "Renaissance",
      "Early Industrial",
      "Industrial",
      "Post-industrial",
      "Hi-tech"
    ]

    return tech[getRandomIntInclusive(min,max)]
  }

  var getAttributes =function(){
    var obj = {}

    var governments =[
      "Anarchy",
      "Capitalist State",
      "Communist State",
      "Confederacy",
      "Corporate State",
      "Cybernetic State",
      "Democracy",
      "Dictatorship",
      "Fascist State",
      "Feudal State",
      "Military State",
      "Monarchy",
      "Pacifist State",
      "Socialist State",
      "State of Satori",
      "Technocracy",
      "Theocracy",
    ]

    var govern = getRandomIntInclusive(0,16)

    obj.government = governments[govern];
    obj.x = getRandomIntInclusive(0,10)
    obj.y = getRandomIntInclusive(0,10)
    obj.size = getSize()

    if (obj.government === governments[0]) {
      obj.pirates = "Swarms"
      obj.traders = getRandomIntInclusive(0,4)
      obj.police = "None"
      obj.tech = getTech(0,5)

    }
    if (obj.government === governments[1]) {
      obj.pirates = "Few"
      obj.traders = 4
      obj.police = "Few"
      obj.tech = getTech(5,7)

    }
    if (obj.government === governments[2]) {
      obj.pirates = "Swarms"
      obj.traders = getRandomIntInclusive(0,4)
      obj.police = "Many"
      obj.tech = getTech(0,5)

    }
    if (obj.government === governments[3]) {
      obj.pirates = "Many"
      obj.traders = 4
      obj.police = "Swarms"
      obj.tech = getTech(1,6)

    }
    if (obj.government === governments[4]) {
      obj.pirates = "Few"
      obj.traders = 4
      obj.police = "Swarms"
      obj.tech = getTech(5,7)

    }
    if (obj.government === governments[5]) {
      obj.pirates = "Swarms"
      obj.traders = 3
      obj.police = "Swarms"
      obj.tech = getTech(7,7)


    }
    if (obj.government === governments[6]) {
      obj.pirates = "Some"
      obj.traders = 3
      obj.police = "Some"
      obj.tech = getTech(0,7)

    }
    if (obj.government === governments[7]) {
      obj.pirates = "Swarms"
      obj.traders = 3
      obj.police = "Swarms"
      obj.tech = getTech(0,7)

    }
    if (obj.government === governments[8]) {
      obj.pirates = "Some"
      obj.traders = 1
      obj.police = "Swarms"
      obj.tech = getTech(4,7)

    }
    if (obj.government === governments[9]) {
      obj.pirates = "Swarms";
      obj.traders = 1;
      obj.police = "Few";
      obj.tech = getTech(0,3);

    }
    if (obj.government === governments[10]) {
      obj.pirates = "None"
      obj.traders = getRandomIntInclusive(3,4)
      obj.police = "Swarms"
      obj.tech = getTech(3,7)

    }
    if (obj.government === governments[11]) {
      obj.pirates = "Some"
      obj.traders = 3
      obj.police = "Many"
      obj.tech = getTech(3,7)

    }
    if (obj.government === governments[12]) {
      obj.pirates = "None"
      obj.traders = 4
      obj.police = "Few"
      obj.tech = getTech(0,3)

    }
    if (obj.government === governments[13]) {
      obj.pirates = "Swarms"
      obj.traders = getRandomIntInclusive(0,4)
      obj.police = "Few"
      obj.tech = getTech(0,5)

    }
    if (obj.government === governments[14]) {
      obj.pirates = "None"
      obj.traders = 1
      obj.police = "Few"
      obj.tech = getTech(1,1)

    }
    if (obj.government === governments[15]) {
      obj.pirates = "Few"
      obj.traders = 3
      obj.police = "Swarms"
      obj.tech = getTech(5,7)

    }
    if (obj.government === governments[16]) {
      obj.pirates = "Few"
      obj.traders = 2
      obj.police = "Swarms"
      obj.tech = getTech(0,4)

    }
    return obj

  }

  var List = function() {
    this.water= 0;
    this.furs= 0;
    this.food= 0;
    this.ore= 0;
    this.games= 0;
    this.firearms= 0;
    this.medicine= 0;
    this.machines= 0;
    this.narcotics= 0;
    this.robots= 0;
    }


    var Planet = function(name) {
      this.name= name;
      this.special = false;
      // console.log("planets...");
      if (name === "Utopia") {
        // console.log("hey");
        this.special = "moon";
      }

      this.resource = "Nothing special"
      this.visited = false;
      this.days = 0;
      var attribute = getAttributes();
      this.size= attribute.size
      this.government= attribute.government
      this.tech= attribute.tech
      this.police= attribute.police
      this.pirates= attribute.pirates
      this.traders = attribute.traders
      this.x= attribute.x
      this.y= attribute.y
      this.pressure= "this system is currently under no particular pressure"
      this.buyPrice = new List(),
      this.sellPrice = new List(),
      this.inventory = {
        water: {
          name: "Water",
          supply: getRandomIntInclusive(1, 50),
          demand: 25,


          defaultSupply : getRandomIntInclusive(1, 50),
          sold: true
        },

        furs: {
          name: "Furs",
         supply: getRandomIntInclusive(1, 50),
          demand: 25,


          defaultSupply : getRandomIntInclusive(1, 50),
          sold: true
        },

        food: {
          name: "Food",
         supply: getRandomIntInclusive(1, 50),
          demand: 25,


          defaultSupply : getRandomIntInclusive(1, 50),
          sold: true
        },


        ore: {
          name: "Ore",
         supply: getRandomIntInclusive(1, 50),
          demand: 25,


          defaultSupply : getRandomIntInclusive(1, 50),
          sold: true
        },

        games: {
          name: "Games",
         supply: getRandomIntInclusive(1, 50),
          demand: 25,


          defaultSupply : getRandomIntInclusive(1, 50),
          sold: true
        },

        firearms: {
          name: "Firearms",
         supply: getRandomIntInclusive(1, 50),
          demand: 25,


          defaultSupply : getRandomIntInclusive(1, 50),
          sold: true
        },

        medicine: {
          name: "Medicine",
         supply: getRandomIntInclusive(1, 50),
          demand: 25,


          defaultSupply : getRandomIntInclusive(1, 50),
          sold: true
        },


        machines: {
          name: "Machines",
         supply: getRandomIntInclusive(1, 50),
          demand: 25,


          defaultSupply : getRandomIntInclusive(1, 50),
          sold: true
        },

        narcotics: {
          name: "Narcotics",
          supply: getRandomIntInclusive(1, 50),
          demand: 25,


          defaultSupply : getRandomIntInclusive(1, 50),
          sold: true
        },


        robots: {
          name: "Robots",
         supply: getRandomIntInclusive(1, 50),
          demand: 25,


          defaultSupply : getRandomIntInclusive(1, 50),
          sold: true
        }


    }
  }

    var planets = [
      new Planet("Sol"),
      new Planet("Alpha Centari"),
      new Planet("Aurora"),
      new Planet("Devidia"),
      new Planet("Nvidia"),
      new Planet("Macintosh"),
      new Planet("Microsoft"),
      new Planet("Campbell"),
      new Planet("McDonald"),
      new Planet("Caprica"),
      new Planet("Romulus"),
      new Planet("Kronos"),
      new Planet("Utopia")
    ]

    function updatePlanets (){
      (planets);
      for (var i = 0; i < planets.length; i++) {
        if (currentSystem.name === planets[i].name) {
          currentSystem.visited = true;
          currentSystem.days = 0;
          Object.assign(planets[i],currentSystem)
        }
        if (planets[i].visited === true) {
          planets[i].days = planets[i].days + 1;
        }
        if (planets[i].days > 0) {
          for (var item in planets[i].inventory) {
            if (planets[i].inventory.hasOwnProperty(item)) {
              if (planets[i].inventory[item].supply < planets[i].inventory[item].defaultSupply) {
                planets[i].inventory[item].supply +=  Math.floor(planets[i].inventory[item].defaultSupply * (getRandomIntInclusive(5,20)/100) )
                // console.log( planets[i].name+ " " +planets[i].inventory[item].name +" "+planets[i].inventory[item].supply);
              }
              if (planets[i].inventory[item].supply > planets[i].inventory[item].defaultSupply) {
                planets[i].inventory[item].supply -=  Math.floor(planets[i].inventory[item].defaultSupply * (getRandomIntInclusive(5,20)/100) )
                // console.log( planets[i].name+ " " +planets[i].inventory[item].name +" "+planets[i].inventory[item].supply);
              }
            }
          }
        }
      }
    }
    var universe = planets.slice();

    var   currentSystem = 0;

    function getSystem (){
      if (currentSystem === 0) {
        currentSystem = planets[getRandomIntInclusive(0, planets.length -1)]
      }
      return currentSystem
    }
    getSystem();




    commanderService.setCommanderSystem(currentSystem);

    this.getPlanets = function(){
      return planets;
    }
    this.getVerse = function(){
      setUniverse()
      return universe;
    }
    this.getCurrent = function(){
      return getSystem();

    }

    this.getTarget = function(i){
        return universe[i]
      }

    this.getDistance = function(current, target){
      var deltaX = Math.pow((current.x-target.x),2)
      var deltaY = Math.pow((current.y-target.y),2)
      var XandY = deltaX + deltaY
      return Math.floor(Math.sqrt(XandY))
    }.bind(this)

    function setUniverse (){
      var commander = commanderService.getCommander()
      universe = planets.slice();

      function getDistance(current, target){
        var deltaX = Math.pow((current.x-target.x),2)
        var deltaY = Math.pow((current.y-target.y),2)
        var XandY = deltaX + deltaY
        return Math.floor(Math.sqrt(XandY))
      }

      for (var i = planets.length -1 ; i >= 0; i--) {
        if (currentSystem === planets[i]) {
          universe.splice(i,1)
        }
        var distance = getDistance(currentSystem, planets[i]);

        if (  distance > commander.ship.fuel|| distance === 0) {
          universe.splice(i,1)
        }
      }
    }
    setUniverse()
    this.warp = function(warpTarget){

      updatePlanets()
      currentSystem = warpTarget;
      commanderService.setCommanderSystem(warpTarget);
      setUniverse()
    }
    this.setCurrent = function (planet){
      currentSystem = planet;
    }
    this.setPlanets = function(array){
      planets = array;
    }


})

.service('commanderService', function(tradeService){
  var commander = {name: "commander", pilot: 8, fighter: 2, trader: 6, engineer: 2, _id: "need a new game"}
  commander.credits = 1000
  commander.difficulty = 0
  commander.encounters = false;
  commander.inventory = {
    water: {
      amount: 0,
      purchasePrice: 0,
      totalSpent: 0
    },
    furs: {
      amount: 0,
      purchasePrice: 0,
      totalSpent: 0
    },
    food: {
      amount: 0,
      purchasePrice: 0,
      totalSpent: 0
    },
    ore: {
      amount: 0,
      purchasePrice: 0,
      totalSpent: 0
    },
    games: {
      amount: 0,
      purchasePrice: 0,
      totalSpent: 0
    },
    firearms: {
      amount: 0,
      purchasePrice: 0,
      totalSpent: 0
    },
    medicine: {
      amount: 0,
      purchasePrice: 0,
      totalSpent: 0
    },
    machines: {
      amount: 0,
      purchasePrice: 0,
      totalSpent: 0
    },
    narcotics: {
      amount: 0,
      purchasePrice: 0,
      totalSpent: 0
    },
    robots: {
      amount: 0,
      purchasePrice: 0,
      totalSpent: 0
    }

  }
  commander.ship = {
    name: "Gnat",
    range: 14,
    fuel: 14,
    hullStrength: 100,
    hullHealth: 100,
    hull: 100,
    sheild: 0,
    sheildSlots: 0,
    maxSheildSlots: 0,
    cargobays: {
      total: 15,
      filled: 0
    }
  }
  this.setCommander = function(player){
    commander = Object.assign(commander, player);
    // console.log(commander);
  }
  this.setCommanderSystem = function(system){
    commander.currentSystem = system
    commander.currentSystem.buyPrice = tradeService.getPurchasePrice(system, commander.trader);
    commander.currentSystem.sellPrice = tradeService.getSellPrice(system, commander.trader);
    // come back here
  }
  this.getCommander = function(){
    return commander;
  }.bind(this)

  this.buyMax = function(item, price){
    var planetSupply = commander.currentSystem.inventory[item].supply
    if (planetSupply<=0) {
      return "There isn't anymore to buy"
    }
    var emptyBays = commander.ship.cargobays.total - commander.ship.cargobays.filled
    if (emptyBays <= 0) {
      return "You do not have any empty cargobays";
    }
    var credits = commander.credits
    var numberOfGoods = Math.floor(credits/price)
    if (numberOfGoods <= 0) {
      return "You can't afford any more"
    }
    var limitingFactor = Math.min(emptyBays, planetSupply)
    if (numberOfGoods > limitingFactor) {
      numberOfGoods = limitingFactor
    }

    var totalCost = numberOfGoods * price;
    commander.credits = commander.credits - totalCost;
    commander.inventory[item].amount = commander.inventory[item].amount + numberOfGoods;
    commander.inventory[item].totalSpent = commander.inventory[item].totalSpent + totalCost
    commander.ship.cargobays.filled = commander.ship.cargobays.filled + numberOfGoods;
    commander.currentSystem.inventory[item].supply = planetSupply - numberOfGoods;

    var newtotalAmount = commander.inventory[item].amount;
    var newTotalSpent  = commander.inventory[item].totalSpent;
    commander.inventory[item].purchasePrice = newTotalSpent/newtotalAmount


    return "purchased";
  }

  this.sellAll = function(item, price){
    var planetSupply = commander.currentSystem.inventory[item].supply
    var numberOfGoods = commander.inventory[item].amount
    var profit = numberOfGoods * price;
    commander.credits = commander.credits + profit;
    commander.ship.cargobays.filled = commander.ship.cargobays.filled - numberOfGoods;
    commander.currentSystem.inventory[item].supply = planetSupply + numberOfGoods;
    commander.inventory[item].amount = commander.inventory[item].amount - numberOfGoods;
    commander.inventory[item].totalSpent = 0;
    commander.inventory[item].purchasePrice = 0;
  }

  this.buySome = function(item, amount, price){
    var numberOfGoods = amount;
    var emptyBays = commander.ship.cargobays.total - commander.ship.cargobays.filled
    var planetSupply = commander.currentSystem.inventory[item].supply

    if (amount > emptyBays) {
      return "You do not have enough space in your cargobays"
    }

    var cost = amount * price;
    commander.credits = commander.credits - cost;

    commander.inventory[item].amount = commander.inventory[item].amount + numberOfGoods;
    commander.inventory[item].totalSpent = commander.inventory[item].totalSpent + cost;

    commander.ship.cargobays.filled = commander.ship.cargobays.filled + numberOfGoods;
    commander.currentSystem.inventory[item].supply = planetSupply - numberOfGoods;

    var newtotalAmount = commander.inventory[item].amount;
    var newTotalSpent  = commander.inventory[item].totalSpent;
    commander.inventory[item].purchasePrice = newTotalSpent/newtotalAmount

    return "purchased"
  }

  this.buyFromTrader = function(item, amount, price){

    var item = item.toLowerCase()


    var numberOfGoods = amount;
    var emptyBays = commander.ship.cargobays.total - commander.ship.cargobays.filled


    if (amount > emptyBays) {
      return "You do not have enough space in your cargobays"
    }

    var cost = amount * price;
    commander.credits = commander.credits - cost;
    commander.ship.cargobays.filled = commander.ship.cargobays.filled + numberOfGoods;
    commander.inventory[item].amount = commander.inventory[item].amount + numberOfGoods;
    commander.inventory[item].totalSpent = commander.inventory[item].totalSpent + cost;

    var newtotalAmount = commander.inventory[item].amount;
    var newTotalSpent  = commander.inventory[item].totalSpent;
    commander.inventory[item].purchasePrice = newTotalSpent/newtotalAmount

    return "purchased"


  }

  this.sellSome = function(item, amount, price){

    var numberOfGoods = amount;
    var profit = amount * price;
    commander.credits = commander.credits + profit;
    commander.inventory[item].amount = commander.inventory[item].amount - numberOfGoods;
    if (commander.inventory[item].amount === 0) {
      commander.inventory[item].purchasePrice = 0;
      commander.inventory[item].totalSpent = 0;
    }
    commander.currentSystem.inventory[item].supply = commander.currentSystem.inventory[item].supply + numberOfGoods;
    commander.ship.cargobays.filled = commander.ship.cargobays.filled - numberOfGoods;

    return 'sold'
  }

  this.loseFuel = function(distance){
    commander.ship.fuel -= distance;
  }

  this.buyFuel = function(fuelAmount){

    if (fuelAmount > commander.credits) {
      return "You can't afford it"
    }
    commander.ship.fuel += fuelAmount;
    commander.credits -= fuelAmount;
    return "ok"
  }

})
