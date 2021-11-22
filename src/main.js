import Phaser, {Game} from 'phaser';
import BootScene from './scripts/scenes/BootScene';
import PreloadScene from './scripts/scenes/PreloadScene';
import TitleScene from './scripts/scenes/TitleScene';
import CutScene from './scripts/scenes/CutScene';
import CreditsScene from './scripts/scenes/CreditsScene';
import GameScene from './scripts/scenes/GameScene';
import EndTitleScene from './scripts/scenes/EndTitleScene';

const config = {
  type: Phaser.AUTO,
  pixelart: true,
  scale: {
    mode: Phaser.Scale.NONE,
    parent: 'gameContainer',
    width: 320,
    height: 200,
    zoom: 2
  },
  fps: {
    target: 15,
    forceSetTimeOut: true
  },
  scene: [
    BootScene,
    PreloadScene,
    TitleScene,
    CutScene,
    CreditsScene,
    GameScene,
    EndTitleScene
  ]
};

const game = new Game(config);