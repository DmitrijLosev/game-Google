import {DIRECTIONS} from "../game.js";


export class Controller1 {
    #game
    #wsAdapter

    constructor(game, wsAdapter) {
        this.#game = game
        this.#wsAdapter = wsAdapter
        this.#wsAdapter.subscribe('new-message', (event) => {
            if (event.type === 'GOOGLE/JUMPED') {
                this.#game.setGooglePosition(event.payload.x, event.payload.y)
            }
            if (event.type === `PLAYER/MOVED`) {
                this.#reallyMovePlayer(event.payload.direction,event.payload.playerNumber)
            }
        })
    }

    movePlayer(direction, playerNumber) {
        this.#wsAdapter.send({
            commandType: 'MOVE-PLAYER',
            payload:{direction,playerNumber}
        })
    }

    #reallyMovePlayer(direction, playerNumber) {
        switch (direction) {
            case DIRECTIONS.UP:
                this.#game[`movePlayer${playerNumber}ToUp`]();
                break;
            case DIRECTIONS.DOWN:
                this.#game[`movePlayer${playerNumber}ToDown`]();
                break;
            case DIRECTIONS.RIGHT:
                this.#game[`movePlayer${playerNumber}ToRight`]();
                break;
            case DIRECTIONS.LEFT:
                this.#game[`movePlayer${playerNumber}ToLeft`]();
                break;

        }
    }

}