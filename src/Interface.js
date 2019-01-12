PrinceJS.Interface = function (game) {

    this.game = game;

    this.text;

    var bmd = this.game.make.bitmapData(PrinceJS.SCREEN_WIDTH, PrinceJS.UI_HEIGHT);
    bmd.fill(0,0,0);

    this.layer = this.game.add.sprite(0, (PrinceJS.SCREEN_HEIGHT - PrinceJS.UI_HEIGHT) * PrinceJS.SCALE_FACTOR, bmd);
    this.layer.fixedToCamera = true;

    this.text = this.game.make.bitmapText(PrinceJS.SCREEN_WIDTH * 0.5, (PrinceJS.UI_HEIGHT - 1) * 0.5, 'font','',16);
    this.text.setText('LEVEL ' + PrinceJS.currentLevel);
    this.text.anchor.setTo(0.5,0.5);

    this.layer.addChild(this.text);

    this.playerHPs = [];
    this.oppHPs = [];

    this.playerHPActive;
    this.oppHPActive;

};

PrinceJS.Interface.prototype = {

    setPlayerLive: function(actor) {

        this.playerHPActive = actor.health;
        for (var i=0; i < actor.health; i++) {

            this.playerHPs[i] =  this.game.add.sprite(i*7,2,'general','kid-live');
            this.layer.addChild(this.playerHPs[i]);

        }

        actor.onDamageLive.add(this.damagePlayerLive, this);
        actor.onRecoverLive.add(this.recoverPlayerLive, this);
        actor.onAddLive.add(this.addPlayerLive, this);

    },

    damagePlayerLive: function(num) {

        for (var i=0; i<num; i++) {

            this.playerHPActive--;
            this.playerHPs[this.playerHPActive].frameName = 'kid-emptylive';

        }

    },

    recoverPlayerLive: function() {

        this.playerHPs[0].frameName = 'kid-live';
        this.playerHPs[this.playerHPActive].frameName = 'kid-live';
        this.playerHPActive++;

    },

    addPlayerLive: function() {

        var num = this.playerHPs.length;
        var hp = this.game.add.sprite(num*7,2,'general','kid-emptylive');
        this.playerHPs[num] = hp;
        this.layer.addChild(this.playerHPs[num]);

    },

    setOpponentLive: function(actor) {

        if (!actor || actor.charName == 'skeleton') return;

        this.oppHPActive = actor.health;
        for (var i=actor.health; i > 0; i--) {

            this.oppHPs[i - 1] =  this.game.add.sprite(PrinceJS.SCREEN_WIDTH - i*7 + 1,2,'general', actor.charName + '-live');
            this.layer.addChild(this.oppHPs[i - 1]);

        }

        actor.onDamageLive.add(this.damageOpponentLive, this);

    },

    damageOpponentLive: function() {

        this.oppHPActive--;
        this.oppHPs[this.oppHPActive].visible = false;

    },

    updateUI: function() {

        if (this.playerHPActive == 1) {

            if (this.playerHPs[0].frameName == 'kid-live') {

                this.playerHPs[0].frameName = 'kid-emptylive';

            } else {

                this.playerHPs[0].frameName = 'kid-live';

            }

        }

    }

};