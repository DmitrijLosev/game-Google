import {EventsFactory, Game, GAME_MODES} from './game.js'
import {EventEmitter} from './utils/eventEmitter/eventEmitter.js'
import {GameViewComponent} from './view.js'
import {Controller1} from "./controller/controller1.js";
import {ws} from "./adapter/adapter.js";
import {WSAdapter} from "./adapter/WSAdapter.js";
const start = async() =>{
    const eventEmitter = new EventEmitter();
    const eventsFactory = new EventsFactory();
    const wsAdapter = new WSAdapter(ws);
    const game = new Game(eventEmitter,eventsFactory);
    game.settings={mode:GAME_MODES.CLIENT}
    await game.start()


    const controller = new Controller1(game,wsAdapter)
    const view =  new GameViewComponent(controller, game)
    view.render();

}


start();
ws;



