import Table from "../src/views/table";

export default class TableView extends Table {
    constructor() {
        super({
            url: "https://reqres.in/api/users",
            attr: "data",
            urlHeaders: {
                "x-api-key": "reqres-free-v1",
            },
        });
        this.title = "Table view example";
    }
    onSelected = console.log;
}