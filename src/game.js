import Emitter from './emitter.js';

export default class Game {
    constructor() {
        this.entities = [];
        this.systems = [];
        this.emitter = new Emitter();
    }

    init() {
        this.systems.forEach(system => {
            if (system.init) {
                system.init(this);
            }
        });

        return this;
    }

    addEntity(entity) {
        this.entities.push(entity);
        return this;
    }

    removeEntity(entity) {
        const idx = this.entities.indexOf(entity);

        if (idx >= 0) {
            this.entities.splice(idx, 1);
        }

        return this;
    }

    addSystem(system) {
        this.systems.push(system);
        return this;
    }

    update() {
        this.systems.forEach(system => {
            if (system.update) {
                system.update(this);
            }
        });
    }

    on(...args) {
        this.emitter.on(...args);
        return this;
    }

    trigger(...args) {
        this.emitter.trigger(...args);
        return this;
    }
}
