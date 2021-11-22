import Level from './Level';
import Object from '../objects/Object';
import Torch from '../objects/Torch';
import Floor from '../objects/Floor';
import Gate from '../objects/Gate';
import Wall from '../objects/Wall';
import Loose from '../objects/Loose';
import Spikes from '../objects/Spikes';
import Button from '../objects/Button';
import Sword from '../objects/Sword';
import Potion from '../objects/Potion';
import ExitDoor from '../objects/ExitDoor';
import Chopper from '../objects/Chopper';
import Tapestry from '../objects/Tapestry';
import Balcony from '../objects/Balcony';
import { TILE } from '../Constants';

class LevelManager {

    constructor(scene) {
        this.scene = scene;
    
        this.height;
        this.width;
        this.type;
        
        this.layout = [];
        
        this.wallPattern = [];
        
        this.seed;
        
        this.level; 
    }

    create(json) {

        this.width = json.size.width;
        this.height = json.size.height;
        this.type = json.type;
        
        //this.game.world.setBounds(0, 0, PrinceJS.WORLD_WIDTH * this.width, PrinceJS.WORLD_HEIGHT * this.height);
        
        this.level = new Level(this.scene, json.number, json.name, this.type);
        
        for (var y=0; y < this.height; y++) 
        {
            
            this.layout[y] = [];
            
            for (var x=0; x < this.width; x++) 
            {
                
                var index = y*this.width + x
                var id = json.room[index].id;
                
                this.layout[y][x] = id;
                            
                if ( id != -1) {
                    
                    //if (this.type == LEVEL.PALACE) this.generateWallPattern(id);
                    
                    this.level.rooms[id] = {};
                    this.level.rooms[id].x = x;
                    this.level.rooms[id].y = y;
                    this.level.rooms[id].links = {};
                    this.level.rooms[id].tiles = [];
                    this.level.rooms[id].tiledef = json.room[index].tile;
                    
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
                        
                        var tile = new Object(this.scene, 0, 0, TILE.WALL, this.type);
                        tile.tileBack.setFrame(tile.key + '_wall_0');
                        tile.tileBack.setOrigin(0,0);
                        this.level.addTile(-1, jj, id, tile);
                    
                    }
                    
                }

                this.buildRoom(id);
                
                if (this.level.rooms[id].links.up == -1) {
                 
                    for (var ii=0; ii<10; ii++ ) {
                        
                        var tile = new Object(this.scene, 0, 0, TILE.FLOOR, this.type);
                        this.level.addTile(ii, -1, id, tile);
                        
                    }
                    
                }
                
            }
            
        }
        
        this.level.events = json.events;
        
        return this.level;
        
    }
    
    buildRoom(id) {
        
        //if (id == 1) console.log(this.level.rooms[id].tiles);
        for (var y=2; y >= 0; y--) 
        {
            
            for (var x=0; x < 10; x++) 
            {
                
                //console.log('Building tile ' + i + ' ' + j);
                var tile = this.buildTile( x, y, id );
                this.level.addTile(x, y, id, tile);
                
            }
            
        }
        
    }
    
    buildTile(x, y, id) {
        
        var t = this.level.rooms[id].tiledef[ y*10 + x ];

        var tile;
        
        switch (t.element) {
                
            case TILE.WALL:
                const tileLeft = (this.getTileAt(x - 1, y, id) == TILE.WALL) ? 'W':'S';
                const tileRight = (this.getTileAt(x + 1, y, id) == TILE.WALL) ? 'W':'S';
                tile = new Wall(this.scene, 0, 0, this.type, t.modifier, tileLeft, tileRight, x, y, id);
                break;
            
            case TILE.SPACE:
            case TILE.FLOOR:
                tile = new Floor(this.scene, 0, 0, t.element, this.type, t.modifier);
                break;
                
            case TILE.RAISE_BUTTON:
            case TILE.DROP_BUTTON:
                tile = new Button(this.scene, 0, 0, t.element, this.type, t.modifier);
                tile.on('pushed', this.level.fireEvent, this.level);
                this.level.addTrob(tile);
                break;
                
            case TILE.TORCH:
            case TILE.TORCH_WITH_DEBRIS:
                tile = new Torch(this.scene, 0, 0, t.element, this.type);
                this.level.addTrob(tile);
                break;
                
            case TILE.POTION:
                tile = new Potion(this.scene, 0, 0, this.type, t.modifier);
                this.level.addTrob(tile);
                break;
                
            case TILE.SWORD:
                tile = new Sword(this.scene, 0, 0, this.type);
                this.level.addTrob(tile);
                break;
            
            case TILE.EXIT_RIGHT:
                tile = new ExitDoor(this.scene, 0, 0, this.type);
                this.level.addTrob(tile);
                break;

            case TILE.CHOPPER:
                tile = new Chopper(this.scene, 0, 0, this.type);
                tile.on('chopped', this.level.activateChopper, this.level);
                this.level.addTrob(tile);
                break;
                
            case TILE.SPIKES:
                tile = new Spikes(this.scene, 0, 0, this.type, t.modifier);
                if (t.modifier == 0) this.level.addTrob(tile);
                break;
                
            case TILE.LOOSE_BOARD:
                tile = new Loose(this.scene, 0, 0, this.type);
                tile.on('startfalling', this.level.floorStartFall, this.level);
                tile.on('stopfalling', this.level.floorStopFall, this.level);
                this.level.addTrob(tile);
                break;
                
            case TILE.GATE:
                tile = new Gate(this.scene, 0, 0, this.type, t.modifier);
                this.level.addTrob(tile);
                break;
            
            case TILE.TAPESTRY:
            case TILE.TAPESTRY_TOP:
                const drawSmallLatice = this.getTileAt(x - 1, y, id) == TILE.LATTICE_SUPPORT;
                tile = new Tapestry(this.scene, 0, 0, t.element, this.type, t.modifier, drawSmallLatice);
                break;

            case TILE.BALCONY_RIGHT:
                tile = new Balcony(this.scene, 0, 0, this.type);
                break;
                
            default:
                tile = new Object(this.scene, 0, 0, t.element, this.type);
                break;
                
        }
        
        return tile;
        
    }
    
    getTileAt(x, y, id) {
        
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
            
            id = this.getRoomId(room.x, room.y - 1);
            y += 3;
            
        }
        if (y > 2) {
            
            id = this.getRoomId(room.x, room.y + 1);
            y -= 3;
            
        }
        
        if (id == -1) return TILE.WALL;
        
        return this.level.rooms[id].tiledef[x + y * 10].element;
        
    }
    
    getRoomId(x,y) {
     
        if ( ( x < 0 ) || ( x >= this.width ) || ( y < 0 ) || ( y >= this.height ) ) return -1;
        
        return this.layout[y][x];
    }

}

export default LevelManager;