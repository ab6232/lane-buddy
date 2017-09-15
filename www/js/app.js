//Andrew Behrens
//Mobile Design Final Project

//database variable
var db= null;
//app variable
var app = angular.module('laneBuddy', ['ionic', 'ngCordova']);
//run all this stuff
app.run(function($ionicPlatform, $cordovaSQLite, $ionicHistory, $rootScope) {
  //on ionic ready
  $ionicPlatform.ready(function() {
    //if cordova stuff is found do cordova stuff
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    //im guessing this adds the status bar depending on the os? cool
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    //open/create database object
    db =  window.openDatabase("lb.db", "1.0", "Lane Buddy", 65535);
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS shot (pin1 integer, pin2 integer, pin3 integer, pin4 integer, pin5 integer, pin6 integer, pin7 integer, pin8 integer, pin9 integer, pin10 integer, gameid integer, frame integer, shot integer)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS game (bowlerid integer, gameid integer, score integer)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS bowler (name text, img text, hand text, bowlerid integer)");
    
    //goBack function for all controllers
    $rootScope.goBack = function(){
        $ionicHistory.goBack();
    }

    //image url fetch mathod for all controllers
    $rootScope.urlForImage = function(imageName) {
        //I hate unfilled objects
        if(imageName=="img/filler.png" || imageName == ""|| imageName == undefined || imageName == "undefined"){
            return "img/filler.png";
        }else{
            //gets the file name off of the folder structure and adds to the crrent folder dir
            var name = imageName.substr(imageName.lastIndexOf('/') + 1);
            var trueOrigin = cordova.file.dataDirectory + name;            
            return trueOrigin;
        }     
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {
  //nothing fancy here
  $stateProvider
    .state('app', {
      url: '/',
      templateUrl: 'templates/home.html'   
    })
    .state('newGame', {
      url: '/newGame',
      templateUrl: 'templates/newGame.html',
      controller: 'GameCtrl'      
    })
    .state('newGameForProf', {
      url: '/newGame/:id',
      templateUrl: 'templates/newGame.html',
      controller: 'GameCtrl'      
    })
    .state('newProfile', {
      url: '/newProfile',
      templateUrl: 'templates/newProfile.html',
      controller: 'NewProfileCtrl'
    })
    .state('loadProfile', {
      url: '/loadProfile',
      templateUrl: 'templates/loadProfile.html',
      controller: 'LoadProfileCtrl'
    })
    .state('profile', {
      url: '/profile/:id',
      cache: false,
      templateUrl: 'templates/profile.html',
      controller: 'ProfileCtrl'
    })
    $urlRouterProvider.otherwise('/');
});