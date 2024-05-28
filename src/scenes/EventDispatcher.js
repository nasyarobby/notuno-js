/**
 * @type {EventDispatcher}
 */
let instance = null;

export const EVENTS = {

}

export default class EventDispatcher extends Phaser.Events.EventEmitter {

    static getE() {
        if(instance === null) {
            instance = new EventDispatcher();
        }
        return instance;
    }
}