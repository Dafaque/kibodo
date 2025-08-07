import Form from "./Form";
import Menu from "../src/views/menu";
import Readme from "./Readme";

export default class Home extends Menu {
    constructor() {
        super(
            [
                {
                    label: "Form",
                    action: () => {
                        window.app.push(new Form());
                    }
                },
                {
                    label: "Readme",
                    action: () => {
                        window.app.push(new Readme());
                    }
                }
            ]
        );
        this.title = "Home";

    }
}