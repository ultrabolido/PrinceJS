PrinceJS.Tile.Potion = function (game, modifier, type) {
    
    PrinceJS.Tile.Base.call(this, game, PrinceJS.Level.TILE_POTION, modifier, type);
    
    var yy = 53;
    if ((modifier > 1) && (modifier < 5)) yy -= 4;
    
    this.tileChild = this.game.make.sprite(25, yy, 'general');
    this.front.frameName += '_' + modifier;
    this.front.addChild(this.tileChild);
    
    this.step = this.game.rnd.between(0,6);
    
    this.color = PrinceJS.Tile.Potion.bubbleColors[Math.floor(modifier / 2)];
    
};

PrinceJS.Tile.Potion.frames = Phaser.Animation.generateFrameNames('bubble_', 1, 7, '', 1);
PrinceJS.Tile.Potion.bubbleColors = [ 'red', 'green', 'blue' ];

PrinceJS.Tile.Potion.prototype = Object.create(PrinceJS.Tile.Base.prototype);
PrinceJS.Tile.Potion.prototype.constructor = PrinceJS.Tile.Potion;

PrinceJS.Tile.Potion.prototype.update = function() {
    
    this.tileChild.frameName = PrinceJS.Tile.Potion.frames[this.step] + '_' + this.color;
    this.step = (this.step + 1) % PrinceJS.Tile.Potion.frames.length;
    
};

PrinceJS.Tile.Potion.prototype.removeObject = function() {
    
    this.tileChild.destroy();
    this.element = PrinceJS.Level.TILE_FLOOR;
    this.modifier = 0;
    
    this.front.frameName = this.key + '_' + this.element + '_fg';
    this.back.frameName = this.key + '_' + this.element;   
    var tileChild = this.game.make.sprite(0,0,this.key, this.key + '_' + this.element + '_' + this.modifier);
    this.back.addChild(tileChild);
    
};