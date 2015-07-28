PrinceJS.Actor = function (game, charX, charY, charFace, key, animKey) {
  
    Phaser.Sprite.call(this, game, 0, 0, key);
    
    if (typeof animKey === 'undefined') { animKey = key; }
    
    this.charX = charX;
    this.charY = charY;
    this.charFace = charFace;
    this.charName = key;
    
    this.charFrame;
    this.charFdx = 0;
    this.charFdy = 0;
    this.charFcheck = false;
    this.charFfoot = 0;
    this.charFood = false;
    this.charFthin = false;
    
    this.scale.x *= -charFace;
    this.anchor.setTo(0,1);
    
    this._action = 'stand';
    this._seqpointer = 0;
    
    this.game.add.existing(this);
    
    this.z = 20;
    
    this.baseX = 0;
    this.baseY = 0;
    
    this.anims = this.game.cache.getJSON( animKey + '-anims');
    
    this.commands = [];
    
    for (var i=0; i < 256; i++) {
        
        this.registerCommand(i,this.CMD_NOOP);
        
    }
    
    this.registerCommand(0xFF,this.CMD_GOTO);
    this.registerCommand(0xFE,this.CMD_ABOUTFACE);
    this.registerCommand(0xFB,this.CMD_CHX);
    this.registerCommand(0xFA,this.CMD_CHY);
    this.registerCommand(0xF2,this.CMD_TAP);
    this.registerCommand(0x00,this.CMD_FRAME);
    
};

PrinceJS.Actor.prototype = Object.create(Phaser.Sprite.prototype);
PrinceJS.Actor.prototype.constructor = PrinceJS.Actor;

PrinceJS.Actor.prototype.registerCommand = function(value, fn) {

    this.commands[value] = fn.bind(this);
    
};

PrinceJS.Actor.prototype.updateCharFrame = function() {
    
    var framedef = this.anims.framedef[this.charFrame];
    this.charFdx = framedef.fdx;
    this.charFdy = framedef.fdy;
    
    var fcheck = parseInt( framedef.fcheck, 16 );
    this.charFfoot = fcheck & 0x1F;
    this.charFood = (fcheck & 0x80) == 0x80;
    this.charFcheck = (fcheck & 0x40) == 0x40;
    this.charFthin = (fcheck & 0x20) == 0x20;
    
};

PrinceJS.Actor.prototype.updateActor = function() {
    
    this.processCommand();
    this.updateCharPosition();
    
};

PrinceJS.Actor.prototype.CMD_NOOP = function(data) {
    
    console.warn('Command ' + data.cmd + ' not implemented!!!');
    
};

PrinceJS.Actor.prototype.CMD_GOTO = function(data) {
    
    this._action = data.p1;
    this._seqpointer = data.p2 - 1;
    
};

PrinceJS.Actor.prototype.CMD_ABOUTFACE = function(data) {
    
    this.charFace *= -1;
    this.scale.x *= -1;
    
};

PrinceJS.Actor.prototype.CMD_CHX = function(data) {
    
    this.charX += data.p1 * this.charFace;
    
};

PrinceJS.Actor.prototype.CMD_CHY = function(data) {
    
    this.charY += data.p1;
    
};

PrinceJS.Actor.prototype.CMD_TAP = function(data) {
    
    //console.log('Pending TAP implementation');
    
};

PrinceJS.Actor.prototype.CMD_FRAME = function(data) {
    
    this.charFrame = data.p1;
    this.updateCharFrame();
    this.processing = false;
    
};


PrinceJS.Actor.prototype.processCommand = function() {
        
    this.processing = true;
    
    while (this.processing) {
        
        var data = this.anims.sequence[this._action][this._seqpointer];
        this.commands[data.cmd](data);
        
        this._seqpointer++;
        
    }

};

PrinceJS.Actor.prototype.updateCharPosition = function() {
     
    this.frameName = this.charName + '-' + this.charFrame;
    
    var tempx = this.charX + (this.charFdx * this.charFace);
    
    if ((this.charFood && this.faceL()) || (!this.charFood && this.faceR())) {
        
        tempx += 0.5;
        
    }
    
    this.x = this.baseX + PrinceJS.Utils.convertX( tempx );
    this.y = this.baseY + this.charY + this.charFdy;
      
};

PrinceJS.Actor.prototype.faceL = function() {
    
    return ( this.charFace == -1 );
    
};

PrinceJS.Actor.prototype.faceR = function() {
    
    return ( this.charFace == 1 );
    
};

PrinceJS.Actor.prototype.frameID = function(from, to) {
    
    if (typeof to === 'undefined') {
        
        return ( this.charFrame == from );
        
    } else {
        
        return ( this.charFrame >= from ) && ( this.charFrame <= to);
        
    }
    
};

Object.defineProperty(PrinceJS.Actor.prototype, "action", {

    get: function () {

        return this._action;

    },

    set: function (value) {

        this._action = value;

        this._seqpointer = 0;

    }

});




