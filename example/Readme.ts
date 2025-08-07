import TextView from "../src/views/text";

export default class Readme extends TextView {
    constructor() {
        super();
        this.title = "Readme";
        for (let i = 0; i < 100; i++) {
            this.addLine("Hello, world!");
        }
    }
}