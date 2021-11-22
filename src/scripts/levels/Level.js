import Floor from '../objects/Floor';
import Object from '../objects/Object';
import { TILE, LEVEL } from '../Constants';
import { ROOM_HEIGHT, ROOM_WIDTH, BLOCK_WIDTH, BLOCK_HEIGHT } from '../Config'

class Level {

    constructor(scene, number, name, type) {

        this.scene = scene;
    
        this.number = number;
        this.name = name;
        
        this.type = type;
        
        this.rooms = [];
        
        this.trobs = [];
        
        this.maskedTile = null;
        this.tiles = 0;
        
        this.dummyWall = new Object(this.scene, 0, 0, TILE.WALL, this.type);

    }
    
    addTile(x, y, room, tile) {
     
        //console.log('Adding tile: ' + x + ' ' + y + ' ' + room);
        
        if ( (x >= 0) && ( y >= 0 ) ) {
            
            this.rooms[room].tiles[y*10 + x] = tile;
            tile.roomX = x;
            tile.roomY = y;
            tile.room = room;
        }
        
        // -13? => real image height 79 - block height 63 = -16 for overlapping tiles + 3 for top screen offset
        
        tile.setX(this.rooms[room].x * ROOM_WIDTH + x * BLOCK_WIDTH);
        tile.setY(this.rooms[room].y * ROOM_HEIGHT + y * BLOCK_HEIGHT - 13);
        //tile.setDepth(this.tiles++);
        
        //this.back.add(tile.back);
        //this.front.add(tile.front);
        
    }

    getRoomBounds(room) {

        return new Phaser.Geom.Rectangle(this.rooms[room].x * ROOM_WIDTH, this.rooms[room].y * ROOM_HEIGHT, ROOM_WIDTH, ROOM_HEIGHT);

    }
    
    addTrob(trob) {
        
        this.trobs.push( trob );
        
    }
    
    update() {
        
        this.trobs.forEach( o => { o.update() });
        
    }
    
    removeObject(x,y,room) {
        
        var tile = this.getTileAt(x,y,room);
        tile.removeObject();
        
        var idx = this.trobs.indexOf(tile);
        this.trobs.splice(idx, 1);
        
    }
    
    getTileAt(x, y, room) {
        
        var newRoom = room;
        
        if (x < 0) {
            
            newRoom = this.rooms[room].links.left;
            x += 10;
            
        }
        if (x > 9) {
         
            newRoom = this.rooms[room].links.right;
            x -= 10;
            
        }
        if (y < 0) {
            
            newRoom = this.rooms[room].links.up;
            y += 3;
            
        }
        if (y > 2) {
            
            newRoom = this.rooms[room].links.down;
            y -= 3;
            
        }
        
        if (newRoom == -1) return this.dummyWall;
        
        return this.rooms[newRoom].tiles[x + y * 10];
        
    }
    
    shakeFloor(y, room) {   
        
        for (var x=0; x<10; x++)
        {
            
            var tile = this.getTileAt(x,y,room);
            
            if (tile.tileType == TILE.LOOSE_BOARD) {
                
                tile.shake(false);
                
            }
  
        }
        
    }
    
    unMaskTile() {
     
        if (this.maskedTile != null) {
         
            console.log('Unmask tile!!!');
            this.maskedTile.toggleMask();
            this.maskedTile = null;
            
        }
        
    }
    
    maskTile(x,y,room) {
        
        var tile = this.getTileAt(x,y,room);
        
        
        
        if (this.maskedTile == tile) return;
        if (this.maskedTile != null) { this.unMaskTile(); }
        
        if ( tile.isWalkable() )
        {
            console.log('masking tile ' + x + ' ' + y + ' ' + room);
            this.maskedTile = tile;
            tile.toggleMask();
            //console.log('masked!');
            
        }
        
    }
    
    floorStartFall(tile) {
        
        // Remove floor from room and set space tile                
        var space = new Floor(this.scene, 0, 0, TILE.SPACE, tile.levelType, 0);
        if ( space.levelType == LEVEL.PALACE ) {
         
            space.tileBack.setFrame(space.key + '_0_1').setOrigin(0,0);
            
        }
        this.addTile(tile.roomX, tile.roomY, tile.room, space);
        
        // Calculate stop level
        while (this.getTileAt(tile.roomX,tile.roomY,tile.room).tileType == TILE.SPACE)
        {
            tile.roomY++;
            if (tile.roomY == 3) {
                
                tile.roomY = 0;
                tile.room = this.rooms[tile.room].links.down;
                
            }
            
            tile.yTo += BLOCK_HEIGHT;
            
        }
        
    }
    
    floorStopFall(tile) {
     
        tile.destroy();
        
        var floor = this.getTileAt(tile.roomX, tile.roomY, tile.room);
        
        if (floor.tileType == TILE.TORCH) {
            
            floor.tileType = TILE.TORCH_WITH_DEBRIS;
        
        } else {
            
            floor.tileType = TILE.DEBRIS;
            
        }
        
        floor.tileBack.setFrame(floor.key + '_' + floor.tileType).setOrigin(0,0);
        floor.tileFront.setFrame(floor.key + '_' + floor.tileType + '_fg').setOrigin(0,0);
            
    }
    
    fireEvent(event, type) {
      
        var room = this.events[event].room;
        var x = ( this.events[event].location - 1 ) % 10;
        var y = Math.floor( (this.events[event].location - 1) / 10);
        
        console.log('Fire ' + event + ' - ' + room + ' ' + x + ' ' + y);
        
        var tile = this.getTileAt(x, y, room);
        
        if ( tile.tileType == TILE.EXIT_LEFT ) { 
            
            tile = this.getTileAt(x + 1, y, room);
        
        }
                
        if (type == TILE.RAISE_BUTTON) {
            
            tile.raise();
            
        } else {
            
            tile.drop();
            
        }
        
        if (this.events[event].next)
        {
            this.fireEvent(event + 1, type);
        }
        
    }
    
    activateChopper(x,y,room) {
      
        var tile;
        
        do {
            
            tile = this.getTileAt(++x, y, room);
            
        } while ( ( x < 9 ) && ( tile.tileType != TILE.CHOPPER ) )

        if (tile.tileType == TILE.CHOPPER) { 
              
            tile.chop();
                
        }
        
    }
    
    
}

export default Level;