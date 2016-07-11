angular.module('app.controllers', [])


.controller('mainCtrl', function($scope,commanderService) {
$scope.retire = function(){
  var commander = commanderService.getCommander()
  console.log("retire");
  console.log(commander.name);
  console.log(commander.credits);
}
})


.controller('shipyardCtrl', function($scope,$ionicPopup, commanderService) {

  var commander = commanderService.getCommander()
  $scope.commander = commander
  var maxFuel = commander.ship.range - commander.ship.fuel
  $scope.fuelCost = commander.ship.range - commander.ship.fuel

  $scope.repairCost = 0;
  if (commander.ship.hullHealth < 100) {

    var repairCost = 3 * (commander.ship.hullStrength-commander.ship.hull)
    $scope.repairCost = repairCost
  }

  $scope.repairMax = function(){
    if (commander.credits > $scope.repairCost) {
      commander.credits -= $scope.repairCost
      commander.ship.hull = commander.ship.hullStrength
      commander.ship.hullHealth = 100;
      $scope.repairCost = 0;
    }else {
      $ionicPopup.alert({
          title: "Not enough Credits"
          });
        }
    }

  $scope.repairSome = function(){
    var maxRepair = commander.ship.hullStrength-commander.ship.hull
    if (repairCost > commander.credits) {
      maxRepair = Math.floor(commander.credits/3)
    }

    $scope.data = {}
    $scope.data.buyAmount = 0;
    $scope.data.totalCost = 3 * $scope.data.buyAmount
      var myPopup = $ionicPopup.show({
          title: 'Repair Ship',
          template:" How many hull points do you want to repair?"+"<br>"+"To fix {{data.buyAmount}} would cost "+" {{3*data.buyAmount}} " +'<input ng-model="data.buyAmount" placeholder="0" type="Number" min=0 max='+ maxRepair +'>',
          scope: $scope,
          buttons: [
                      { text: 'Back' },
                      {
                        text: 'Ok',
                        type: 'button-positive',
                        onTap: function(e) {
                          if (!$scope.data.buyAmount) {
                            //don't allow the user to close unless he enters wifi password
                            // e.preventDefault();
                            return "cancel"
                          } else {
                            return $scope.data.buyAmount;
                          }
                        }
                      },
                      {
                        text: 'Max',
                        type: 'button-positive',
                        onTap: function(e) {
                          return "max"
                        }
                      },
                    ]
        })

        myPopup.then(function(res) {
          // console.log(res);
          if (res==="cancel"||!res) {
            return
          }
          if (res ==="max") {
          res = maxRepair
          }
          commander.ship.hull += res;
          commander.credits -= (res*3)
          var repairCost = 3 * (commander.ship.hullStrength-commander.ship.hull)
          $scope.repairCost = repairCost
          commander.ship.hullHealth = Math.ceil(100 *commander.ship.hull/commander.ship.hullStrength)

        })





  }


  $scope.fuelMax = function(){
    var maxFuel = commander.ship.range - commander.ship.fuel
    var boughtFuel = commanderService.buyFuel(maxFuel)
    $scope.fuelCost = commander.ship.range - commander.ship.fuel

    if (boughtFuel !== 'ok') {
      $ionicPopup.alert({
          title: boughtFuel
          });
        }
    }

  $scope.buyFuel = function(){

    $scope.data = {}
      var myPopup = $ionicPopup.show({
          title: 'Buy Fuel',
          template:" How much do you want to spend on fuel?"+ '<input ng-model="data.buyAmount" placeholder="0" type="Number" min=0 max='+ maxFuel +'>',
          scope: $scope,
          buttons: [
                      { text: 'Back' },
                      {
                        text: 'Ok',
                        type: 'button-positive',
                        onTap: function(e) {
                          if (!$scope.data.buyAmount) {
                            //don't allow the user to close unless he enters wifi password
                            // e.preventDefault();
                            return "cancel"
                          } else {
                            return $scope.data.buyAmount;
                          }
                        }
                      },
                      {
                        text: 'Max',
                        type: 'button-positive',
                        onTap: function(e) {
                          return "max"
                        }
                      },
                    ]
        })

        myPopup.then(function(res) {
          //
          if (res === 'max') {
            res = maxFuel
          }
          if (res === "cancel") {
            return
          }

          if (res) {
            // console.log(res);
            var boughtFuel = commanderService.buyFuel(res)
            $scope.fuelCost = commander.ship.range - commander.ship.fuel
            maxFuel = commander.ship.range - commander.ship.fuel
            if (boughtFuel !== 'ok') {
              $ionicPopup.alert({
                  title: boughtFuel
                  });

            }
          }
          return $scope.fuelCost = commander.ship.range - commander.ship.fuel

        });



  }

})
.controller('tradeCtrl', function($scope, commanderService, $state) {
  var commander =  commanderService.getCommander();
  $scope.commander = commander
  $state.go('sell')

})

