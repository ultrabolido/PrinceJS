import { Scene } from 'phaser';
import { SKIP_TITLE } from '../Config';

const WALL_COLOR = [ '#D8A858', '#E0A45C', '#E0A860', '#D8A054', '#E0A45C', '#D8A458', '#E0A858', '#D8A860' ];

class PreloadScene extends Scene {

    constructor() {
        super("PreloadScene");
    }

	preload () {

        this.add.bitmapText(this.scale.width * 0.5, this.scale.height * 0.5, 'font','Loading. . . .',16).setOrigin(0.5,0.5);

        // graphics
        this.load.atlas('kid','assets/gfx/kid.png','assets/gfx/kid.json');
        this.load.atlas('princess','assets/gfx/princess.png','assets/gfx/princess.json');
        this.load.atlas('vizier','assets/gfx/vizier.png','assets/gfx/vizier.json');
        this.load.atlas('mouse','assets/gfx/mouse.png','assets/gfx/mouse.json');
        this.load.atlas('guard','assets/gfx/guard.png','assets/gfx/guard.json');
        this.load.atlas('fatguard','assets/gfx/fatguard.png','assets/gfx/fatguard.json');
        this.load.atlas('jaffar','assets/gfx/jaffar.png','assets/gfx/jaffar.json');
        this.load.atlas('skeleton','assets/gfx/skeleton.png','assets/gfx/skeleton.json');
        this.load.atlas('shadow','assets/gfx/shadow.png','assets/gfx/shadow.json');
        this.load.atlas('dungeon','assets/gfx/dungeon.png','assets/gfx/dungeon.json');
        this.load.atlas('palace','assets/gfx/palace.png','assets/gfx/palace.json');
        this.load.atlas('general','assets/gfx/general.png','assets/gfx/general.json');
        this.load.atlas('title','assets/gfx/title.png','assets/gfx/title.json');
        this.load.atlas('cutscene','assets/gfx/cutscene.png','assets/gfx/cutscene.json');

        // animations
        this.load.json('kid-anims','assets/anims/kid.json');
        this.load.json('sword-anims','assets/anims/sword.json');
        this.load.json('fighter-anims','assets/anims/fighter.json');
        this.load.json('princess-anims','assets/anims/princess.json');
        this.load.json('vizier-anims','assets/anims/vizier.json');
        this.load.json('mouse-anims','assets/anims/mouse.json');

        // audio
        this.load.audioSprite('sounds', 'assets/audio/sounds.json','assets/audio/sounds.ogg');
        this.load.audioSprite('music', 'assets/audio/music.json','assets/audio/music.ogg');

        // levels
        for ( var i=0; i<16; i++) {
            this.load.json('level' + i,'assets/maps/level' + i + '.json');
        }

        // cutscenes
        [1,2,4,6,8,9,12,15,16].forEach( i => {
            this.load.json('cutscene' + i,'assets/cutscenes/scene' + i + '.json');
        })
        

	}

	create() {

        this.wallPattern = [];
        this.seed;

        // Generate wallpaper textures for PALACE
        for (var room=1; room <25; room++ ) {

            this.generateWallPattern(room);

            var ct = this.textures.createCanvas('wp_room_' + room, 60 * 10, 79 * 3);

            for (var row=0; row < 3; row++) {
                for (var col=0; col < 10; col++) {

                    ct.context.fillStyle = this.getWallPatternColor(room, row, 0, col);
                    ct.context.fillRect(col*60, row*79 + 16, 32, 20);
                    ct.context.fillStyle = this.getWallPatternColor(room, row, 1, col);
                    ct.context.fillRect(col*60, row*79 + 36, 16, 21);
                    ct.context.fillStyle = this.getWallPatternColor(room, row, 1, col + 1);
                    ct.context.fillRect(col*60 + 16, row*79 + 36, 16, 21);
                    ct.context.fillStyle = this.getWallPatternColor(room, row, 2, col);
                    ct.context.fillRect(col*60, row*79 + 57, 8, 19);
                    ct.context.fillStyle = this.getWallPatternColor(room, row, 2, col + 1);
                    ct.context.fillRect(col*60 + 8, row*79 + 57, 24, 19);
                    ct.context.fillStyle = this.getWallPatternColor(room, row, 3, col);
                    ct.context.fillRect(col*60, row*79 + 76, 32, 3);
                    ct.add('wall_' + col + '_' + row, 0, col*60, row*79, 60, 79);

                }
            }

            ct.refresh();

        }

		if (SKIP_TITLE) {
            
            this.scene.start('CutScene');
            
        } else {
            
            this.scene.start('TitleScene');
        
        }
        
	}

    getWallPatternColor(room, row, subrow, col) {
    
        return WALL_COLOR[ this.wallPattern[ room ][ row * 44 + subrow * 11 + col ] ];

    }

    generateWallPattern(room) {
        
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
                    prevColor = color;
                    
                }
            }
       }
    }

    prandom(max) {
        
        this.seed = ((this.seed * 214013 + 2531011) & 0xFFFFFFFF) >>> 0;
        return ( this.seed >>> 16 ) % ( max + 1 );
        
    }

}

export default PreloadScene;
