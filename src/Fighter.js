PrinceJS.Fighter = function (game, level, location, direction, room, key, animKey) {

    this.level = level;
    this.room = room;

    this.charBlockX = location % 10;
    this.charBlockY = Math.floor( location / 10);

    var x = PrinceJS.Utils.convertBlockXtoX(this.charBlockX);
    var y = PrinceJS.Utils.convertBlockYtoY(this.charBlockY);

    PrinceJS.Actor.call(this, game, x, y, direction, key, animKey);

    this.charXVel = 0;
    this.charYVel = 0;
    this.actionCode = 1;

    // adding sword
    this.charSword = true;

    this.swordFrame = 0;
    this.swordDx = 0;
    this.swordDy = 0;

    this.splash = this.game.make.sprite(0,0,'general', this.charName + '-splash');
    this.splash.anchor.set(0,1);
    this.splash.x = -6;
    this.splash.y = -15;
    this.splash.visible = false;
    this.addChild(this.splash);

    this.sword = this.game.make.sprite(0,0,'general');
    this.sword.scale.x *= -this.charFace;
    this.sword.anchor.setTo(0,1);

    this.game.add.existing(this.sword);

    this.sword.z = 21;

    this.baseX = this.level.rooms[this.room].x * PrinceJS.ROOM_WIDTH;
    this.baseY = this.level.rooms[this.room].y * PrinceJS.ROOM_HEIGHT + 3;

    this.swordAnims = this.game.cache.getJSON('sword-anims');

    this.registerCommand(0xF9,this.CMD_ACT);
    this.registerCommand(0xF6,this.CMD_DIE);

    this.opponent = null;

    this.health = 3;
    this.alive = true;
    this.swordDrawn = false;
    this.blocked = false;

    this.onDamageLive = new Phaser.Signal();
    this.onDead = new Phaser.Signal();
    this.onStrikeBlocked = new Phaser.Signal();
    this.onEnemyStrike = new Phaser.Signal();

};

PrinceJS.Fighter.GRAVITY = 3;
PrinceJS.Fighter.TOP_SPEED = 33;

PrinceJS.Fighter.prototype = Object.create(PrinceJS.Actor.prototype);
PrinceJS.Fighter.prototype.constructor = PrinceJS.Fighter;

PrinceJS.Fighter.prototype.CMD_ABOUTFACE = function(data) {

    this.charFace *= -1;
    this.scale.x *= -1;
    this.sword.scale.x *= -1;

};

PrinceJS.Fighter.prototype.CMD_DIE = function(data) {

    this.onDead.dispatch();
    this.alive = false;
    this.splash.visible = true;
    this.swordDrawn = false;

};

PrinceJS.Fighter.prototype.CMD_ACT = function(data) {

    this.actionCode = data.p1;
    if (data.p1 == 1) {

        this.charXVel = 0;
        this.charYVel = 0;

    }

};

PrinceJS.Fighter.prototype.CMD_FRAME = function(data) {

    this.charFrame = data.p1;
    this.updateCharFrame();
    this.updateSwordFrame();
    this.updateBlockXY();
    this.processing = false;

};

PrinceJS.Fighter.prototype.updateSwordFrame = function() {

    var framedef = this.anims.framedef[this.charFrame];

    this.charSword = (typeof framedef.fsword !== 'undefined');

    if (this.charSword) {

        var stab = this.swordAnims.swordtab[framedef.fsword - 1];
        this.swordFrame = stab.id;
        this.swordDx = stab.dx;
        this.swordDy = stab.dy;

    }

};

PrinceJS.Fighter.prototype.updateBlockXY = function() {

    var footX = this.charX + ( this.charFdx * this.charFace ) - ( this.charFfoot * this.charFace );
    var footY = this.charY + this.charFdy;
    this.charBlockX = PrinceJS.Utils.convertXtoBlockX(footX);
    this.charBlockY = PrinceJS.Utils.convertYtoBlockY(footY); // - this.height);

    if (this.charBlockX < 0) {
        this.charX += 140;
        this.baseX -= 320;
        this.charBlockX = 9;
        this.room = this.level.rooms[this.room].links.left;
    }

    if (this.charBlockX > 9) {
        this.charX -= 140;
        this.baseX += 320;
        this.charBlockX = 0;
        this.room = this.level.rooms[this.room].links.right;
    }

};

PrinceJS.Fighter.prototype.updateActor = function() {

    this.updateBehaviour();
    this.processCommand();
    this.updateAcceleration();
    this.updateVelocity();
    this.checkFight();
    this.updateCharPosition();
    this.updateSwordPosition();

};

PrinceJS.Fighter.prototype.updateBehaviour = function() {


};