.controller('sellCtrl', function($scope, $state, $ionicPopup, tradeService, commanderService) {
    $scope.go2Buy = function(){
      $state.go('buy')
    }



    var tradeGoods = tradeService.getTradeGoods;
    var commander =  commanderService.getCommander();
    $scope.commander = commander
    var currentSystem = commander.currentSystem
    var commanderInventory = commanderService.inventory;
    $scope.inventory = tradeGoods;
    var planetInventory = currentSystem.inventory;


    $scope.sellAll = function(item){
      var price = commander.currentSystem.sellPrice[item];
      var sold = commanderService.sellAll(item, price)
      $scope.commander = commanderService.getCommander();
      $scope.inventory = commander.currentSystem.inventory
    }

    $scope.sellSome = function(item){
      var price = commander.currentSystem.sellPrice[item];
      var amount = 0;
      var numberOfGoods = commander.inventory[item].amount
      var purchasePrice = commander.inventory[item].purchasePrice
      var profit = price - purchasePrice
      if (profit >= 0) {
        profit = "Your profit per unit is "+ profit+ " credits"
      }else {
        profit ="Your loss per unit is " + profit + " credits"
      }

      $scope.data = {}
        var myPopup = $ionicPopup.show({
            title: 'Sell '+ item,
            template: 'you can sell up to ' + numberOfGoods +" at " + price +" credits each"+ '<br>'+"You paid about "+ purchasePrice+ " credits per each"+"<br>"+ profit + " <br>" + 'How many do you want to sell? <input ng-model="data.sellAmount" type="Number" min=0 max='+ numberOfGoods+'>' , // String (optional). The html template to place in the popup body.
            // templateUrl: '', // String (optional). The URL of an html template to place in the popup   body.
            scope: $scope,
            buttons: [
                        { text: 'Back' },
                        {
                          text: 'Sell',
                          type: 'button-positive',
                          onTap: function(e) {
                            if (!$scope.data.sellAmount) {
                              //don't allow the user to close unless he enters wifi password
                              // e.preventDefault();
                              return "cancel"
                            } else {
                              return $scope.data.sellAmount;
                            }
                          }
                        },
                        {
                          text: 'All',
                          type: 'button-positive',
                          onTap: function(e) {
                            return "all"
                          }
                        },
                      ]
          })

          myPopup.then(function(res) {
            if (res === undefined|| res === 'cancel') {
              return
            }
            if (res === "all") {
                res = numberOfGoods
            }
            amount = res;
            var sold = commanderService.sellSome(item, amount, price);
            if (sold !== 'sold') {
              $ionicPopup.alert({
                  title: 'Unable to sell',
                  template: sold
                  });
            }
          });



      $scope.commander = commanderService.getCommander();
      $scope.inventory = commander.currentSystem.inventory
    }


})

