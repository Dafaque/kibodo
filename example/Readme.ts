import TextView from "../src/views/text";

export default class Readme extends TextView {
    constructor() {
        let lines = [];
        for (let i = 0; i < 100; i++) {
            lines.push("Hello, world!");
        }   
        super(lines);
        this.title = "Readme view example";
    }
}