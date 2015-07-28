PrinceJS.Preloader = function (game) {

};

PrinceJS.Preloader.prototype = {

	preload: function () {

        var text = this.game.add.bitmapText(PrinceJS.SCREEN_WIDTH * 0.5, PrinceJS.SCREEN_HEIGHT * 0.5, 'font','Loading. . . .',16);
        text.anchor.setTo(0.5,0.5);
        
        this.load.atlasJSONHash('kid','assets/gfx/kid.png','assets/gfx/kid.json');
        this.load.atlasJSONHash('princess','assets/gfx/princess.png','assets/gfx/princess.json');
        this.load.atlasJSONHash('vizier','assets/gfx/vizier.png','assets/gfx/vizier.json');
        this.load.atlasJSONHash('mouse','assets/gfx/mouse.png','assets/gfx/mouse.json');
        this.load.atlasJSONHash('guard','assets/gfx/guard.png','assets/gfx/guard.json');
        this.load.atlasJSONHash('fatguard','assets/gfx/fatguard.png','assets/gfx/fatguard.json');
        this.load.atlasJSONHash('jaffar','assets/gfx/jaffar.png','assets/gfx/jaffar.json');
        this.load.atlasJSONHash('skeleton','assets/gfx/skeleton.png','assets/gfx/skeleton.json');
        this.load.atlasJSONHash('shadow','assets/gfx/shadow.png','assets/gfx/shadow.json');
        this.load.atlasJSONHash('dungeon','assets/gfx/dungeon.png','assets/gfx/dungeon.json');
        this.load.atlasJSONHash('palace','assets/gfx/palace.png','assets/gfx/palace.json');
        this.load.atlasJSONHash('general','assets/gfx/general.png','assets/gfx/general.json');
        this.load.atlasJSONHash('title','assets/gfx/title.png','assets/gfx/title.json');
        this.load.atlasJSONHash('cutscene','assets/gfx/cutscene.png','assets/gfx/cutscene.json');
        this.load.json('kid-anims','assets/anims/kid.json');
        this.load.json('sword-anims','assets/anims/sword.json');
        this.load.json('fighter-anims','assets/anims/fighter.json');
        this.load.json('princess-anims','assets/anims/princess.json');
        this.load.json('vizier-anims','assets/anims/vizier.json');
        this.load.json('mouse-anims','assets/anims/mouse.json');

	},

	create: function () {

		if (PrinceJS.SKIP_TITLE) {
            
            this.state.start('Game');
            
        } else {
            
            this.state.start('Title');
        
        }
        
	}

};