.controller('buyCtrl', function($scope, $state, $ionicPopup,tradeService, commanderService) {


  var commander =  commanderService.getCommander();
  $scope.commander = commander
  var currentSystem = commander.currentSystem

  var tradeGoods = tradeService.getTradeGoods;


  var planetInventory = currentSystem.inventory;
  $scope.inventory = planetInventory;


    $scope.buyMax = function(item){

      var price = commander.currentSystem.buyPrice[item]

      var purchased = commanderService.buyMax(item, price)
      if (purchased !== "purchased") {

        $ionicPopup.alert({
            title: 'Unable to purchase',
            template: purchased
            });
          }

      $scope.commander = commanderService.getCommander();
      $scope.inventory = commander.currentSystem.inventory
    }

    $scope.buySome = function(item){
        var price = commander.currentSystem.buyPrice[item]
      var credits = commander.credits
      var planetInventory = commander.currentSystem.inventory[item].supply
      var amount = 0;

      var numberOfGoods = Math.floor(credits/price)
      if (numberOfGoods > planetInventory) {
        numberOfGoods = planetInventory
      }




        $scope.data = {}
          var myPopup = $ionicPopup.show({
              title: 'Buy '+ item,
              template: 'at ' + price +" credits each, you can buy up to " + numberOfGoods + '<br>' + 'how many do you want to buy? <input ng-model="data.buyAmount" type="Number" min=0 max='+ numberOfGoods+'>' , // String (optional). The html template to place in the popup body.
              // templateUrl: '', // String (optional). The URL of an html template to place in the popup   body.
              scope: $scope,
              buttons: [
                          { text: 'Back' },

                          {
                            text: 'Buy',
                            type: 'button-positive',
                            onTap: function(e) {
                              if (!$scope.data.buyAmount) {
                                //don't allow the user to close unless he enters wifi password
                                // e.preventDefault();
                                return "cancel"
                              } else {
                                return $scope.data.buyAmount;
                              }
                            }
                          },

                          {
                            text: 'Max',
                            type: 'button-positive',
                            onTap: function(e) {
                              return "max"
                            },
                          }

                        ]
            })

            myPopup.then(function(res) {

              if (res === undefined|| res === 'cancel') {
                return
              }
              if (res === 'max') {
                res = numberOfGoods
              }
              amount = res;
              var purchased = commanderService.buySome(item, amount, price);
              if (purchased !== 'purchased') {
                $ionicPopup.alert({
                    title: 'Unable to purchase',
                    template: purchased
                    });
              }
            });


    }

})










.controller('targetSystemCtrl', function($scope , $window,$ionicPopup ,$state, planets, commanderService, tradeService) {
  var index = 0;
  var verse = planets.getVerse()
  if (verse.length < 1) {
    $state.go("tabsController.shipyard", {fuel: "no fuel"})
    $ionicPopup.alert({
        title: 'NO SYSTEMS IN RANGE',
        template: "You do not have enough fuel to travel to another system"+"<br>"+"<br>"+"Buy some at the shipyard"
        });

  }
  var target = planets.getTarget(index)
  var current = planets.getCurrent()
  var commander =  commanderService.getCommander();
 $scope.commander = commander;
  $scope.price =tradeService.getPriceDiff(current, target)


  $scope.targetSystem = target

  $scope.distance = planets.getDistance(current, target)

  $scope.forward = function(){
    index++;
    if (index >= verse.length) {
      index = 0;
    }
    //
    var target = planets.getTarget(index)
    $scope.targetSystem = target
    current = planets.getCurrent()
    $scope.distance = planets.getDistance(current, target)
    $scope.price =tradeService.getPriceDiff(current, target)
  }
  $scope.back = function(){
    index--;
    if (index < 0) {
      index = verse.length - 1;

    }
    var target = planets.getTarget(index)
    current = planets.getCurrent()

    $scope.targetSystem = target


    $scope.price =tradeService.getPriceDiff(current, target)

  }


  function warp2(){
    var distance = planets.getDistance(current, target)

    commanderService.loseFuel(distance)
    if (commander.ship.sheildSlots > 0) {
      commander.ship.sheild = 100
    }

    var warpTarget = planets.getTarget(index)
    current = warpTarget
    planets.warp(warpTarget)
    commander.encounters = true;
    commander.credits -= commander.difficulty
    $state.go("tabsController.system")

  }

  $scope.warp = warp2

})

