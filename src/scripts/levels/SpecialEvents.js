import GameState from "../ui/GameState";
import { TILE } from '../Constants';

class SpecialEvents {

    constructor(scene) {
        this.scene = scene;
    }

    levelStart() {

        switch (GameState.currentLevel) {

            case 1:
                this.scene.kid.charX -= 7;
                this.scene.level.fireEvent(8, TILE.DROP_BUTTON);
                this.scene.kid.specialLand = true;
                break;

        }

    }
    
}

export default SpecialEvents;