PrinceJS.Tile.Star = function (game, x, y) {
    
    this.game = game;
    
    this.back = this.game.make.sprite(x,y,'cutscene');
    
    this.state = 1;
    
    this.update();
    
};


PrinceJS.Tile.Star.prototype.update = function() {
    
    var step = this.game.rnd.between(1,10);
    
    switch (step) {
            
        case 1:
            if (this.state > 0) this.state--;
            break;
            
        case 2:
            if (this.state < 2) this.state++;
            break;
            
    }
    
    this.back.frameName = 'star' + this.state;
    
};

PrinceJS.Tile.Star.prototype.constructor = PrinceJS.Tile.Star;