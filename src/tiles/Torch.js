PrinceJS.Tile.Torch = function (game, element, modifier, type) {
    
    PrinceJS.Tile.Base.call(this, game, element, modifier, type);
    
    this.tileChild = this.game.make.sprite(40,18,'general');
    this.back.addChild(this.tileChild);
    
    this.step = this.game.rnd.between(0,8);
    
};

PrinceJS.Tile.Torch.frames = Phaser.Animation.generateFrameNames('fire_', 1, 9, '', 1);

PrinceJS.Tile.Torch.prototype = Object.create(PrinceJS.Tile.Base.prototype);
PrinceJS.Tile.Torch.prototype.constructor = PrinceJS.Tile.Torch;

PrinceJS.Tile.Torch.prototype.update = function() {
    
    this.tileChild.frameName = PrinceJS.Tile.Torch.frames[this.step];
    this.step = (this.step + 1) % PrinceJS.Tile.Torch.frames.length;
    
};

