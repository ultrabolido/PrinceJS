PrinceJS.LevelBuilder = function (game) {
  
    this.game = game;
    
    this.height;
    this.width;
    this.type;
    
    this.layout = [];
    
    this.wallColor = [ '#D8A858', '#E0A45C', '#E0A860', '#D8A054', '#E0A45C', '#D8A458', '#E0A858', '#D8A860' ];
    this.wallPattern = [];
    
    this.seed;
    
    this.level; 
    
};

PrinceJS.LevelBuilder.prototype = {
    
    buildFromJSON: function (json) {
        
        this.width = json.size.width;
        this.height = json.size.height;
        this.type = json.type;
        
        this.game.world.setBounds(0, 0, PrinceJS.WORLD_WIDTH * this.width, PrinceJS.WORLD_HEIGHT * this.height);
        
        this.level = new PrinceJS.Level(this.game, json.number, json.name, this.type);
        
        for (var y=0; y < this.height; y++) 
        {
            
            this.layout[y] = [];
            
            for (var x=0; x < this.width; x++) 
            {
                
                var index = y*this.width + x
                var id = json.room[index].id;
                
                this.layout[y][x] = id;
                            
                if ( id != -1) {
                    
                    if (this.type == PrinceJS.Level.TYPE_PALACE) this.generateWallPattern(id);
                    
                    this.level.rooms[id] = {};
                    this.level.rooms[id].x = x;
                    this.level.rooms[id].y = y;
                    this.level.rooms[id].links = {};
                    this.level.rooms[id].tiles = json.room[index].tile;
                    
                }
                
            }
            
        }
        
        for (var y = this.height - 1; y >= 0; y--) 
        {
            
            for (var x=0; x < this.width; x++) 
            {
                
                var id = this.layout[y][x];
                            
                if ( id == -1) continue;
                    
                this.level.rooms[id].links.left = this.getRoomId(x - 1, y);
                this.level.rooms[id].links.right = this.getRoomId(x + 1, y);
                this.level.rooms[id].links.up = this.getRoomId(x, y - 1);
                this.level.rooms[id].links.down = this.getRoomId(x, y + 1);
                
                if (this.level.rooms[id].links.left == -1) {
                 
                    for (var jj=2; jj>=0; jj-- ) {
                        
                        var tile = new PrinceJS.Tile.Base(this.game, PrinceJS.Level.TILE_WALL, 0, this.type);
                        tile.back.frameName = tile.key + '_wall_0';
                        this.level.addTile(-1, jj, id, tile);
                    
                    }
                    
                }

                this.buildRoom(id);
                
                if (this.level.rooms[id].links.up == -1) {
                 
                    for (var ii=0; ii<10; ii++ ) {
                        
                        var tile = new PrinceJS.Tile.Base(this.game, PrinceJS.Level.TILE_FLOOR, 0, this.type);
                        this.level.addTile(ii, -1, id, tile);
                        
                    }
                    
                }
                
            }
            
        }
        
        this.level.events = json.events;
        
        return this.level;
        
    },
    
    buildRoom: function(id) {
        
        for (var y=2; y >= 0; y--) 
        {
            
            for (var x=0; x < 10; x++) 
            {
                
                //console.log('Building tile ' + i + ' ' + j);
                var tile = this.buildTile( x, y, id );
                this.level.addTile(x, y, id, tile);
                
            }
            
        }
        
    },
    
    buildTile: function(x, y, id) {
        
        //console.log('build Tile: ' + i + ' ' + j + ' ' + room);
        //console.log(this.rooms[room]);
        var tileNumber = y*10 + x;
        var t = this.level.rooms[id].tiles[ tileNumber ];
            
        var tile;
        
        //console.log(t);
        
        switch (t.element) {
                
            case PrinceJS.Level.TILE_WALL:
                tile = new PrinceJS.Tile.Base(this.game, t.element, t.modifier, this.type);
                
                var tileSeed = tileNumber + id;
                var wallType = '';

                if (this.getTileAt(x - 1, y, id) == PrinceJS.Level.TILE_WALL) { wallType = "W"; }
                else { wallType = "S"; }

                wallType += "W";

                if (this.getTileAt(x + 1, y, id) == PrinceJS.Level.TILE_WALL) { wallType += "W"; }
                else { wallType += "S"; }

                if ( this.type == PrinceJS.Level.TYPE_DUNGEON ) {

                    tile.front.frameName = wallType + '_' + tileSeed;

                } else {

                    var bmd = this.game.make.bitmapData(60,79);

                    bmd.rect(0,16,32,20, this.wallColor[ this.wallPattern[id][ y*44 + 0*11 + x ]]);
                    bmd.rect(0,36,16,21, this.wallColor[ this.wallPattern[id][ y*44 + 1*11 + x ]]);
                    bmd.rect(16,36,16,21, this.wallColor[ this.wallPattern[id][ y*44 + 1*11 + x + 1 ]]);
                    bmd.rect(0,57,8,19, this.wallColor[ this.wallPattern[id][ y*44 + 2*11 + x ]]);
                    bmd.rect(8,57,24,19, this.wallColor[ this.wallPattern[id][ y*44 + 2*11 + x + 1 ]]);
                    bmd.rect(0,76,32,3, this.wallColor[ this.wallPattern[id][ y*44 + 3*11 + x ]]);
                    bmd.add(tile.front);

                    var tileChild = this.game.make.sprite(0,16,tile.key, 'W_' + tileSeed);
                    tile.front.addChild(tileChild);

                }

                if ( wallType.charAt(2)  == 'S' ) {

                    tile.back.frameName = tile.key + '_wall_' + t.modifier;

                }
                break;
            
            case PrinceJS.Level.TILE_SPACE:
            case PrinceJS.Level.TILE_FLOOR:
                tile = new PrinceJS.Tile.Base(this.game, t.element, t.modifier, this.type);
                var tileChild = this.game.make.sprite(0,0,tile.key, tile.key + '_' + t.element + '_' + t.modifier);
                tile.back.addChild(tileChild);
                break;
                
            case PrinceJS.Level.TILE_RAISE_BUTTON:
            case PrinceJS.Level.TILE_DROP_BUTTON:
                tile = new PrinceJS.Tile.Button(this.game, t.element, t.modifier, this.type);
                tile.onPushed.add(this.level.fireEvent, this.level);
                this.level.addTrob(tile);
                break;
                
            case PrinceJS.Level.TILE_TORCH:
            case PrinceJS.Level.TILE_TORCH_WITH_DEBRIS:
                tile = new PrinceJS.Tile.Torch(this.game, t.element, t.modifier, this.type);
                this.level.addTrob(tile);
                break;
                
            case PrinceJS.Level.TILE_POTION:
                tile = new PrinceJS.Tile.Potion(this.game, t.modifier, this.type);
                this.level.addTrob(tile);
                break;
                
            case PrinceJS.Level.TILE_SWORD:
                tile = new PrinceJS.Tile.Sword(this.game, t.modifier, this.type);
                this.level.addTrob(tile);
                break;
                
            case PrinceJS.Level.TILE_EXIT_RIGHT:
                tile = new PrinceJS.Tile.ExitDoor(this.game, t.modifier, this.type);
                this.level.addTrob(tile);
                break;
                
            case PrinceJS.Level.TILE_CHOPPER:
                tile = new PrinceJS.Tile.Chopper(this.game, t.modifier, this.type);
                tile.onChopped.add(this.level.activateChopper, this.level);
                this.level.addTrob(tile);
                break;
                
            case PrinceJS.Level.TILE_SPIKES:
                tile = new PrinceJS.Tile.Spikes(this.game, t.modifier, this.type);
                if (t.modifier == 0) this.level.addTrob(tile);
                break;
                
            case PrinceJS.Level.TILE_LOOSE_BOARD:
                tile = new PrinceJS.Tile.Loose(this.game, t.modifier, this.type);
                tile.onStartFalling.add(this.level.floorStartFall,this.level);
                tile.onStopFalling.add(this.level.floorStopFall,this.level);
                this.level.addTrob(tile);
                break;
                
            case PrinceJS.Level.TILE_GATE:
                tile = new PrinceJS.Tile.Gate(this.game, t.modifier, this.type);
                this.level.addTrob(tile);
                break;
                
            case PrinceJS.Level.TILE_TAPESTRY:
                tile = new PrinceJS.Tile.Base(this.game, t.element, t.modifier, this.type);
                if ( ( this.type == PrinceJS.Level.TYPE_PALACE ) && ( t.modifier > 0 ) ) {

                    tile.back.frameName = tile.key + '_' + t.element + '_' + t.modifier;
                    tile.front.frameName = tile.back.frameName + '_fg';

                }
                break;

            case PrinceJS.Level.TILE_TAPESTRY_TOP:
                tile = new PrinceJS.Tile.Base(this.game, t.element, t.modifier, this.type);
                if ( ( this.type == PrinceJS.Level.TYPE_PALACE ) && ( t.modifier > 0 ) ) {

                    tile.back.frameName = tile.key + '_' + t.element + '_' + t.modifier;
                    tile.front.frameName = tile.back.frameName + '_fg';

                    if ( this.getTileAt(x - 1, y, id) == PrinceJS.Level.TILE_LATTICE_SUPPORT ) {

                        var tileChild = this.game.make.sprite(0,0,tile.key, tile.key + '_' + PrinceJS.Level.TILE_SMALL_LATTICE + '_fg');
                        tile.back.addChild(tileChild);

                    }

                }
                break;

            case PrinceJS.Level.TILE_BALCONY_RIGHT:
                tile = new PrinceJS.Tile.Base(this.game, t.element, t.modifier, this.type);
                var tileChild = this.game.make.sprite(0,-4,tile.key, tile.key + '_balcony');
                tile.back.addChild(tileChild);
                break;
                
            default:
                tile = new PrinceJS.Tile.Base(this.game, t.element, t.modifier, this.type);
                break;
                
        }
        
        return tile;
        
    },
    
    getTileAt: function (x, y, id) {
        
        var room = this.level.rooms[id];
        
        if (x < 0) {
            
            id = this.getRoomId(room.x - 1, room.y);
            x += 10;
            
        }
        if (x > 9) {
         
            id = this.getRoomId(room.x + 1, room.y);
            x -= 10;
            
        }
        if (y < 0) {
            
            room = this.getRoomId(room.x, room.y - 1);
            y += 3;
            
        }
        if (y > 2) {
            
            room = this.getRoomId(room.x, room.y + 1);
            y -= 3;
            
        }
        
        if (id == -1) return PrinceJS.Level.TILE_WALL;
        
        return this.level.rooms[id].tiles[x + y * 10].element;
        
    },
    
    getRoomId: function(x,y) {
     
        if ( ( x < 0 ) || ( x >= this.width ) || ( y < 0 ) || ( y >= this.height ) ) return -1;
        
        return this.layout[y][x];
    },
    
    generateWallPattern: function(room) {
    
        this.wallPattern[room] = [];
        this.seed = room;
        
        this.prandom(1);
        for (var row = 0; row < 3; row++) {
            
            for (var subrow = 0; subrow < 4; subrow++) {
                
                var colorBase = (subrow % 2) ? 0 : 4;                
                var prevColor = -1;
                
                for (var col = 0; col <= 10; ++col) {
                    
                    var color;
                    
                    do {
                        color = colorBase + this.prandom(3);
                    } while (color == prevColor);
                    
                    this.wallPattern[room][44 * row + 11 * subrow + col] = color;
                    //console.log('color: ' + color);
                    prevColor = color;
                    
                }
            }
	   }
          
    },
    
    prandom: function(max) {
        
        this.seed = ((this.seed * 214013 + 2531011) & 0xFFFFFFFF) >>> 0;
        return ( this.seed >>> 16 ) % ( max + 1 );
        
    }
                
};

PrinceJS.LevelBuilder.prototype.constructor = PrinceJS.LevelBuilder;