angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(0);

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



      .state('tabsController.system', {
    url: '/system/:prop',
    cache: false,
    views: {
      'tab1': {
        templateUrl: 'templates/system.html',
        controller: 'systemCtrl'
      }
    }
  })
  .state('login', {
    url: '/login',
    cache: false,
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'

  
})

  .state('tabsController.shipyard', {
    url: '/shipyard',
    cache: false,
    views: {
      'tab2': {
        templateUrl: 'templates/shipyard.html',
        controller: 'shipyardCtrl'
      }
    }
  })

  .state('tabsController.trade', {
    url: '/trade',
    cache: false,
    views: {
      'tab3': {
        templateUrl: 'templates/trade.html',
        controller: 'tradeCtrl'
      }
    }
  })
  // .state('tabsController.buy', {
  //   url: '/buy',
  //   views: {
  //     'tab3': {
  //       templateUrl: 'templates/buy.html',
  //       controller: 'buyCtrl'
  //     }
  //   }
  // })

  .state('buy', {
      url: '/buy',
      cache: false,
      parent: 'tabsController.trade',
      templateUrl: 'templates/buy.html',
      controller: 'buyCtrl'

  })
  .state('sell', {
      url: '/sell',
      cache: false,
      parent: 'tabsController.trade',
      templateUrl: 'templates/sell.html',
      controller: 'sellCtrl'

  })

  .state('tabsController', {
    url: '/page1',
    cache: false,
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('tabsController.targetSystem', {
    url: '/warp',
     cache: false,
    views: {
      'tab4': {
        templateUrl: 'templates/targetSystem.html',
        controller: 'targetSystemCtrl'
      }
    }
  })
  // .state('buy', {
  //   url: '/buy',
  //   templateUrl: 'templates/buy.html',
  //   controller: 'buyCtrl'
  // })


  .state('encounter', {
    url: '/page8',
    cache: false,
    templateUrl: 'templates/encounter.html',
    controller: 'encounterCtrl'
  })

  .state('mainMenu', {
    url: '/mainMenu',
    templateUrl: 'templates/mainMenu.html',
    controller: 'mainMenuCtrl'
  })

  .state('bank', {
    url: '/bank',
    templateUrl: 'templates/bank.html',
    controller: 'bankCtrl'
  })

  .state('quests', {
    url: '/quests',
    cache: false,
    templateUrl: 'templates/quests.html',
    controller: 'questsCtrl'
  })

  .state('commanderStatus', {
    url: '/commanderStatus',
    templateUrl: 'templates/commanderStatus.html',
    controller: 'commanderStatusCtrl'
  })

  .state('personnel', {
    url: '/personnel',
    templateUrl: 'templates/personnel.html',
    controller: 'personnelCtrl'
  })

  .state('options', {
    url: '/options',
    templateUrl: 'templates/options.html',
    controller: 'optionsCtrl'
  })

  .state('spaceTrader', {
    url: '/startScreen',
    templateUrl: 'templates/spaceTrader.html',
    controller: 'spaceTraderCtrl'
  })

  .state('newCommander', {
    url: '/newCommander',
    templateUrl: 'templates/newCommander.html',
    controller: 'newCommanderCtrl'
  })

$urlRouterProvider.otherwise('/startScreen')



});