.controller('systemCtrl', function($scope, $stateParams,$ionicPopup, planets, commanderService, questService, $state,encounterService,$ionicModal, shipService, diceRollService, tradeService ) {

      var commander = commanderService.getCommander();
      $scope.commander = commander
      $scope.specialShow = commander.currentSystem.special;
      $scope.mercShow = false;
      $scope.news = function(){
        $ionicPopup.alert({
            title:'News',
            template: "Developers need more time to work!"
            });

      }
      // console.log(commander.currentSystem.special);

    $scope.currentSystem = planets.getCurrent()
    var universe = planets.getPlanets()
    for (var i = 0; i < universe.length; i++) {
      if (universe[i].name === $stateParams.name) {
        $scope.currentSystem = universe[i]
      }
    }
    function showResource (target) {
      if (target.visited) {
        return target.resource
      }
      return "Unknown"
    }

    $scope.resource = showResource($scope.currentSystem)

    $scope.seeQuest = function(){
      var template = questService.getQuest(commander.currentSystem.special)
      $scope.data = {}
        var myPopup = $ionicPopup.show({
            title: 'Special Event',
            template: template,
            scope: $scope,
            buttons: [
                        { text: 'Back' },
                        {
                          text: 'Accept',
                          type: 'button-positive',
                          onTap: function(e) {
                            return "ok"
                          }


                        }
                      ]
          })

          myPopup.then(function(res) {

              if (res === 'ok') {
                if (commander.credits > 500000) {
                  commander.credits -= 500000
                  $ionicPopup.alert({
                      title:'You Won!',
                      template: "You retire in luxury on your very own moon",
                    }).then(function(res){
                      $state.go("spaceTrader")
                    })
                  return
                }
                if (commander.credits < 500000) {
                  $ionicPopup.alert({
                      title:'You can\'t afford it!',

                      });
                      return
                }

                console.log("accepted");
              }

            })

    }


        function string2num (string){
          if (string === "Swarms") {
            return 4
          }
          if (string === "Many") {
            return 3
          }
          if (string === "Some") {
            return 2
          }
          if (string === "Few") {
            return 1
          }
          if (string === "None") {
            return 0
          }
        }

        var pirates = string2num(commander.currentSystem.pirates)
        var police = string2num(commander.currentSystem.police)
        var traders = commander.currentSystem.traders
        var encounters = encounterService.getEncounters(pirates, police, traders)
        var totalEncounters = encounters.length
        var completeEncounters = 0;


        if (commander.encounters && totalEncounters > 0) {

        $scope.commander = commander
        $scope.npc = {
          action: "It ignores you"
        }

        // console.log(encounters);
        var index = 0;
        var encounterShip = shipService.getShip(encounters[0])
        // console.log(encounterShip);
        $scope.encounter = encounterShip
        $scope.encounter.hull = 100 * Math.ceil(encounterShip.hullHealth/encounterShip.hullStrength)
        $scope.showAttack = false;
        $scope.showIgnore = false;
        $scope.showFlee = false;
        $scope.showTrade = false;
        $scope.showSubmit = false;
        $scope.showBribe = false;
        $scope.showSurrender = false;


      //HERE
      $scope.modal = $ionicModal.fromTemplateUrl("encounter-modal.html", {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
          if (totalEncounters > 0) {
            $scope.modal.show()
            // console.log(encounterShip);

          function checkClass(){
            // console.log("checking class");
            if (encounterShip.class === "pirate") {
              $scope.showAttack = true;
              $scope.showFlee = true;
              $scope.showSurrender = true;
              $scope.npc.action = "Your opponent attacks!"


            }

            if (encounterShip.class === "trader") {
              $scope.showAttack = true;
              $scope.showIgnore = true;
              $scope.showTrade = true;
              $scope.npc.action = "You are hailed with an offer to trade"
            }

            if (encounterShip.class === "police") {
              $scope.showAttack = true;
              $scope.showFlee = true;
              $scope.showSubmit = true;
              $scope.showBribe = true;
              $scope.npc.action = "The police summon you to submit to an inspection"
            }
          }

          checkClass()

            function next(){
              completeEncounters +=1;
              if (totalEncounters > completeEncounters) {
                encounterShip = shipService.getShip(encounters[completeEncounters])
                $scope.encounter = encounterShip
                $scope.encounter.hull = 100 * Math.ceil(encounterShip.hullHealth/encounterShip.hullStrength)
                $scope.npc = {}
                if (commander.ship.hull < commander.ship.hullStrength) {
                commander.ship.hull += commander.engineer;
                    if (commander.ship.hull > commander.ship.hullStrength) {
                      commander.ship.hull = commander.ship.hullStrength
                    }
                commander.ship.hullHealth = Math.ceil(100 *commander.ship.hull/commander.ship.hullStrength)

                $scope.commander = commander
                }


                if (commander.ship.sheild) {
                  commander.ship.sheild += 2*commander.engineer
                  if (commander.ship.sheild > 100) {
                    commander.ship.sheild = 100
                  }
                }



                $scope.showAttack = false;
                $scope.showIgnore = false;
                $scope.showFlee = false;
                $scope.showTrade = false;
                $scope.showSubmit = false;
                $scope.showBribe = false;
                $scope.showSurrender = false;



                if (encounterShip.class === "pirate") {
                  $scope.showAttack = true;
                  $scope.showFlee = true;
                  $scope.showSurrender = true;
                  $scope.npc.action = "Your opponent attacks!"


                }

                if (encounterShip.class === "trader") {
                  $scope.showAttack = true;
                  $scope.showIgnore = true;
                  $scope.showTrade = true;
                  $scope.npc.action = "You are hailed with an offer to trade"
                }

                if (encounterShip.class === "police") {
                  $scope.showAttack = true;
                  $scope.showFlee = true;
                  $scope.showSubmit = true;
                  $scope.showBribe = true;
                  $scope.npc.action = "The police summon you to submit to an inspection"
                }

                return
              }
              $scope.modal.hide()
            }
          $scope.cheat = function(){
            $ionicPopup.alert({
               title: 'Cheat',
               template: 'destroy the other ship?'
             }).then(function(res) {
               next()

                });
          }
          $scope.attack = function(){
            $scope.showFlee = true;
            $scope.showSurrender = true;
            $scope.showBribe = false;
            $scope.showIgnore = false;
            $scope.showSubmit = false;
            $scope.showTrade = false;
            $scope.npc.player = "You open fire on the " + encounterShip.class +" " +encounterShip.ship
            $scope.npc.action = "Your opponent attacks"
            // console.log("attack!");
            var playerAttack = diceRollService.d20(commander.fighter)
            var playerDodge = diceRollService.d20(commander.pilot)
            var npcAttack = diceRollService.d20(encounterShip.fighter)
            var npcDodge = diceRollService.d20(encounterShip.pilot)
            if (playerAttack > npcDodge) {
              // console.log("player  hits!");
              $scope.npc.playerResult = "You hit your opponent!"
              var damage = diceRollService.d6()

              if (encounterShip.sheild > 0) {
                encounterShip.sheild -= damage
              }else {
                encounterShip.hull -= damage;
                encounterShip.hullHealth = Math.ceil(100 *encounterShip.hull/encounterShip.hullStrength)
                $scope.encounter = encounterShip
              }
            }else {
              // console.log("player misses");
              $scope.npc.playerResult = "You miss!"
            }
            if (npcAttack > playerDodge) {
              // console.log("npc hits");
             $scope.npc.result = "Your opponent hits you!"
              var damage = diceRollService.d6()
              if (commander.ship.sheild > 0) {
                // console.log("sheild");
                commander.ship.sheild -= damage
              }else {
                commander.ship.hull -= damage;
                commander.ship.hullHealth = Math.ceil(100 *commander.ship.hull/commander.ship.hullStrength)
                $scope.commander = commander
              }

            }else {
              // console.log("npc misses");
             $scope.npc.result = "Your opponent misses!"
            }
            if (commander.ship.hullHealth < 0) {
              $ionicPopup.alert({
                 title: 'YOU DIED!',
                 template: "Your opponent destroys your ship, and what little remains of your body float off into oblivion. Unfortunately this means you lost the game"
               }).then(function(res) {
                 $state.go("spaceTrader")

                  });
            }
            if (encounterShip.hull < 0) {
              var template =""
              if (encounterShip.class === "pirate") {
                commander.credits += 500;
                template = "You collect a 500 credit bounty for destroying the pirate"
              }
              $ionicPopup.alert({
                 title: 'You defeat your opponent',
                 template: template,
               }).then(function(res) {
                    next()

                  });

            }


          }

          function inspection(){
            if (commander.inventory.firearms.amount > 0 || commander.inventory.narcotics.amount > 0) {
              commander.credits -= 500
              if (commander.credits < 0) {
                commander.credits = 0
              }
              for (var good in commander.inventory) {
                commander.inventory[good].amount=0
              }
              // console.log(commander);
              return "The police search your cargo holds and find illegal goods! All of your cargo is confiscated, you are fined, and jailed at the nearest system. After a few days you are released"
            }
            return "The police find nothing illegal, apologize for the inconvenience, and thank you for your cooperation"
          }

          function plunder(){
            for (var good in commander.inventory) {
              commander.inventory[good].amount=0
            }
            commander.credits = commander.credits * .5
          }

          $scope.ignore = function(){
            next()
          }

          $scope.flee = function(){
            // console.log("flee");
            var playerRun = diceRollService.d20(commander.pilot)
            var npcFollow = diceRollService.d20(encounterShip.pilot)
            if (playerRun > npcFollow + 5) {
              $ionicPopup.alert({
                 title: 'You got away',
               }).then(function(res) {
                 next()
               })
            }
            $scope.npc.player = "You try to flee"
            $scope.npc.playerResult = "Your opponent is still following you"
            if (encounterShip.sheild < 100) {
              $scope.action = "Your opponent attacks"
              var playerDodge = diceRollService.d20(commander.pilot)
              var npcAttack = diceRollService.d20(encounterShip.fighter)
              if (npcAttack > playerDodge) {
                // console.log("npc hits");
               $scope.npc.result = "Your opponent hits you!"
                var damage = diceRollService.d6()
                if (commander.ship.sheild > 0) {
                  // console.log("sheild");
                  commander.ship.sheild -= damage
                }else {
                  commander.ship.hull -= damage;
                  commander.ship.hullHealth = Math.ceil(100 *commander.ship.hull/commander.ship.hullStrength)
                  $scope.commander = commander
                }

              }else {
                // console.log("npc misses");
               $scope.npc.result = "Your opponent misses!"
              }
              if (commander.ship.hullHealth < 0) {
                $ionicPopup.alert({
                   title: 'YOU DIED!',
                   template: "Your opponent destroys your ship, and what little remains of your body float off into oblivion. Unfortunately this means you lost the game"
                 }).then(function(res) {
                   $state.go("spaceTrader")

                    });

            }
          }
        }

          $scope.bribe = function(){
            var bribe = 2000
            $ionicPopup.confirm({
               title: 'Bribe',
               template: "I'll look the other way for "+bribe+" credits"
             }).then(function(res) {
              if (res) {
                if (commander.credits > bribe) {
                  commander.credits -= bribe
                  next()
                  return
                }else {
                  $ionicPopup.alert({
                     title: 'You do not have enough to bribe the officer',
                   }).then(function(res) {

                      });

                }
              }
             })
          }

          $scope.submit = function(){
            console.log("submit");
            var template = inspection()
            $ionicPopup.alert({
               title: template,
             }).then(function(res) {
               if (template ===  "The police find nothing illegal, apologize for the inconvenience, and thank you for your cooperation") {
                 next()
                 return
               }else {

                 $scope.modal.hide()
               }

                });
          }

          $scope.surrender = function(){
            console.log("surrender");
            if (encounterShip.class === "pirate") {
              plunder()
              $ionicPopup.alert({
                 title: "The Pirates take all of your cargo and some credits",
               }).then(function(res) {
                 next()
               })
            }
            if (encounterShip.class === "trader") {
              plunder()
              $ionicPopup.alert({
                 title: "Your opponent's crew take all of your cargo and some credits",
               }).then(function(res) {
                 next()
               })
            }
            if (encounterShip.class === "police") {
              $ionicPopup.alert({
                 title:"You Lost",
                 template: "You are arrested and thrown in prison. You are never released.",
               }).then(function(res) {
                 $state.go("spaceTrader")
               })

            }

          }

          $scope.trade = function(){

            function getRandomIntInclusive(min, max) {
              return Math.floor(Math.random() * (max - min + 1)) + min;
            }


            $scope.data = {}
            var forSaleGoods = getRandomIntInclusive(1,5);
            var tradeList = tradeService.getTradeGoodsList
            var random =getRandomIntInclusive(0,9)
            var item = tradeList[random]

            var price  = Math.ceil(item.avgPrice + (item.avgPrice*(getRandomIntInclusive(-50,50)/100)));

            var credits = commander.credits
            var numberOfGoods = Math.floor(credits/price)
            if (numberOfGoods > forSaleGoods) {
              numberOfGoods = forSaleGoods
            }

              var myPopup = $ionicPopup.show({
                  title: "Trade Offer",
                  template: 'The trader offers you '+ item.name + " at "+ price +" credits. They have " + forSaleGoods + '<br>'+ "You can afford " + numberOfGoods + '<br>' + 'how many do you want to buy? <input ng-model="data.buyAmount" type="Number" min=0 max='+ numberOfGoods+'>' , // String (optional). The html template to place in the popup body.
                  scope: $scope,
                  buttons: [
                              { text: 'Back',
                              onTap: function(e) {
                                return "back"
                              },
                             },

                              {
                                text: 'Buy',
                                type: 'button-positive',
                                onTap: function(e) {
                                  if (!$scope.data.buyAmount) {
                                    //don't allow the user to close unless he enters wifi password
                                    // e.preventDefault();
                                    return "cancel"
                                  } else {
                                    return $scope.data.buyAmount;
                                  }
                                }
                              },

                              {
                                text: 'Max',
                                type: 'button-positive',
                                onTap: function(e) {
                                  return "max"
                                },
                              }

                            ]
                })

                myPopup.then(function(res) {
                    // console.log(res);
                                if (res === "back"|| res === 'cancel') {
                                  next()
                                  return
                                }
                                if (res === 'max') {
                                  res = numberOfGoods
                                }
                                amount = res;
                                var purchased = commanderService.buyFromTrader(item.name, amount, price);
                                if (purchased !== 'purchased') {
                                  $ionicPopup.alert({
                                      title: 'Unable to purchase',
                                      template: purchased
                                      });

                                }
                                if (purchased === "purchased") {
                                  next()
                                }

                });

          }// trade function end










        }
        });




        $scope.openModal = function() {
          $scope.modal.show();
        };
        $scope.closeModal = function() {
          $scope.modal.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
          $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
          // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
          // Execute action
        });


        commander.encounters = false;
}



})

