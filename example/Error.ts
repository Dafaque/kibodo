import View from "../src/views/view";

export default class ErrorView extends View {
    constructor() {
        super();
        this.error = "Something unexpected happened";
        this.title = "Error view example";
    }
}