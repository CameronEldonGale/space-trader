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
  $scope.fuelCost = commander.ship.range - commander.ship.fuel
  var maxFuel = commander.ship.range - commander.ship.fuel
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
          // console.log(res);
          if (res === 'max') {
            res = maxFuel
          }
          if (res === "cancel") {
            return
          }

          if (res) {

            var boughtFuel = commanderService.buyFuel(res)
            if (boughtFuel !== 'ok') {
              $ionicPopup.alert({
                  title: boughtFuel,

                  });
              $scope.fuelCost = commander.ship.range - commander.ship.fuel
            }
          }
          return

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


  function warp2(){;
    var distance = planets.getDistance(current, target)

    commanderService.loseFuel(distance)


    var warpTarget = planets.getTarget(index)
    current = warpTarget
    planets.warp(warpTarget)

    $state.go("tabsController.system", warpTarget, {reload:true})
  }

  $scope.warp = warp2

})

.controller('systemCtrl', function($scope, $stateParams, planets) {
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
})

.controller('encounterCtrl', function($scope) {

})

.controller('mainMenuCtrl', function($scope, $state, $ionicModal, $ionicPopup ,commanderService, planets, playerService) {
    $scope.saveGame = function(){
      var commander = commanderService.getCommander()
      var universe = planets.getPlanets()
      commander.planets = universe;
      if (commander._id === "need a new game") {
        $ionicPopup.alert({
            title:'No game to save',

            });
        return
      }
      playerService.saveGame(commander).then(function(res){
        // console.log(res);
        if (res.status === 200) {
          $ionicPopup.alert({
              title:'Game Saved',

              });
        }
      })
    }


    $scope.loadPlayer = function(player){
      // console.log(player.currentSystem.name);
      // console.log(player);
    commanderService.setCommander(player)
    commander = commanderService.getCommander()
    planets.setCurrent(commander.currentSystem)
    planets.setPlanets(commander.planets)
    var test = planets.getPlanets();
    // console.log(test);
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
      playerService.loadGame().then(function(res){
      //  console.log(res);
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
.controller('loginCtrl', function($scope,$state) {
$scope.submit = function(){
 $state.go("mainMenu")
}
})

.controller('spaceTraderCtrl', function($scope) {

})

.controller('newCommanderCtrl', function($scope, $state, commanderService) {
  $scope.points = 16
  $scope.pilot = 1
  $scope.fighter = 1
  $scope.trader = 1
  $scope.engineer = 1
  $scope.commander = {
    name: ""
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

    var player = {
      name: $scope.commander.name,
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


})
