export class Game {
    #settings = {
        gridSize: {x: 4, y: 5},
        googleJumpInterval: 2000,
        pointsForWin: 10,
        mode: GAME_MODES.CLIENT
    };
    #status = "pending";
    #player1;
    #player2;
    #google;
    #googleJumpIntervalId;
    eventEmitter;
    #eventsFactory;
    #mode;

    constructor(eventEmitter, eventsFactory) {
        this.eventEmitter = eventEmitter;
        this.#eventsFactory = eventsFactory;
    }


    get settings() {
        return this.#settings
    }

    set settings(settings) {
        this.#settings = {...this.#settings, ...settings}
        this.#settings.gridSize = settings.gridSize ? {
                ...this.#settings.gridSize, ...settings.gridSize
            } :
            this.#settings.gridSize
    }

    setGooglePosition(x, y) {
        if (this.#settings.mode !== GAME_MODES.CLIENT) {
            throw new Error("Impossible to control google position")
        }
        this.#google.position = new Position(x, y)
        this.eventEmitter.emit('change', this.#eventsFactory.googleJumped(this.#google.position.x,
            this.#google.position.y))
    }

    set status(status) {
        this.#status = status
    }

    get status() {
        return this.#status
    }

    #getPosition(arrayOfPosition = []) {
        let x;
        let y;
        do {
            x = NumberUtil.getRandomNumber(1, this.#settings.gridSize.x);
            y = NumberUtil.getRandomNumber(1, this.#settings.gridSize.y);
        } while (arrayOfPosition.some(p => p.x === x && p.y === y));

        return new Position(x, y);
    }

    #createUnits() {
        this.#player1 = new Player(1, this.#getPosition()
        );
        this.#player2 = new Player(2,
            this.#getPosition([this.#player1.position])
        );
        this.#google = new Google(
            this.#getPosition([this.#player1.position,
                this.#player2.position])
        );
    }
    #createUnitsForClientsMode() {
        this.#player1 = new Player(1, new Position(1,0));
        this.#player2 = new Player(2, new Position(2,0));
        this.#google = new Google(new Position(3,0))
    }



    async start() {
        if (this.#status === 'pending') {
            if (this.#settings.mode !== GAME_MODES.CLIENT) {
                this.#createUnits()
                this.#runGoogleJumpInterval()
            } else {
                this.#createUnitsForClientsMode()
            }

            this.#status = 'in-progress'
        }


    }

    #runGoogleJumpInterval() {
        this.#googleJumpIntervalId = setInterval(() => {
                this.#google.position = this.#getPosition(
                    [this.#player1.position,
                        this.#player2.position,
                        this.#google.position])
                this.eventEmitter.emit('change', this.#eventsFactory.googleJumped(this.#google.position.x,
                    this.#google.position.y))
            },
            this.#settings.googleJumpInterval)
    }

    async stop() {
        clearInterval(this.#googleJumpIntervalId)
        this.eventEmitter.off()
        this.#status = "stopped"
    }

    async #finish() {
        clearInterval(this.#googleJumpIntervalId)
        this.#status = "finished"
    }

    get players() {
        return [this.#player1, this.#player2, this.#google]
    }

    #movePlayer(delta, movingPlayer, otherPlayer) {
        //delta = {x:1} right {x:-1} left {y:-1} up {y:1} down
        if (this.#checkIsBorders(movingPlayer, delta) ||
            this.#checkIsOtherPlayers(movingPlayer, otherPlayer, delta))
            return;
        if (Object.hasOwn(delta, 'x')) {
            movingPlayer.position.x += delta.x;
        } else {
            movingPlayer.position.y += delta.y;
        }
        this.#checkGoogleCatching(movingPlayer)
        this.eventEmitter.emit('change', this.#eventsFactory.playerMoved(movingPlayer.number, delta))
    }

    #checkIsBorders(player, delta) {
        const copyOfPlayerPosition = player.position.clone()
        if (Object.hasOwn(delta, 'x')) {
            return copyOfPlayerPosition.x + delta.x > this.#settings.gridSize.x ||
                copyOfPlayerPosition.x + delta.x < 1
        } else {
            return copyOfPlayerPosition.y + delta.y > this.#settings.gridSize.y ||
                copyOfPlayerPosition.y + delta.y < 1
        }

    }

    #checkIsOtherPlayers(player, playerForCheck, delta) {
        const copyOfPlayerPosition = player.position.clone()
        const copyOfPlayerPositionForCheck = playerForCheck.position.clone()
        if (Object.hasOwn(delta, 'x')) {
            return copyOfPlayerPosition.x + delta.x === copyOfPlayerPositionForCheck.x &&
                copyOfPlayerPosition.y === copyOfPlayerPositionForCheck.y
        } else {
            return copyOfPlayerPosition.y + delta.y === copyOfPlayerPositionForCheck.y &&
                copyOfPlayerPosition.x === copyOfPlayerPositionForCheck.x
        }
    }

    #checkGoogleCatching(player) {
        if (player.position.equal(this.#google.position)) {
            player.score++;
            this.#google.position = this.#getPosition(
                [this.#player1.position,
                    this.#player2.position,
                    this.#google.position])
            clearInterval(this.#googleJumpIntervalId);
            this.#runGoogleJumpInterval(); // Immediately restart the interval
        }
        if (player.score === this.#settings.pointsForWin) {
            this.#finish();
        }
    }

    movePlayer1ToRight() {
        const delta = {x: 1}
        this.#movePlayer(delta, this.#player1, this.#player2)
    }

    movePlayer1ToLeft() {
        const delta = {x: -1}
        this.#movePlayer(delta, this.#player1, this.#player2)
    }

    movePlayer1ToUp() {
        const delta = {y: -1}
        this.#movePlayer(delta, this.#player1, this.#player2)
    }

    movePlayer1ToDown() {
        const delta = {y: 1}
        this.#movePlayer(delta, this.#player1, this.#player2)
    }

    movePlayer2ToRight() {
        const delta = {x: 1}
        this.#movePlayer(delta, this.#player2, this.#player1)
    }

    movePlayer2ToLeft() {
        const delta = {x: -1}
        this.#movePlayer(delta, this.#player2, this.#player1)
    }

    movePlayer2ToUp() {
        const delta = {y: -1}
        this.#movePlayer(delta, this.#player2, this.#player1)
    }

    movePlayer2ToDown() {
        const delta = {y: 1}
        this.#movePlayer(delta, this.#player2, this.#player1)
    }
}

class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new Position(this.x, this.y)
    }

    equal(otherPosition) {
        return otherPosition.x === this.x && otherPosition.y === this.y
    }

}

