import { Menu, View } from "../src";

class View2 extends Menu {
    constructor() {
        super();
    }

    init(args: any): void {
        super.init(args);

        fetch("https://jsonplaceholder.typicode.com/posts/1")
            .then(response => response.json())
            .then(json => {
                window.app.pop(true);
            });

    }
}

export default View2;