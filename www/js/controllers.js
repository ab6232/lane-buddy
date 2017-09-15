//Andrew Behrens Mobile Design Final Project
//Controllers
//Controller for Game states
app.controller('GameCtrl', function($scope, $timeout, $ionicHistory, $state, /*$ionicModal,*/ GameService, Bowler){
    //game starts at frameNum 1, increments when necessary
    $scope.frameNum;
    $scope.shot;
    $scope.game;
    $scope.pinInfo;
    $scope.frameToEdit;
    $scope.quickGame = true;
    //if its coming from an individual profile
    if($state.current.name=="newGameForProf"){
        $scope.quickGame = false;
        $scope.bowlerid = $state.params.id;
        Bowler.getBowler($scope.bowlerid).then(function(bowler){
            $scope.bowler = bowler;
            init();
        });
    }else{
        $scope.bowler = {name: "Quick Game"};
        init();
    }
    //wanted to do edit frame but the math took way too much time
   /* $ionicModal.fromTemplateUrl('templates/editModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });*/

    //function to be called on load
    function init(){
        $scope.game = GameService.newGame();
        $scope.pinInfo = GameService.pinInfo();
        $scope.frameNum = 1;
        $scope.shot = 1;
    }

    $scope.clearGame = function(){
        init();
    }

    //end game for profiles submit game to db
    $scope.endGame = function(){
        Bowler.addGame($scope.bowlerid,$scope.game).then(function(gameid){
            console.log(gameid);
            // for(var i=0; i<$scope.game.length; i++){
                $state.go('profile', {id:$scope.bowlerid});
            // }
        });
    }

    //modal stuff for edit frame
    //on click of a frameNum, allowed if frameNum already or currently being bowled
    // $scope.frameClick = function(frameNum){
    //     $scope.frameToEdit = frameNum-1;
    //     $scope.modal.show();
    // }

    // $scope.closeModal = function() {
    //     $scope.modal.hide();
    // };
    // $scope.$on('$destroy', function() {
    //     $scope.modal.remove();
    // });
    // $scope.$on('modal.hidden', function() {
    //     $scope.frameToEdit = -1;
    // });
    // $scope.$on('modal.removed', function() {
    //     // Execute action
    // });

    //change pin items on click
    $scope.pinClick = function(pin){
        if($scope.shot==1 || $scope.shot=="bonus1" || ($scope.shot=="bonus2" && ($scope.game[9].bonus1.length == 10 || $scope.game[9].bonus1.length == 0))){
            if(pin.down == "false"){
                pin.down = "true";
            }else{
                pin.down = "false";
            }
        }else if($scope.shot==2 || ($scope.shot=="bonus2" && $scope.game[9].bonus1.length < 10 && $scope.game[9].bonus1.length)){
            if(pin.down != "shot1"){                
                if(pin.down == "false"){
                    pin.down = "true";
                }else{
                    pin.down = "false";
                }
            }
        }          
    }

    //fill all pins on either strike or spare
    $scope.mark = function(){
        for(var i=0; i<$scope.pinInfo.length; i++){
            $scope.pinInfo[i].down = "true";
        }
        $timeout(function(){
            $scope.submitShot()
        }, 250);   
    }

    //on submit call GameService for updated info
    $scope.submitShot = function(){
        $scope.game = GameService.calculateScore($scope.game, $scope.frameNum, $scope.shot, $scope.pinInfo);
        $scope.pinInfo = GameService.managePins($scope.pinInfo, $scope.shot);
        var frameAndShot = GameService.getFrameAndShot($scope.game, $scope.frameNum, $scope.shot);
        $scope.frameNum = frameAndShot[0];
        $scope.shot = frameAndShot[1];
    }
})
//controller for new profile
//camera and file idea from research at https://devdactic.com/how-to-capture-and-store-images-with-ionic/
.controller('NewProfileCtrl', function($scope, $ionicHistory, $cordovaCamera, $cordovaFile, $state, Bowler){
    $scope.profileInfo = {
        type:"bowler",
        name: "",
        imgurl:"img/filler.png",//just so stuff doesnt break all over the place :)
        hand: "right"
    };

    //create the profile and add it to DB
    //then go to that profile
    $scope.create = function(){
        if($scope.profileInfo.type == "bowler"){
            Bowler.addBowler($scope.profileInfo).then(function(id){
                $state.go('profile', {id:id});
            });            
        }
    }

    //only words on devices
    //mostly based off example found
    $scope.addImage = function() {
        var options = {
            destinationType : Camera.DestinationType.FILE_URI,
            sourceType : Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
            allowEdit : false,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
        };

        //get photo from camera
        $cordovaCamera.getPicture(options).then(function(data){
            onSuccess(data); 

            function onSuccess(uri){createFile(uri);}   

            function createFile(uri){window.resolveLocalFileSystemURL(uri, copyFile, fail);}
           
            function copyFile(fileEntry) {
                var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                var newName = customuri() + name;    
                window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
                    fileEntry.copyTo(fileSystem2,newName,onCopySuccess,fail);
                },fail);
            }

            function onCopySuccess(entry) {
                $scope.$apply(function () {
                    $scope.profileInfo.imgurl = entry.nativeURL;
                });
            }
    
            function fail(error) {console.error("fail: " + error.code);}
            
            //custom internal uri
            function customuri() {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for (var i=0; i < 5; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            }
        }, function(err) {console.error(err);});
    }
})
//controller for load profile page
.controller('LoadProfileCtrl', function($scope, $ionicHistory, Bowler){
    //get all bowlers
    Bowler.getAllBowlers().then(function(bowlers){
        $scope.bowlers = bowlers;
    });

    //remove a bowler and all games from db
    $scope.delete = function(bowlerid){
        Bowler.removeBowler(bowlerid).then(function(resultBool){
            if(resultBool){
                Bowler.getAllBowlers().then(function(bowlers){
                    $scope.bowlers = bowlers;
                });
            }
        });
    }
})
//controllerfor profiles
.controller('ProfileCtrl', function($scope, $ionicHistory, $state, $ionicModal, Bowler){
    //id bowler from state param
    $scope.whichBowler = $state.params.id;
    //get bowler id from Bowler service
    Bowler.getBowler($scope.whichBowler).then(function(result){
        $scope.bowler = result;
        Bowler.getGames($scope.whichBowler).then(function(games){
            $scope.games = games;
            //calculate average
            var score = 0;
            for(var i=0; i<$scope.games.length; i++){
                score += $scope.games[i].score
            }
            if(score >0){
                $scope.average = score/$scope.games.length;
            }
        })
    });

    $ionicModal.fromTemplateUrl('templates/profModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.gameClick = function(gameNum){
        Bowler.getGameInfo($scope.games[gameNum].gameid).then(function(game){
            $scope.gameToShow = game;
            $scope.modal.show();
        });        
    }

    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    $scope.$on('modal.hidden', function() {
        $scope.frameToEdit = -1;
    });
    $scope.$on('modal.removed', function() {
        // Execute action
    });


    //start new game as profile
    $scope.newGame = function(){
        $state.go('newGameForProf', {id:$scope.whichBowler});
    }
});