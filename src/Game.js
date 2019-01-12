PrinceJS.Game = function (game) {

    this.kid;

    this.level;

    this.ui;

    this.guards = [];

};

PrinceJS.Game.prototype = {

	preload: function () {

        this.load.json('level','assets/maps/level' + PrinceJS.currentLevel + '.json');

    },

    create: function () {


        var json = this.game.cache.getJSON('level');

        this.level = new PrinceJS.LevelBuilder(this.game).buildFromJSON(json);

        for ( var i = 0; i < json.guards.length ; i++ ) {

            var ginfo = json.guards[i];
            var guard = new PrinceJS.Enemy(this.game, this.level, ginfo.location, ginfo.direction, ginfo.room, ginfo.skill, ginfo.type);
            this.guards.push(guard);

        }

        json.prince.room = 2;
        json.prince.location = 19;

        this.kid = new PrinceJS.Kid(this.game,this.level,json.prince.location,json.prince.direction,json.prince.room);

        this.kid.onChangeRoom.add(this.setupCamera, this);
        this.kid.onChangeRoom.add(this.checkForOpponent, this);
        this.kid.onNextLevel.add(this.nextLevel, this);


        this.setupCamera(json.prince.room);

        this.world.sort('z');

        this.world.alpha = 1;

        this.ui = new PrinceJS.Interface(this.game);
        this.ui.setPlayerLive(this.kid);

        this.game.time.events.loop(80, this.updateWorld, this);

        // for level 1 only -> close gate first room !!!
        if ( PrinceJS.currentLevel == 1 ) this.level.fireEvent(8,PrinceJS.Level.TILE_DROP_BUTTON);

        this.input.keyboard.addKey(Phaser.Keyboard.Q).onDown.add(this.previousLevel, this);
        this.input.keyboard.addKey(Phaser.Keyboard.W).onDown.add(this.nextLevel, this);
        this.input.keyboard.addKey(Phaser.Keyboard.R).onDown.add(this.reset, this);

	},


	update: function () {



	},

    updateWorld: function () {

        this.level.update();
        this.kid.updateActor();
        for ( var i = 0; i < this.guards.length ; i++ ) {

            this.guards[i].updateActor();

        }
        this.ui.updateUI();

    },


	nextLevel: function () {

		PrinceJS.currentLevel++;
        if (PrinceJS.currentLevel == 16) PrinceJS.currentLevel = 1;
        this.reset();

	},

    previousLevel: function () {

		PrinceJS.currentLevel--;
        if (PrinceJS.currentLevel == 0) PrinceJS.currentLevel = 14;
        this.reset();

	},

    reset: function () {

        this.guards = [];

        if ( [2,4,6,8,9,12,15].indexOf(PrinceJS.currentLevel) > -1 ) {

            this.state.start('Cutscene');

        } else {

            this.state.start('Game');

        }

    },

    setupCamera: function(room) {

        this.game.camera.x = this.level.rooms[room].x * PrinceJS.SCREEN_WIDTH * PrinceJS.SCALE_FACTOR;
        this.game.camera.y = this.level.rooms[room].y * PrinceJS.ROOM_HEIGHT * PrinceJS.SCALE_FACTOR;

    },

    checkForOpponent: function(room) {

        for ( var i = 0; i < this.guards.length ; i++ ) {

            if ( ( this.guards[i].room == room ) && this.guards[i].alive ) {

                this.kid.opponent = this.guards[i];
                this.guards[i].opponent = this.kid;
                this.ui.setOpponentLive(this.guards[i]);

            }

        }

    }

};
