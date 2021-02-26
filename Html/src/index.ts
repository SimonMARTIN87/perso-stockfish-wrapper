import { GameView } from "./com/GameView";
import { Game } from 'perso-chess';

const game = new Game();

const view = new GameView(game);
view.addToDom();