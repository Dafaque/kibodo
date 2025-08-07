import Form from "./Form";
import Menu from "../src/views/menu";
import Readme from "./Readme";
import TableView from "./Table";
import ErrorView from "./Error";

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
                },
                {
                    label: "Table",
                    action: () => {
                        window.app.push(new TableView());
                    }
                },
                {
                    label: "Error",
                    action: () => {
                        window.app.push(new ErrorView());
                    }
                }   
            ]
        );
        this.title = "Menu view example";

    }
}