.controller('encounterCtrl', function($scope,$state,commanderService,encounterService, $ionicPopup, $ionicModal) {





















  $scope.land = function(){
    $state.go("tabsController.system")
  }
$state.go("tabsController.system")
})

.controller('mainMenuCtrl', function($scope, $state, $ionicModal, $ionicPopup ,commanderService, planets, playerService) {


    $scope.saveGame = function(){
      var commander = commanderService.getCommander()
      var universe = planets.getPlanets()
      commander.planets = universe;
      commander.user = localStorage.id
      if (commander._id === "need a new game") {
        $ionicPopup.alert({
            title:'No game to save',

            });
        return
      }
      playerService.saveGame(commander).then(function(res){
        //
        if (res.status === 200) {
          $ionicPopup.alert({
              title:'Game Saved',

              });
        }
      })
    }
    $scope.deletePlayer = function(player){
      console.log(player);
      $ionicPopup.confirm({
        title: "Are you sure you want to delete "+player.name+" ?"
      }).then(function(res){
        // console.log(res);
        if (res) {
          playerService.deleteGame(player._id).then(function(res){
            var id = localStorage.id
            playerService.loadGame(id).then(function(res){
            //
            $scope.savedGames = res.data

           })
          })
        }
      })
    }

    $scope.loadPlayer = function(player){
      //
      //
    commanderService.setCommander(player)
    commander = commanderService.getCommander()
    planets.setCurrent(commander.currentSystem)
    planets.setPlanets(commander.planets)
    var test = planets.getPlanets();
    //
      $state.go("tabsController.system")
    }

    $ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.loadGame = function() {
      $scope.modal.show();
      var id = localStorage.id
      playerService.loadGame(id).then(function(res){
      //
      $scope.savedGames = res.data

     })
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });

    $scope.logout = function(){
      $state.go("login")
      localStorage.setItem("id","")
      localStorage.setItem("token","")
    }


})

