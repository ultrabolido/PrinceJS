PrinceJS.Cutscene = function (game) {

    this.scene;
    
};

PrinceJS.Cutscene.STATE_WAITING = 0;
PrinceJS.Cutscene.STATE_RUNNING = 1;

PrinceJS.Cutscene.prototype = {

	preload: function () {
       
        this.load.json('cutscene','assets/cutscenes/scene' + PrinceJS.currentLevel + '.json');
        
    },
    
    create: function () {
        
        this.reset();
        
        this.program = this.game.cache.getJSON('cutscene').program;
        
        this.scene = new PrinceJS.Scene(this.game);
        
        this.world.alpha = 0;
        
        this.game.add.tween(this.world).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 0, false);
        
        if (PrinceJS.currentLevel != 15) this.input.keyboard.onDownCallback = this.play.bind(this);
        this.game.time.events.loop(120, this.updateScene, this);
        
	},
    
    executeProgram: function() {
      
        if (this.sceneState == PrinceJS.Cutscene.STATE_WAITING) {
         
            this.waitingTime--;
            if (this.waitingTime == 0) this.sceneState = PrinceJS.Cutscene.STATE_RUNNING;
            return;
            
        }
        
        while (this.sceneState == PrinceJS.Cutscene.STATE_RUNNING) {
            
            var opcode = this.program[this.pc];
            switch (opcode.i) {

                case 'START':
                    this.world.sort('z');
                    break;
                    
                case 'END':
                    this.endCutscene();
                    this.sceneState = PrinceJS.Cutscene.STATE_WAITING;
                    this.waitingTime = 1000;
                    break;

                case 'ACTION':
                    var actor = this.actors[opcode.p1];
                    actor.action = opcode.p2;
                    break;

                case 'ADD_ACTOR':
                    this.actors[opcode.p1] = new PrinceJS.Actor(this.game,opcode.p3, opcode.p4, opcode.p5, opcode.p2);
                    break;
                    
                case 'REM_ACTOR':
                    this.actors[opcode.p1].kill();
                    break;
                    
                case 'ADD_OBJECT':
                    this.objects[opcode.p1] = new PrinceJS.Tile.Clock(this.game,opcode.p3,opcode.p4, opcode.p2);
                    this.scene.addObject(this.objects[opcode.p1]);
                    break;
                    
                case 'START_OBJECT':
                    this.objects[opcode.p1].activate();
                    break;
                    
                case 'EFFECT':
                    this.scene.effect();
                    break;

                case 'WAIT':
                    this.sceneState = PrinceJS.Cutscene.STATE_WAITING;
                    this.waitingTime = opcode.p1;
                    break;

            }
            this.pc++;
            
        }
        
    },

   
	updateScene: function () {
 
        this.executeProgram();
        this.scene.update();
    
        for (var i=0; i < this.actors.length; i++) {
            
            this.actors[i].updateActor();
        
        }
        

	},
    
    play: function () {
     
        this.input.keyboard.onDownCallback = null;
        this.state.start('Game');
        
    },
    
    endCutscene: function() {
      
        var tween = this.game.add.tween(this.world).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true, 0, 0, false);
        tween.onComplete.add(this.next,this);
        
    },
        
    next: function () {
        
        if (PrinceJS.currentLevel == 1) {
            
            this.state.start('Credits');
        
        } else {
            
            if (PrinceJS.currentLevel == 15) {

                PrinceJS.currentLevel = 1;
                this.state.start('EndTitle');
                
            } else {
        
                this.play();
                
            }
            
        }
        
    },
    
    reset: function() {
        
        this.actors = [];
        this.objects = [];

        this.pc = 0;
        this.waitingTime = 0;
        this.sceneState = PrinceJS.Cutscene.STATE_RUNNING;
        
    }
    
};