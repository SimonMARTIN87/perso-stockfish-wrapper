import {Game} from 'perso-chess';
import {EngineWrapper} from 'perso-chess-engine';
import RLInterface from './console/RLInterface';
const game: Game = new Game();
const bot: EngineWrapper = new EngineWrapper(1000);
const rl: RLInterface = new RLInterface(game, bot);

rl.start();


