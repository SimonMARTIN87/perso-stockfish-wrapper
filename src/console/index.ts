import {Game} from '../com/Game';
import { EngineWrapper } from '../engine/EngineWrapper';
import RLInterface from './RLInterface';
const game: Game = new Game();
const bot: EngineWrapper = new EngineWrapper(1000);
const rl: RLInterface = new RLInterface(game, bot);

rl.start();