PrinceJS.Fighter.prototype.checkFight = function() {

    if (this.opponent == null) return;

    if (this.blocked && this.action != 'strike') {

        this.retreat();
        this.processCommand();
        this.blocked = false;
        return;

    }

    distance = this.opponentDistance();

    switch (this.action) {

        /*case 'stand':
            if ( !this.flee && this.opponent.alive && this.haveSword ) {

                if (this.charName == 'kid' ) {

                    this.engarde();

                }

            }
            break;*/

        case 'engarde':
            if (!this.opponent.alive) {

                this.sheathe();
                this.opponent = null;

            }

            if ( distance < -4 )  {

                    if (this.charName == 'kid' ) {

                        this.turnengarde();
                        this.opponent.turnengarde();

                    }

            }
            break;

        case 'stabbed':

            if (this.frameID(23) || this.frameID(173)) { this.splash.visible = false; }
            break;

        case 'dropdead':

            if (this.frameID(30) || this.frameID(180)) { this.splash.visible = false; }
            break;

        case 'strike':

            if ( this.opponent.action == 'climbstairs' ) return;
            if ( !this.frameID(153,154) && !this.frameID(3,4) ) return;

            if ( !this.opponent.frameID(150) && !this.opponent.frameID(0) ) {

                if ( this.frameID(154) || this.frameID(4) )  {

                    var minHurtDistance = this.opponent.swordDrawn ? 12 : 8;

                    if ( ( distance >= minHurtDistance ) && ( distance < 29 ) ) {

                        this.opponent.stabbed();

                    }

                }

            } else {

                this.opponent.blocked = true;
                this.action = 'blockedstrike';
                this.processCommand();
                this.onStrikeBlocked.dispatch();

            }
            break;


    }
};


PrinceJS.Fighter.prototype.updateSwordPosition = function() {

    if (this.charSword) {

        this.sword.frameName = 'sword' + this.swordFrame;
        this.sword.x = this.x + this.swordDx * this.charFace;
        this.sword.y = this.y + this.swordDy;

    }

    this.sword.visible = this.charSword;

};


PrinceJS.Fighter.prototype.opponentDistance = function() {

    if ( this.opponent.room != this.room ) return 999;

    var distance = (this.opponent.charX - this.charX) * this.charFace;
    if ( (distance >= 0) && (this.charFace != this.opponent.charFace) ) distance += 13;
    return distance;

};

PrinceJS.Fighter.prototype.updateVelocity = function() {

    this.charX += this.charXVel;
    this.charY += this.charYVel;

};

PrinceJS.Fighter.prototype.updateAcceleration = function() {

    if ( this.actionCode == 4 ) {

        this.charYVel += PrinceJS.Fighter.GRAVITY;
        if (this.charYVel > PrinceJS.Fighter.TOP_SPEED) { this.charYVel = PrinceJS.Fighter.TOP_SPEED; }

    }

};

PrinceJS.Fighter.prototype.engarde = function() {

    this.action = 'engarde';
    this.swordDrawn = true;

};

PrinceJS.Fighter.prototype.turnengarde = function() {

    this.action = 'turnengarde';

};

PrinceJS.Fighter.prototype.sheathe = function() {

    this.action = 'resheathe';
    this.swordDrawn = false;

};

PrinceJS.Fighter.prototype.retreat = function() {

    if ( this.frameID(158) || this.frameID(8) || this.frameID(20,21) ) {

        this.action = 'retreat';
        this.allowRetreat = false;

    }

};

PrinceJS.Fighter.prototype.advance = function() {

    if ( this.frameID(158) || this.frameID(8) || this.frameID(20,21) ) {

        this.action = 'advance';
        this.allowAdvance = false;

    }

};

PrinceJS.Fighter.prototype.strike = function() {

    if ( this.frameID(157,158) || this.frameID(165) || this.frameID(7,8) || this.frameID(20,21) || this.frameID(15) ) {

        this.action = 'strike';
        this.allowStrike = false;

    } else {

        if ( this.frameID(150) || this.frameID(0) || this.blocked ) {

            this.action = 'blocktostrike';
            this.allowStrike = false;
            this.blocked = false;

        }

    }
    // Dirty check
    // TODO fix properly
    if (this.opponent) {
        this.opponent.onEnemyStrike.dispatch();
    }

};

PrinceJS.Fighter.prototype.block = function() {

    if ( this.frameID(8) || this.frameID(20,21) || this.frameID(18) || this.frameID(15) ) {

        if (this.opponentDistance() >= 32) return this.retreat();
        if (!this.opponent.frameID(152) && !this.opponent.frameID(2)) return;
        this.action = 'block';

    } else {

        if (!this.frameID(17)) return;
        this.action = 'striketoblock';

    }

    this.allowBlock = false;

};

PrinceJS.Fighter.prototype.stabbed = function() {

    if ( this.health == 0 ) return;

    this.charY = PrinceJS.Utils.convertBlockYtoY(this.charBlockY);

    if (this.charName != 'skeleton') {

        var damage = this.swordDrawn ? 1 : this.health;
        this.onDamageLive.dispatch(damage);
        this.health -= damage;

    }

    if (this.health == 0) {

        this.action = 'stabkill';

    } else {

        this.action = 'stabbed';

    }

    this.splash.visible = true;

};

PrinceJS.Fighter.prototype.canSeeOpponent = function() {

    if (this.opponent == null) return 0;

    if (this.opponent.room != this.room) return 0;

    if (this.opponent.charBlockY != this.charBlockY) return 0;

    return 1;

};





