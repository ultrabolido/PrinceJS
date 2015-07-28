PrinceJS.Tile.Button = function (game, element, modifier, type) {
    
    PrinceJS.Tile.Base.call(this, game, element, modifier, type);
    
    this.stepMax = (element == PrinceJS.Level.TILE_RAISE_BUTTON) ? 3 : 5;
    this.step = 0;
    
    this.onPushed = new Phaser.Signal();
    
    this.active = false;
    
};

PrinceJS.Tile.Button.prototype = Object.create(PrinceJS.Tile.Base.prototype);
PrinceJS.Tile.Button.prototype.constructor = PrinceJS.Tile.Button;

PrinceJS.Tile.Button.prototype.update = function() {
    
    if (this.active) {
        
        if (this.step == this.stepMax) {
            
            this.front.visible = true;
            this.back.frameName = this.key + '_' + this.element;
            this.active = false;

        }
        this.step++;
        
    }
};

PrinceJS.Tile.Button.prototype.push = function() {
  
    if (!this.active) {
        
        this.active = true;
        this.front.visible = false;
        this.back.frameName += '_down';
        this.onPushed.dispatch(this.modifier,this.element);
        
    }
    this.step = 0;
    
};
