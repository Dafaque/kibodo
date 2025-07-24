import { Menu } from "../src";
import View2 from "./view2";


class Home extends Menu {
    constructor() {
        super();

        this.addItem("Order delete", () => {
            window.app.push(
                new View2(),
                123
            ).then(this.onView1Return);
        });
    }

    init(args: any): void {
        super.init(args);
    }

    onView1Return(args: boolean): void {
        if (args ) {
            console.log("DELETED")
            return
        }
        console.log("NOT DELETED")
    }
}

export default Home;