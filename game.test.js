import {Game} from './game.js'

describe('game tests', () => {
    test('init test', () => {
        const game = new Game();
        game.settings = {gridSize: {x: 4, y: 5}}
        expect(game.settings.gridSize.x).toBe(4)
        expect(game.settings.gridSize.y).toBe(5)
    })
    test('start game ', async () => {
        const game = new Game();
        game.settings = {gridSize: {x: 4, y: 5}}
        expect(game.status).toBe('pending')
        await game.start()

        expect(game.status).toBe('in-progress')

    })

    test('check players and google init position', async () => {
        for (let i = 0; i <= 10; i++) {
            const game = new Game();
            game.settings = {gridSize: {x: 1, y: 3}}
            game.start()
            console.log(game.players)
            game.players.forEach(p=>{
                expect(p.position.x).toBe(1)
                expect([1, 2, 3]).toContain(p.position.y)
            })
            expect(game.players[0].position.y !== game.players[1].position.y &&
                game.players[1].position.y !== game.players[2].position.y
            && game.players[0].position.y !== game.players[2].position.y).toBeTruthy()
        }
    })
})