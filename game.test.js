import {Game} from './game.js'
import {EventEmitter} from "./utils/eventEmitter/eventEmitter";

describe('game tests', () => {
    let game;
    beforeEach(() => {
        const eventEmitter = new EventEmitter();
        game = new Game(eventEmitter);
    })
    afterEach(async () => {
        await game.stop();
    })


    test('init test', () => {
        game.settings = {gridSize: {x: 4, y: 5}}
        expect(game.settings.gridSize.x).toBe(4)
        expect(game.settings.gridSize.y).toBe(5)
    })
    test('start game ', async () => {
        game.settings = {gridSize: {x: 4, y: 5}}
        expect(game.status).toBe('pending')
        await game.start()

        expect(game.status).toBe('in-progress')

    })

    test('check players and google init position', async () => {
        for (let i = 0; i <= 10; i++) {
            const eventEmitter = new EventEmitter();
            game = new Game(eventEmitter);
            game.settings = {gridSize: {x: 1, y: 3}}
            await game.start()
            game.players.forEach(p => {
                expect(p.position.x).toBe(1)
                expect([1, 2, 3]).toContain(p.position.y)
            })
            expect(game.players[0].position.y !== game.players[1].position.y &&
                game.players[1].position.y !== game.players[2].position.y
                && game.players[0].position.y !== game.players[2].position.y).toBeTruthy()
            game.stop()
        }
    })
    test('check change of google position after jump', async () => {

        game.settings = {
            gridSize: {x: 1, y: 4},
            googleJumpInterval: 100
        }
        await game.start()

        const prevGooglePosition = game.players[2].position.clone()

        await sleep(150)

        expect(game.players[2].position.equal(prevGooglePosition)).toBeFalsy()
    })
    test('catch google by player1 or player2 in row', async () => {
        for (let i = 0; i <= 10; i++) {
            const eventEmitter = new EventEmitter();
            game = new Game(eventEmitter);
            game.settings = {gridSize: {x: 3, y: 1}}
            await game.start()

            const deltaForPlayer1 = game.players[2].position.x - game.players[0].position.x
            const prevGooglePosition = game.players[2].position.clone()
            if (Math.abs(deltaForPlayer1) === 2) {
                const deltaForPlayer2 = game.players[2].position.x - game.players[1].position.x
                if (deltaForPlayer2 > 0) game.movePlayer2ToRight();
                else game.movePlayer2ToLeft();

                expect(game.players[0].score).toBe(0)
                expect(game.players[1].score).toBe(1)
            } else {
                if (deltaForPlayer1 > 0) game.movePlayer1ToRight();
                else game.movePlayer1ToLeft();
                expect(game.players[0].score).toBe(1)
                expect(game.players[1].score).toBe(0)
            }
            expect(game.players[2].position.equal(prevGooglePosition)).toBeFalsy()
            game.stop()
        }
    })
    test('catch google by player1 or player2 in column', async () => {
        for (let i = 0; i <= 10; i++) {
            const eventEmitter = new EventEmitter();
            game = new Game(eventEmitter);
            game.settings = {gridSize: {x: 1, y: 3}}
            await game.start()

            const deltaForPlayer1 = game.players[2].position.y - game.players[0].position.y
            const prevGooglePosition = game.players[2].position.clone()
            if (Math.abs(deltaForPlayer1) === 2) {
                const deltaForPlayer2 = game.players[2].position.y - game.players[1].position.y
                if (deltaForPlayer2 > 0) game.movePlayer2ToDown();
                else game.movePlayer2ToUp();

                expect(game.players[0].score).toBe(0)
                expect(game.players[1].score).toBe(1)
            } else {
                if (deltaForPlayer1 > 0) game.movePlayer1ToDown();
                else game.movePlayer1ToUp();
                expect(game.players[0].score).toBe(1)
                expect(game.players[1].score).toBe(0)
            }
            expect(game.players[2].position.equal(prevGooglePosition)).toBeFalsy()
            game.stop()
        }
    })
    test('one of players should win', async () => {

        game.settings = {
            gridSize: {y: 3, x: 1},
            pointsForWin: 3
        }
        await game.start()

        const deltaForPlayer1 = game.players[2].position.y - game.players[0].position.y
        if (Math.abs(deltaForPlayer1) === 2) {
            const deltaForPlayer2 = game.players[2].position.y - game.players[1].position.y
            if (deltaForPlayer2 > 0) {
                game.movePlayer2ToDown();
                game.movePlayer2ToUp();
                game.movePlayer2ToDown();
            } else {
                game.movePlayer2ToUp();
                game.movePlayer2ToDown();
                game.movePlayer2ToUp();
            }

            expect(game.players[0].score).toBe(0)
            expect(game.players[1].score).toBe(3)
        } else {
            if (deltaForPlayer1 > 0) {
                game.movePlayer1ToDown();
                game.movePlayer1ToUp();
                game.movePlayer1ToDown();
            } else {
                game.movePlayer1ToUp();
                game.movePlayer1ToDown();
                game.movePlayer1ToUp();
            }
            expect(game.players[0].score).toBe(3)
            expect(game.players[1].score).toBe(0)
            expect(game.status).toBe("finished")
        }
        expect(game.status).toBe("finished")
    })
})

const sleep = ms => new Promise((res) => setTimeout(res, ms))