.controller('bankCtrl', function($scope) {

})

.controller('questsCtrl', function($scope) {

})

.controller('commanderStatusCtrl', function($scope, commanderService) {
  $scope.commander = commanderService.getCommander();
  $scope.showCommander = function(){
    console.log(commanderService.getCommander());
  }
})

.controller('personnelCtrl', function($scope) {

})

.controller('optionsCtrl', function($scope) {

})

.controller('socketCtrl', function($scope) {
  var token = localStorage.token
  var socket;
  $scope.$on("logged in",function (ev, data){
    console.log("connection");
    socket = io.connect('http://localhost:9001', {
    'query': 'token=' + token
  });
  })





})

.controller('loginCtrl', function($scope,$state,$ionicPopup,playerService) {



      $scope.submit = function(user){

        playerService.loginUser(user).then(function(res){

          var token = res.data.token
          localStorage.setItem("id", res.data.id)
          localStorage.setItem("token", token);
          // console.log(localStorage);
          if (token) {
            $state.go("mainMenu")
            $scope.$emit("logged in", token)
          }else {
            $state.go("login")
            $ionicPopup.alert({
                title: "Unable to login",
                template: "password and username do not match"

                });
          }

        })

      }

      $scope.signUp = function(user){
        // console.log(user);

        if (user === undefined||user.name === undefined||user.password === undefined||user.email === undefined) {
          $state.go("login",{},{reload:true})
          $ionicPopup.alert({
              title: "Unable to sign up",
              template: "all feilds are required"

              });
              return
        }

        playerService.createUser(user).then(function(res){

          localStorage.setItem("id", res.data._id)
          // console.log(localStorage.id);
          $state.go("mainMenu",{},{reload:true})
        })
      }



})

