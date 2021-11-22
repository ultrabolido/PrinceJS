var PrinceJS = {};

PrinceJS.Conversor = function (game) {
   


};

PrinceJS.Conversor.prototype = {

	preload: function () {
       
        this.load.json('level15','assets/maps/original/level15.json');
        
        
    },
       
    create: function () {
        
        this.convertLevel(15);        
           
	},
    
    convertLevel: function(num) {
    
        var dim = [ { width: 5, height: 9 }, { width: 9, height: 3 }, { width: 13, height: 4 }, { width: 9, height: 5 }, { width: 12, height: 3 }, { width: 10, height: 5 }, { width: 8, height: 3 }, { width: 9, height: 4 }, { width: 11, height: 4 }, { width: 8, height: 4 }, { width: 9, height: 3 }, { width: 10, height: 4 }, { width: 6, height: 7 }, { width: 5, height: 3 }, { width: 6, height: 1 }, { width: 4, height: 2 }   ];
        var type = [ 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0];
        var enemies = [ 'guard', 'guard', 'guard', '', 'guard', 'guard', 'fatguard', 'guard', 'guard', 'guard', 'guard', 'guard', '','jaffar', '', '' ];  
        var name = [ 'Demo', 'Cell', 'Guards', 'Skeleton', 'Mirror', 'Thief', 'Plunge', 'Weightless', 'Mouse', 'Twisty', 'Quad', 'Fragile', 'Tower', 'Jaffar', 'Rescue', 'Potions'];
        var layout = [
                      [ -1, 24,  4,  2,  1,
                        23,  8,  6,  5,  7,
                        22,  9, -1, -1, -1,
                        21, 10, -1, -1, -1,
                        20, 11, -1, -1, -1,
                        19, 12, -1, -1, -1,
                        18, 13, -1, -1, -1,
                        17, 14, -1, -1, -1,
                        16, 15, -1, -1, -1 ],
            
                      [ 22, 16, 23, 17, 21,  5,  1, -1, -1, 
                       15, 12, 20,  7,  8,  6,  2,  3,  9, 
                       10, 19,  4, 14, 11, -1, -1, -1, -1 ],
                      
                      [ 9, 23, 24, 20, 12,  8, -1, -1, -1, -1, -1, -1, -1,
                        2, 21, 19, 16, 15, 13,  7, 18, 11, 22,  3, -1, -1,
                       -1, 14, -1, -1, 17, -1, -1, -1, -1,  1,  6,  4,  5,
                       -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 10, -1 ],
                     
                      [ -1, -1, -1, -1, -1, -1, -1, 15, 16,
                         5,  1,  2,  7, 10, 11, 14, 18, -1,
                         6,  3,  4, 22,  9, 12, 13, 17, -1,
                        -1, 20, 21, -1, -1, -1, -1, -1, -1,
                        -1,  8, 19, -1, -1, -1, -1, -1, -1 ],
                     
                      [ 23, 16,  9,  8,  1,  2,  5,  6, 24,  7,  4, 11,
                        -1, 17, 18, 10,  3, 22, 21, -1, 15, 14, 12, 13,
                        -1, 19, -1, -1, -1, -1, -1, -1, -1, -1, -1, 20 ],
                     
                      [ -1, -1, -1, -1, -1, -1, 14, -1, -1, -1,
                        -1, -1, -1, -1, -1, -1, 13, 10, 11, 24,
                        23, 18, 15, 16,  2, 12,  8,  7,  9, -1,
                        -1, -1, 17, 20,  4, -1, -1, -1, 21, -1,
                        -1, -1, -1, 22, -1, -1, -1, -1, -1, -1 ],
                     
                       [  5,  1, 18,  6, 15,  2, 24, 10,
                         -1,  3,  9,  7, 23, -1, -1, 12,
                         -1, -1, -1, 11, -1, -1, -1, -1 ],
                     
                       [ -1, 17, -1, -1, 23, 22, 24, -1, -1,
                         16,  1,  2,  7,  9, 10, 12, 19, 14,
                         -1,  3,  4,  6,  8, 11, 13, 20, 15,
                         -1, -1, -1, -1,  5, 18, -1, -1, 21 ],
                     
                       [  7,  5,  1,  2, -1, -1, 14, 21, 20, -1, 17,
                          8,  6,  3,  4, 16, 12, 13, 22, 23, 24, 18,
                         -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  9,
                         -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 10 ],
                     
                       [  6, 10, 22, 19, 17, 18, -1, -1,
                          7, 24, 21,  3,  8, 12, 16, 20,
                         -1,  1, 23,  2,  5, 13, 15, -1,
                         -1, -1, -1,  4,  9, 11, 14, -1 ],
                     
                       [ -1, 12, 11, -1, 13, 18, 19, 16, 17,
                          9,  8,  5,  1,  2,  7, 10, 14, 15,
                         -1, -1, -1,  3,  4, 20, -1, -1, -1 ],
                     
                       [ 12,  9,  8, 14,  7, -1, 20, -1, -1, -1,
                         17,  6,  1, 15,  2, 19, 22, 24, 16, 13,
                         -1, 10,  3, -1,  4, 21, -1,  5, 11, -1,
                         -1, -1, 23, -1, -1, -1, -1, -1, -1, -1 ],
                     
                       [ -1, 16, 10, 22,  5, -1,
                         23, 13,  2, 15, 20, -1,
                         -1, 11, 21, 18, 19, -1,
                         -1, 17, -1,  6, 12, 14,
                         -1, -1, -1,  7,  8, 24,
                         -1, -1, -1,  1,  9, -1,
                         -1, -1, -1,  3,  4, -1 ],
                     
                       [ -1,  3,  1, 17, 10,
                         24,  4, 16, 23, 13,
                         -1, -1, 11, -1,  2 ],
                     
                       [ 5, 1, 2, 3, 4, 6 ],
                     
                       [  6, 3, 4,  8,
                         -1, 5, 7, -1 ] ];
        
        var level = this.game.cache.getJSON('level' + num);
        
        var format = {};
        
        format.number = num;
        format.name = name[num];
        format.size = dim[num];
        format.type = type[num];
        format.room = [];
        format.guards = [];
        format.events = [];
        for (var j = 0; j < format.size.height; j++) {
            
            for (var i = 0; i < format.size.width; i++) {

                var number = j * format.size.width + i;
                format.room[number] = {};
                format.room[number].id = layout[num][number];
                
                if (layout[num][number] != -1) {
                
                    // copy tiles
                    
                    format.room[number].tile = [];
                    for (var l = 0; l < 30 ; l++ ) {
                        
                        format.room[number].tile[l] = {};
                        format.room[number].tile[l].element = parseInt(level.rooms[layout[num][number]-1].tile[l].element,10);
                        format.room[number].tile[l].modifier = parseInt(level.rooms[layout[num][number]-1].tile[l].modifier,10);
                        switch (format.room[number].tile[l].element & 0x1F)
                        {
                            
                            case PrinceJS.Level.TILE_WALL:
                                if (format.room[number].tile[l].modifier > 1) {
                                    format.room[number].tile[l].modifier = 0;
                                }
                                break;
                                
                            case PrinceJS.Level.TILE_SPACE:
                                if (format.room[number].tile[l].modifier == 255) {
                                    format.room[number].tile[l].modifier = 0;
                                }
                                break;
                                
                            case PrinceJS.Level.TILE_FLOOR:
                                if (format.room[number].tile[l].modifier == 3) {
                                    format.room[number].tile[l].modifier = 2;
                                    break;
                                }
                                if (format.room[number].tile[l].modifier == 255) {
                                    
                                    if (format.type == PrinceJS.Level.TYPE_DUNGEON) {
                                        
                                        format.room[number].tile[l].modifier = 0;
                                        
                                    } else {
                                        
                                        format.room[number].tile[l].modifier = 2;
                                        
                                    }
                                }
                                break;
                                
                            case PrinceJS.Level.TILE_LOOSE_BOARD:
                                // Put modifier 1 for stuck board loose (modifier bit m: rrmccccc) Pag. 11 pdf POP Spec File format
                                format.room[number].tile[l].modifier = (format.room[number].tile[l].element & 0x20) >> 5;
                                break;
                                
                            case PrinceJS.Level.TILE_GATE:
                                if (format.room[number].tile[l].modifier == 2) {
                                    format.room[number].tile[l].modifier = 0;
                                }
                                break;
                                
                            case PrinceJS.Level.TILE_DROP_BUTTON:
                            case PrinceJS.Level.TILE_RAISE_BUTTON:
                                var eventID = format.room[number].tile[l].modifier;
                                
                                if ( typeof format.events[eventID] === 'undefined')
                                {
                                    var next = 1;
                                    while (next)
                                    {
                                        format.events[eventID] = {};
                                        format.events[eventID].number = parseInt(level.events[eventID].number,10);
                                        format.events[eventID].room = parseInt(level.events[eventID].room,10);
                                        format.events[eventID].location = parseInt(level.events[eventID].location,10);
                                        next = format.events[eventID].next = parseInt(level.events[eventID].next,10);
                                        eventID++;
                                    }
                                }
                                break;
                        }
                        
                        format.room[number].tile[l].element &= 0x1F;
                        
                        
                    }
                    
                    // push guards if any
                    var guard = level.rooms[layout[num][number]-1].guard;
                    if (guard.location != 0) {
                        
                        var newGuard = {};
                        newGuard.room = format.room[number].id;
                        newGuard.location = parseInt(guard.location, 10);
                        newGuard.skill = parseInt(guard.skill, 10);
                        newGuard.colors = parseInt(guard.colors, 10);
                        newGuard.type = enemies[num];
                        if (guard.direction == 2) { newGuard.direction = 1; }
                        else { newGuard.direction = -1; }
                        
                        format.guards.push(newGuard);
                        
                    }
                }

            }
            
        }
        format.prince = {};
        format.prince.location = parseInt(level.prince.location,10);
        format.prince.room = parseInt(level.prince.room,10);
        if (level.prince.direction == 2) { format.prince.direction = 1; }
        else { format.prince.direction = -1; }
        
        console.log(JSON.stringify(format));
        
    },
    
    update: function () {

        

	}

};
