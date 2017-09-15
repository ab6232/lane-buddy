//Andrew Behrens Mobile Design Final Project
//Services
//GameService used for calculating score and stuff for games
app.service('GameService', function(){
    //returns fresh game array
    this.newGame = function(){
        return [
        {"frame":"1", "shot1":[], "shot2":[]},
        {"frame":"2", "shot1":[], "shot2":[]},
        {"frame":"3", "shot1":[], "shot2":[]},
        {"frame":"4", "shot1":[], "shot2":[]},
        {"frame":"5", "shot1":[], "shot2":[]},
        {"frame":"6", "shot1":[], "shot2":[]},
        {"frame":"7", "shot1":[], "shot2":[]},
        {"frame":"8", "shot1":[], "shot2":[]},
        {"frame":"9", "shot1":[], "shot2":[]},
        {"frame":"10", "shot1":[], "shot2":[], "bonus1":[], "bonus2":[]}        
    ];
    }

    //returns fresh pin information
    this.pinInfo = function(){
        return [
        {"pin":"7", "down": "false", "col":"col-25 text-center"},
        {"pin":"8", "down": "false", "col":"col-25 text-center"},
        {"pin":"9", "down": "false", "col":"col-25 text-center"},
        {"pin":"10", "down": "false", "col":"col-25 text-center"},
        {"pin":"4", "down": "false", "col":"col-33 text-right"},
        {"pin":"5", "down": "false", "col":"col-33 text-center"},
        {"pin":"6", "down": "false", "col":"col-33 text-left"},
        {"pin":"2", "down": "false", "col":"col-50 text-right"},
        {"pin":"3", "down": "false", "col":"col-50 text-left"},
        {"pin":"1", "down": "false", "col":"col-100 text-center"}
    ];
    }

    //refreshes pin object based on algorithms I don't want to think about ever again
    this.managePins = function(pins, shot){
        if(shot==1 || shot=='bonus1'){
            var pinCount = 0;
            for(var i=0; i<pins.length; i++){
                if(pins[i].down == "true"){
                    pinCount++;
                    pins[i].down = "shot1";
                }
            }
            if(pinCount==10){
                for(var i=0; i<pins.length; i++){
                    pins[i].down = "false";
                }
            }
        }else if(shot==2 || shot=='bonus2'){
            for(var i=0; i<pins.length; i++){
                pins[i].down = "false";
            }
        }
        return pins;
    }

    //calculate score based on algorithms I don't want to think about ever again
    //yes I did this by scratch
    //this is bad code
    this.calculateScore = function(game, frame, shot, pins){
        var shot1 = game[frame-1].shot1;
        var shot2 = game[frame-1].shot2;
        var score = game[frame-1].score;
        if(shot == 1){
            for(var i=0; i<pins.length; i++){
                if(pins[i].down == "true"){
                    shot1.push(pins[i].pin);
                }
            }   
        }
        else if(shot == 2){
            for(var i=0; i<pins.length; i++){
                if(shot1.indexOf(pins[i].pin) == -1 && pins[i].down == "true"){
                    shot2.push(pins[i].pin);
                }              
            }            
        }else if(shot=="bonus1"){
            for(var i=0; i<pins.length; i++){
                if(pins[i].down == "true"){
                    game[9].bonus1.push(pins[i].pin);
                }
            }
        }else if(shot=="bonus2"){
            if(game[9].bonus1.length == 10 || game[9].bonus1.length == 0){
                for(var i=0; i<pins.length; i++){
                    if(pins[i].down == "true"){
                        game[9].bonus2.push(pins[i].pin);
                    }
                }
            }else if(game[9].bonus1.length < 10 && game[9].bonus1.length){
                for(var i=0; i<pins.length; i++){
                    if(game[9].bonus1.indexOf(pins[i].pin) == -1 && pins[i].down == "true"){
                        game[9].bonus2.push(pins[i].pin);
                    }              
                }  
            }            
        }        
        if(frame == 1){
            if(shot==1){
                score = shot1.length;
            }else{
                score += shot2.length;
            }
        }else if(frame==2){
            if(shot==1){
                if(game[frame-2].shot1.length + game[frame-2].shot2.length == 10){
                    game[frame-2].score += shot1.length;                    
                }
                score = game[frame-2].score + shot1.length;
            }else{
                if(game[frame-2].shot1.length == 10){
                    game[frame-2].score += shot2.length;
                }
                score = game[frame-2].score + shot2.length + shot1.length;
            }
        }else {
            if(shot==1){
                if(game[frame-2].shot1.length == 10){
                    if(game[frame-3].shot1.length == 10){
                        game[frame-3].score += shot1.length;
                        game[frame-2].score += shot1.length;
                    }
                    game[frame-2].score += shot1.length;
                }else if(game[frame-2].shot1.length + game[frame-2].shot2.length == 10){
                    game[frame-2].score += shot1.length;
                }
                score = game[frame-2].score + shot1.length;
            }else if(shot==2){
                if(game[frame-2].shot1.length == 10){
                    game[frame-2].score += shot2.length;
                }
                score = game[frame-2].score + shot2.length + shot1.length;
            }else if(shot=="bonus1"){
                if(game[8].shot1.length == 10){
                    game[8].score +=  game[9].bonus1.length; 
                    score +=  game[9].bonus1.length;
                }
                score +=  game[9].bonus1.length;
            }else if(shot=="bonus2"){
                score +=  game[9].bonus2.length;                
            }
        }
        game[frame-1].score = score;
        return game;
    }

    //update the frame and shot info for the game based on algorithms I don't want to think about ever again
    this.getFrameAndShot = function(game, frame, shot){
        var shot1 = game[frame-1].shot1;
        var shot2 = game[frame-1].shot2;
        if((shot1.length == 10 || shot == 2) && frame != 10){
            frame++;
            shot=1;
        }else if(shot==1 && frame != 10){
            shot = 2;
        }else if(frame == 10){
            if(shot==1){
                if(shot1.length == 10){
                    shot = "bonus1";
                }else{
                    shot = 2;
                } 
            }else if(shot == 2){
                if(shot1.length + shot2.length == 10){
                    shot = "bonus2";
                }else{
                    shot="done";
                }
            }else if(shot == "bonus1"){
                shot = "bonus2";
            }else if(shot == "bonus2"){
                shot="done";
            }                    
        }
        return [frame, shot];
    }
})
//DBA/Bowler service idea found from researching https://gist.github.com/lykmapipo/6451623a54ef9b957a5c
.service('DBA', function($cordovaSQLite, $q, $ionicPlatform){
    //runquery to the db
    this.runQuery = function(query, parameters){
        //if no parameters object set it to empty array
        parameters = parameters || [];
        //$q angular object used to manage promises
        var q = $q.defer();
        //makes sure ionic is finished loading before making the db query
        $ionicPlatform.ready(function(){
            $cordovaSQLite.execute(db, query, parameters)
            .then(function(result){
                q.resolve(result);
            }, function(error){
                console.error(error);
                q.reject(error);
            });
        });
        //return the promise object
        return q.promise;
    }

    //convert sql rows to array
    this.getAll = function(res){
        var result = [];
        for(var i=0; i< res.rows.length; i++){
            result.push(res.rows.item(i));
        }
        return result;
    }

    //convert individual row to obj
    this.getIndiv = function(res){
        var result = null;
        result = angular.copy(res.rows.item(0));
        return result;
    }
})
.service('Bowler', function(DBA){
    function addShot(shotArray,gameid,frame,shot){      
        var parameters = [0,0,0,0,0,0,0,0,0,0];
        for(var i=0; i<shotArray.length; i++){
            parameters[shotArray[i]-1] = 1;
        }
        parameters.push(gameid, frame, shot);
        DBA.runQuery("INSERT INTO shot (pin1, pin2, pin3, pin4, pin5, pin6, pin7, pin8, pin9, pin10, gameid, frame, shot) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)", parameters);
    }

    //add game data (and eventually shot data) to db 
    this.addGame = function(bowlerid, gameObj){
        //get the last ID of the most recent game
         return this.getLastGameId()
         .then(function(gameid){
             gameid++;
             parameters = [bowlerid, gameid, gameObj[9].score];
             return DBA.runQuery("INSERT INTO game (bowlerid, gameid, score) VALUES(?,?,?)", parameters).then(function(result){
                 for(var i=0; i<gameObj.length; i++){
                     if(i<9){
                        addShot(gameObj[i].shot1, gameid, i+1, 1);
                        addShot(gameObj[i].shot2, gameid, i+1, 2);
                     }else{
                        addShot(gameObj[i].shot1, gameid, 10, 1);
                        if(gameObj[9].shot1.length != 10){
                            addShot(gameObj[i].shot2, gameid, 10, 2);
                        }else{
                            addShot(gameObj[i].bonus1, gameid, 10, 3);
                        }
                        if(gameObj[9].shot1.length+gameObj[9].shot2.length==10 || gameObj[9].shot1.length==10){
                            addShot(gameObj[i].bonus2, gameid, 10, 4);
                        }
                     }
                 }
                return gameid;
             });             
         });
    }

    this.addBowler = function(profileInfo){
        return this.getLastBowlerId()
        .then(function(bowlerid){
            if(profileInfo.imgurl=="")profileInfo.imgurl = "img/filler.png";
            bowlerid++;
            var parameters = [profileInfo.name, profileInfo.imgurl, profileInfo.hand, bowlerid];
            return DBA.runQuery("INSERT INTO bowler (name, img, hand, bowlerid) VALUES(?,?,?,?)",parameters).then(function(result){
                return bowlerid;
            });            
        });
    }


    //the rest of these functions are queries tot he DB based on different situations
    this.getLastBowlerId = function(){
        return DBA.runQuery("SELECT bowlerid FROM bowler")
        .then(function(result){
            var resArray = DBA.getAll(result);
            if(resArray.length){
                return resArray[resArray.length-1].bowlerid;
            }else return 0;            
        });
    }

    this.getLastGameId = function(){
        return DBA.runQuery("SELECT gameid FROM game")
        .then(function(result){
            var resArray = DBA.getAll(result);
            if(resArray.length){
                return resArray[resArray.length-1].gameid;
            }else return 0;  
        });
    }

    this.getAllBowlers = function(){
        return DBA.runQuery("SELECT * FROM bowler")
        .then(function(result){
            return DBA.getAll(result);
        });
    }

    this.getBowler = function(bowlerid){
        return DBA.runQuery("SELECT * FROM bowler WHERE bowlerid= (?)", [bowlerid])
        .then(function(result){
            return DBA.getIndiv(result);
        });
    }

    this.getGameInfo = function(gameid){
        return DBA.runQuery("SELECT * FROM shot WHERE gameid = (?)", [gameid])
        .then(function(gameInfo){
            var game = [
                {"frame":"1", "shot1":[], "shot2":[]},
                {"frame":"2", "shot1":[], "shot2":[]},
                {"frame":"3", "shot1":[], "shot2":[]},
                {"frame":"4", "shot1":[], "shot2":[]},
                {"frame":"5", "shot1":[], "shot2":[]},
                {"frame":"6", "shot1":[], "shot2":[]},
                {"frame":"7", "shot1":[], "shot2":[]},
                {"frame":"8", "shot1":[], "shot2":[]},
                {"frame":"9", "shot1":[], "shot2":[]},
                {"frame":"10", "shot1":[], "shot2":[], "bonus1":[], "bonus2":[]}        
            ];
            var shots = DBA.getAll(gameInfo);
            for(var i=0; i<shots.length; i++){
                var shot = [];
                if(shots[i].pin1==1)shot.push(1);
                if(shots[i].pin2==1)shot.push(2);
                if(shots[i].pin3==1)shot.push(3);
                if(shots[i].pin4==1)shot.push(4);
                if(shots[i].pin5==1)shot.push(5);
                if(shots[i].pin6==1)shot.push(6);
                if(shots[i].pin7==1)shot.push(7);
                if(shots[i].pin8==1)shot.push(8);
                if(shots[i].pin9==1)shot.push(9);
                if(shots[i].pin10==1)shot.push(10);
                if(shots[i].shot==1)game[shots[i].frame-1].shot1 = shot;
                if(shots[i].shot==2)game[shots[i].frame-1].shot2 = shot;
                if(shots[i].shot==3)game[shots[i].frame-1].bonus1 = shot;
                if(shots[i].shot==4)game[shots[i].frame-1].bonus2 = shot;                
            }
            return game;
        });
    }

    this.getGames = function(bowlerid){
        return DBA.runQuery("SELECT * FROM game WHERE bowlerid= (?)", [bowlerid])
        .then(function(result){
            return DBA.getAll(result);
        });
    }

    this.removeBowler = function(bowlerid){
        return DBA.runQuery("DELETE FROM bowler WHERE bowlerid = (?)", [bowlerid])
        .then(function(result){
            //need to delete shots in frames in games bowled by bowler -_-
            return DBA.runQuery("DELETE FROM game WHERE bowlerid = (?)", [bowlerid]).then(function(result){
                return true;
            });
        });
    }
});