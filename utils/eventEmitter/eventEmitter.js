export class EventEmitter {
    #subscribers;
    constructor() {
        this.#subscribers = {};
    }
    addEventListener(eventName, observer) {
        return this.subscribe(eventName, observer)
    }

    on(eventName, observer) {
        return this.subscribe(eventName, observer)
    }

    #removeSubscriber(eventName, observer) {
        this.#subscribers[eventName] =
            this.#subscribers[eventName]?.filter(o => o !== observer)
    }
    off(eventName, observer) {
        this.#removeSubscriber(eventName, observer)
    }

    subscribe(eventName, observer) {
        if (!this.#subscribers[eventName]) {
            this.#subscribers[eventName] = []
        }
        this.#subscribers[eventName].push(observer)
        return ()=>{
            this.#removeSubscriber(eventName, observer)
        }
    }

    emit(eventName, data = null) {//уведомить
        this.#subscribers[eventName]?.forEach(subscriber => {
            subscriber(data)
        })
    }
}