.controller('spaceTraderCtrl', function($scope) {

})
.controller('helpCtrl', function($scope) {

})

.controller('newCommanderCtrl', function($scope, $state, commanderService, $ionicModal) {
  $scope.points = 16
  $scope.pilot = 1
  $scope.fighter = 1
  $scope.trader = 1
  $scope.engineer = 1
  $scope.commander = {
    name: ""
  }
  $scope.difficulty = "Beginner"

  var difficulty = [
    "Beginner",
    "Easy",
    "Normal",
    "Hard",
    "Impossible"
  ]
  $scope.plusD = function(){
    if ($scope.difficulty === "Impossible") {
      return
    }
    var index = difficulty.lastIndexOf($scope.difficulty)
    $scope.difficulty = difficulty[index+1]

  }
  $scope.minusD = function(){
    if ($scope.difficulty === "Beginner") {
      return
    }
    var index = difficulty.lastIndexOf($scope.difficulty)
    $scope.difficulty = difficulty[index-1]

  }

  $scope.plus = function (skill){
    if ($scope.points === 0|| $scope[skill] === 10) {
      return
    }
    $scope.points--;
    $scope[skill]++;
  }
  $scope.minus = function (skill){
    if ($scope[skill]===1) {
      return
    }
    $scope.points++;
    $scope[skill]--;
  }

  $scope.newCommander = function(){
    if ($scope.commander.name === ""||$scope.points !== 0) {
      return
    }
    function difficultyCheck(){
      return 25 * difficulty.lastIndexOf($scope.difficulty)
    }
    var player = {
      name: $scope.commander.name,
      difficulty: difficultyCheck(),
      pilot: $scope.pilot,
      fighter: $scope.fighter,
      trader: $scope.trader,
      engineer: $scope.engineer
    }
    var commander =commanderService.getCommander()
    delete commander._id

    commanderService.setCommander(player);
  $state.go("tabsController.system")

  }

  $ionicModal.fromTemplateUrl('intro-modal.html', {
  scope: $scope,
  animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.modal.show();
  });

  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });



})
