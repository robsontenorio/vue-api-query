import Errors from "./Errors";

export default class FormTools {
    constructor () {
        this.busy = false
        this.errors = new Errors()
    }
    startProcessing () {
        this.errors.clear()
        this.busy = true
    }
    onKeydown (event) {
        if (event.target.name) {
            this.errors.clear(event.target.name)
        }
    }
}