class Unit {
    constructor(position) {
        this.position = position
    }
}

class Player extends Unit {
    #score = 0;
    #number = null;

    constructor(number, position) {
        super(position)
        this.#number = number
    }

    get number() {
        return this.#number
    }

    get score() {
        return this.#score
    }

    set score(newScore) {
        this.#score = newScore
    }
}

class Google extends Unit {
    constructor(position) {
        super(position)
    }
}

class NumberUtil {
    static getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

export class EventsFactory {
    playerMoved(playerNumber, delta) {
        let direction;
        if (delta.x && delta.x > 0) {
            direction = DIRECTIONS.RIGHT
        }
        if (delta.x && delta.x < 0) {
            direction = DIRECTIONS.LEFT
        }
        if (delta.y && delta.y > 0) {
            direction = DIRECTIONS.DOWN
        }
        if (delta.y && delta.y < 0) {
            direction = DIRECTIONS.UP
        }
        return {type: `PLAYER/MOVED`, payload: {direction,playerNumber}}
    }


    googleJumped(x, y) {
        return {type: 'GOOGLE/JUMPED', payload: {x, y}}
    }
}

export const DIRECTIONS = {
    UP: "up",
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right",
}

export const GAME_MODES = {
    CLIENT: "client",
    ONLY_CLIENT: "only_client",
    SERVER: "server"
}