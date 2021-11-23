import GameState from "./GameState";
import { SCREEN_HEIGHT, SCREEN_WIDTH, UI_HEIGHT } from "../Config";
import { toMinutes, toSeconds } from '../Utils';

class Interface {

    constructor(scene) {

        this.scene = scene;

        const gfx = this.scene.add.graphics({x: 0 , y: SCREEN_HEIGHT - UI_HEIGHT}).setScrollFactor(0);
        gfx.fillStyle(0, 1);
        gfx.fillRect(0, 0, SCREEN_WIDTH, UI_HEIGHT);

        this.uiLayer = this.scene.add.layer().setDepth(50);
        this.uiLayer.add(gfx);

        this.text = this.scene.add.bitmapText(SCREEN_WIDTH * 0.5, SCREEN_HEIGHT - UI_HEIGHT * 0.5 - 1, 'font','',16).setOrigin(0.5,0.5);
        this.text.setText('LEVEL ' + GameState.currentLevel).setScrollFactor(0);
        this.uiLayer.add(this.text);

        this.playerLives = [];
        this.oponentLives = [];
        
        this.player;
        this.oponent;

        this.scene.time.delayedCall(1500, this.showTimeLeft, [], this);
    }

    showTimeLeft() {

        if (this.deleteTextEvent) {
            this.scene.time.removeEvent(this.deleteTextEvent);
            this.deleteTextEvent = null;
        }

        const min = toMinutes(GameState.timeLeft);
        let txt = Math.ceil(min) + ' MINUTES LEFT';

        if (min <= 1) {
            const sec = toSeconds(GameState.timeLeft);
            if (sec == 1) {
                txt = sec + ' SECOND LEFT';
            } else {
                txt = sec + ' SECONDS LEFT';
            }
        }

        this.showText(txt);
        if (min > 1) this.deleteTextEvent = this.scene.time.delayedCall(1500, this.showText, [''], this);
    }

    showText(txt) {
        this.text.setText(txt);
    }

    showPressButton() {
        this.scene.time.delayedCall(2000, this.showText, ['Press Button to Continue'], this);
    }

    setPlayer(player) {
        this.player = player;
        this.player.on('updatehealth', this.updateUI, this);
        this.player.on('dead',this.showPressButton, this);
        this.updateUI();
    }

    setOponent(oponent) {
        if (oponent.charName == 'skeleton') return;
        this.oponent = oponent;
        this.oponent.on('updatehealth', this.updateUI, this);
        this.updateUI();
    }

    update() {

        if (this.player.health == 1) {

            if (this.playerLives[0].frame.name == 'kid-live') {
                this.playerLives[0].setFrame('kid-emptylive');
            } else {
                this.playerLives[0].setFrame('kid-live');
            }
            this.playerLives[0].setOrigin(0,0);
        }

        if (this.oponent && (this.oponent.health == 1)) {

            this.oponentLives[0].setVisible(!this.oponentLives[0].visible);

        }

    }

    updateUI() {

        for (var i=0; i < this.player.health; i++) {

            if (!this.playerLives[i]) {
                this.playerLives[i] = this.scene.add.sprite(i*7, SCREEN_HEIGHT - UI_HEIGHT + 2, 'general').setScrollFactor(0);
                this.uiLayer.add(this.playerLives[i])
            }
            this.playerLives[i].setFrame('kid-live').setOrigin(0,0);
        }

        for (var i=this.player.health; i < this.player.maxHealth; i++) {
            if (!this.playerLives[i]) {
                this.playerLives[i] = this.scene.add.sprite(i*7,SCREEN_HEIGHT - UI_HEIGHT + 2,'general').setScrollFactor(0).setOrigin(0,0);
                this.uiLayer.add(this.playerLives[i]);
            }
            this.playerLives[i].setFrame('kid-emptylive').setOrigin(0,0);
        }

        if (this.oponent) {

            for (var i=0; i < this.oponent.health; i++) {

                if (!this.oponentLives[i]) {
                    this.oponentLives[i] = this.scene.add.sprite(SCREEN_WIDTH - (i+1)*7 + 1, SCREEN_HEIGHT - UI_HEIGHT + 2, 'general').setScrollFactor(0);
                    this.uiLayer.add(this.oponentLives[i])
                }
                this.oponentLives[i].setFrame(this.oponent.charName + '-live').setOrigin(0,0);
            }

            for (var i=this.oponent.health; i < this.oponent.maxHealth; i++) {
                
                if (this.oponentLives[i]) this.oponentLives[i].setVisible(false);

            }

            if (this.oponent.health == 0) this.oponent = null;
        }

    }

}

export default Interface;
