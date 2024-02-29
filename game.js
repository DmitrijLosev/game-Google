export class Game {
    #settings;
    #status = "pending";
    #player1;
    #player2;
    #google;

    constructor() {

    }


    get settings() {
        return this.#settings
    }

    set settings(settings) {
        if(settings.gridSize.x * settings.gridSize.y < 2){
            throw new Error("Cells count should be more than 1")
        }
        this.#settings = settings
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

    #createPlayers() {
        this.#player1 = new Player(this.#getPosition()
        );
        this.#player2 = new Player(
            this.#getPosition([this.#player1.position])
        );
        this.#google = new Google(
            this.#getPosition([this.#player1.position,
                this.#player2.position])
        );
    }


    start() {
        if (this.#status === 'pending') {
            this.#createPlayers()
            this.#status = 'in-progress'
        }
    }

    get players() {
        return [this.#player1, this.#player2, this.#google]
    }

}

class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class Unit {
    constructor(position) {
        this.position = position
    }
}
class Player extends Unit {
    constructor(position) {
        super(position)
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