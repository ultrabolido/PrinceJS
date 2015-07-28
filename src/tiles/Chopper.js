PrinceJS.Tile.Chopper = function (game, modifier, type) {
    
    PrinceJS.Tile.Base.call(this, game, PrinceJS.Level.TILE_CHOPPER, modifier, type);
    
    this.tileChildBack = this.game.make.sprite(0,0,this.key,this.key + '_chopper_5');
    this.back.addChild(this.tileChildBack);
    
    this.tileChildFront = this.game.make.sprite(0,0,this.key,this.key + '_chopper_5_fg');
    this.front.addChild(this.tileChildFront);
    
    this.step = 0;
    
    this.onChopped = new Phaser.Signal();
    
    this.active = false;
    
};

PrinceJS.Tile.Chopper.prototype = Object.create(PrinceJS.Tile.Base.prototype);
PrinceJS.Tile.Chopper.prototype.constructor = PrinceJS.Tile.Chopper;

PrinceJS.Tile.Chopper.prototype.update = function() {
    
    if (this.active) {
        
        this.step++;
        if (this.step > 14) {

            this.step = 0;
            this.active = false;

        } else {

            if (this.step < 6) {

                this.tileChildBack.frameName = this.key + '_chopper_' + this.step;
                this.tileChildFront.frameName = this.key + '_chopper_' + this.step + '_fg';

                if (this.step == 3) this.onChopped.dispatch(this.roomX, this.roomY, this.room);

            }

        }
        
    }
    
};

PrinceJS.Tile.Chopper.prototype.chop = function() {
  
    this.active = true;
    
};