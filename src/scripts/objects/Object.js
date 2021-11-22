import { LEVEL, TILE } from '../Constants';

class Object extends Phaser.GameObjects.Group {

    constructor(scene, x, y, tileType, levelType) {
        super(scene);

        this.scene = scene;
        this.tileType = tileType;
        this.levelType = levelType;
        this.key = (levelType == LEVEL.DUNGEON) ? 'dungeon' : 'palace';

        this.tileBack = scene.add.sprite(x, y, this.key, this.key + '_' + tileType).setOrigin(0,0);
        this.tileFront = scene.add.sprite(x, y, this.key, this.key + '_' + tileType + '_fg').setOrigin(0,0);

        this.scene.backLayer.add(this.tileBack);
        this.scene.frontLayer.add(this.tileFront);

        this.room;
        this.roomX;
        this.roomY;

        this.maskFrame = null;

    }

    setXY(x,y) {
        this.setX(x);
        this.setY(y);
    }

    setX(x) {
        this.tileBack.setX(x);
        this.tileFront.setX(x);
    }

    setY(y) {
        this.tileBack.setY(y);
        this.tileFront.setY(y);
    }

    setDepth(z) {
        this.tileBack.setDepth(z);
        this.tileFront.setDepth(z);
    }

    setRoom(r) {
        this.room = r;
    }

    setRoomX(x) {
        this.roomX = x;
    }

    setRoomY(y) {
        this.roomY = y;
    }
    
    toggleMask() {
     
        if (this.maskFrame != null) {
            
            this.unMask();
            
        } else {
            
            this.mask();
            
        }
        
    }

    mask() {
        this.maskFrame = this.tileFront.frame.name;
        this.tileFront.setFrame(this.tileBack.frame.name).setOrigin(0,0);
        this.tileFront.setCrop(0,0,33,this.tileFront.height);
    }

    unMask() {
        this.tileFront.setFrame(this.maskFrame).setOrigin(0,0);
        this.tileFront.setCrop();
        this.maskFrame = null;
    }
    
    isWalkable() {
     
        return (this.tileType != TILE.WALL) && (this.tileType != TILE.SPACE) && 
               (this.tileType != TILE.TOP_BIG_PILLAR) && (this.tileType != TILE.TAPESTRY_TOP) && 
               (this.tileType != TILE.LATTICE_SUPPORT) && (this.tileType != TILE.SMALL_LATTICE) && 
               (this.tileType != TILE.LATTICE_LEFT) && (this.tileType != TILE.LATTICE_RIGHT);
        
    }
    
    isSpace() {
      
        return (this.tileType == TILE.SPACE) || (this.tileType == TILE.TOP_BIG_PILLAR) ||
               (this.tileType == TILE.TAPESTRY_TOP) || (this.tileType == TILE.LATTICE_SUPPORT) ||
               (this.tileType == TILE.SMALL_LATTICE) || (this.tileType == TILE.LATTICE_LEFT) ||
               (this.tileType == TILE.LATTICE_RIGHT);
        
    }
    
    isBarrier() {
     
        return (this.tileType == TILE.WALL) || (this.tileType == TILE.GATE) || 
               (this.tileType == TILE.TAPESTRY) || (this.tileType == TILE.TAPESTRY_TOP);
                
    }
    
    isExitDoor() {
      
        return (this.tileType == TILE.EXIT_LEFT) || (this.tileType == TILE.EXIT_RIGHT);
        
    }

    isButton() {
        return (this.tileType == TILE.DROP_BUTTON) || (this.tileType == TILE.RAISE_BUTTON);
    }
    
    destroy() {
        
        this.tileBack.destroy();
        this.tileFront.destroy();
        
    }
    
    getBounds() {
  
        var bounds = new Phaser.Geom.Rectangle(0,0,0,0);

        bounds.height = 63;
        bounds.width = 4;
        bounds.x = this.roomX * 32 + 40;
        bounds.y = this.roomY * 63;

        return bounds;
    
    }

    removeObject() {
    
        if ((this.tileType !== TILE.POTION) && (this.tileType !== TILE.SWORD)) return;
        if (this.tileType == TILE.POTION) this.potion.destroy();

        this.tileType = TILE.FLOOR;
        this.tileFront.setFrame(this.key + '_' + this.tileType + '_fg').setOrigin(0,0);
        this.tileBack.setFrame(this.key + '_' + this.tileType).setOrigin(0,0);

        this.floor = this.scene.add.sprite(this.tileFront.x, this.tileFront.y, this.key, this.key + '_' + this.tileType + '_0').setOrigin(0,0);
        this.scene.backLayer.add(this.floor);
        
    }
    
}

export default Object;