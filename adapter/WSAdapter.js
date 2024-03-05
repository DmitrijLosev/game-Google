import {EventEmitter} from "../utils/eventEmitter/eventEmitter.js";

export class WSAdapter extends EventEmitter {
    #socket

    constructor(ws) {
        super()
        this.#socket = ws
        this.#socket.onmessage = (e)=> {
            const event = JSON.parse(e.data)
            this.emit('new-message', event)
        };
    }

    send(data) {
        if (this.#socket.readyState === WebSocket.OPEN) {
            this.#socket.send(JSON.stringify(data));
        } else {
            console.error('WebSocket connection is not open.');
        }
    }
    /*send(data) {
        this.#socket.send(JSON.stringify(data))
    }
*/
}