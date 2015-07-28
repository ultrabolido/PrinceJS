PrinceJS.Title = function (game) {

    this.tick = 0;

};

PrinceJS.Title.prototype = {

	preload: function () {
       
        
    },
    
    create: function () {

        this.tick = 0;
        
        this.game.world.setBounds(0, 0, PrinceJS.SCREEN_WIDTH, PrinceJS.SCREEN_HEIGHT);
        
        this.back = this.game.add.image(0, 0, 'title', 'main_background');
        this.back.alpha = 0;
        
        this.tween1 = this.game.add.tween(this.back).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, false, 0, 0, false);
        
        this.presents = this.game.add.image(this.world.centerX, this.world.centerY + 29.5, 'title', 'presents');
        this.presents.anchor.setTo(0.5,0.5);
        this.presents.visible = false;
        
        this.author = this.game.add.image(this.world.centerX - 3, this.world.centerY + 37, 'title', 'author');
        this.author.anchor.setTo(0.5,0.5);
        this.author.visible = false;
        
        this.prince = this.game.add.image(0, 0, 'title', 'prince');
        this.prince.visible = false;
        
        this.textBack = this.game.add.image(0, this.world.height, 'title', 'in_the_absence');
        this.textBack.anchor.setTo(0,1);
        
        this.cropRect = new Phaser.Rectangle(0, 0, 0, this.textBack.height);
        this.tween2 = this.game.add.tween(this.cropRect).to( { width: this.textBack.width }, 200, Phaser.Easing.Linear.None, false, 0, 0, false);
        this.textBack.crop(this.cropRect);
        
        this.tween3 = this.game.add.tween(this.textBack).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, false, 0, 0, false);
        this.tween3.onComplete.add(this.cutscene, this);
        
        this.input.keyboard.onDownCallback = this.play.bind(this);
        
	},

   
	update: function () {
 
        switch (this.tick) {
            
            case    0: this.tween1.start(); break;
            case  150: this.presents.visible = true; break;     
            case  250: this.presents.visible = false; break;
            case  300: this.author.visible = true; break;
            case  400: this.author.visible = false; break;    
            case  600: this.prince.visible = true; break;
            case  800: this.tween2.start(); break;
            case 1000: this.back.visible = this.prince.visible = false; this.tween3.start(); break;
                
        }
        
        this.tick++;
        this.textBack.updateCrop();

	},
    
    play: function () {
     
        this.input.keyboard.onDownCallback = null;
        this.state.start('Game');
        
    },
    
    cutscene: function () {
     
        this.input.keyboard.onDownCallback = null;
        this.state.start('Cutscene');
        
    },

};
