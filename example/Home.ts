import Form from "./Form";
import Menu from "../src/views/menu";
import Readme from "./Readme";

export default class Home extends Menu {
    constructor() {
        super();
        this.title = "Home";
        this.addItem("Form", () => {
            window.app.push(new Form());
        });
        this.addItem("Readme", () => {
            window.app.push(new Readme());
        });
    }
}