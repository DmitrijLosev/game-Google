import {DIRECTIONS} from "./game.js";

export class GameViewComponent {
    #table;
    #resultDiv;
    #game;
    #controller;
    #unBindEventListeners = null;

    constructor(controller, game) {
        this.#resultDiv = document.getElementById("game-results");
        this.#table = document.getElementById("game-grid");
        this.#game = game
        this.#controller = controller
        game.eventEmitter.on('change', () => {
            this.render();
        })
    }

    #bindEventListeners() {
        if(this.#unBindEventListeners !== null) {
            this.#unBindEventListeners()
        }

        const handlers = {
            "ArrowUp":()=>this.#controller.movePlayer(DIRECTIONS.UP, 1),
            "ArrowDown":()=>this.#controller.movePlayer(DIRECTIONS.DOWN, 1),
            "ArrowRight": ()=>this.#controller.movePlayer(DIRECTIONS.RIGHT, 1),
            "ArrowLeft": ()=>this.#controller.movePlayer(DIRECTIONS.LEFT, 1),
            "KeyW": ()=>this.#controller.movePlayer(DIRECTIONS.UP, 2),
            "KeyS": ()=>this.#controller.movePlayer(DIRECTIONS.DOWN, 2),
            "KeyD": ()=>this.#controller.movePlayer(DIRECTIONS.RIGHT, 2),
            "KeyA": ()=>this.#controller.movePlayer(DIRECTIONS.LEFT, 2)
        }


        const bindPlayerControls = (e)=>{
            const handler = handlers[e.code];
            if(handler) {
                handler()
            }
        }

        window.addEventListener('keydown', bindPlayerControls)
        window.addEventListener('keydown', bindPlayerControls)
        this.#unBindEventListeners = () =>{
            window.removeEventListener('keydown', bindPlayerControls)
            window.removeEventListener('keydown', bindPlayerControls)
        }
    }


    render() {
        this.#table.innerHTML = '';
        this.#resultDiv.innerHTML = '';
        this.#resultDiv.textContent = this.#game.players[0].score.toString() + "-" + this.#game.players[1].score.toString()
        for (let y = 1; y <= this.#game.settings.gridSize.y; y++) {
            const tr = document.createElement("tr")
            for (let x = 1; x <= this.#game.settings.gridSize.x; x++) {
                const td = document.createElement("td")
                if (x === this.#game.players[0].position.x && y === this.#game.players[0].position.y) {
                    const img = document.createElement("img")
                    img.setAttribute("src", "./assets/player1.svg");
                    img.setAttribute("alt", "player1 here");
                    td.append(img)
                }
                if (x === this.#game.players[1].position.x && y === this.#game.players[1].position.y) {
                    const img = document.createElement("img")
                    img.setAttribute("src", "./assets/player2.svg");
                    img.setAttribute("alt", "player2 here");
                    td.append(img)
                }
                if (x === this.#game.players[2].position.x && y === this.#game.players[2].position.y) {
                    const img = document.createElement("img")
                    img.setAttribute("src", "./assets/google.svg");
                    img.setAttribute("alt", "google here");
                    td.append(img)
                }
                tr.append(td)
            }
            this.#table.append(tr)
        }
        this.#bindEventListeners()
    }
}






