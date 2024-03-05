import { WebSocketServer } from 'ws';
import {EventEmitter} from "../utils/eventEmitter/eventEmitter.js";
import {DIRECTIONS, EventsFactory, Game, GAME_MODES} from "../game.js";

const wss = new WebSocketServer({ port: 3000 });

const eventEmitter = new EventEmitter();
const eventsFactory = new EventsFactory();
const game = new Game(eventEmitter,eventsFactory);
game.settings={mode:GAME_MODES.SERVER}

game.eventEmitter.subscribe("change", (e)=>{
    connections.forEach(ws=>ws.send(JSON.stringify(e)))
})

const connections =[]

wss.on('connection', async function connection(ws) {

    connections.push(ws)
    if(connections.length === 2) {
        await game.start()
        console.log("GAME STARTED ON THE SERVER")
    }

    ws.on('message', function message(data) {
        const command = JSON.parse(data)
        if(command.commandType === 'MOVE-PLAYER') {
            switch (command.payload.direction) {
                case DIRECTIONS.UP:
                    game[`movePlayer${command.payload.playerNumber}ToUp`]();
                    break;
                case DIRECTIONS.DOWN:
                    game[`movePlayer${command.payload.playerNumber}ToDown`]();
                    break;
                case DIRECTIONS.RIGHT:
                    game[`movePlayer${command.payload.playerNumber}ToRight`]();
                    break;
                case DIRECTIONS.LEFT:
                    game[`movePlayer${command.payload.playerNumber}ToLeft`]();
                    break;

            }
        }
    });

});