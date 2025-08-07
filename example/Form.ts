import {Form, FieldType, Field} from "../src/views/form";

export default class FormView extends Form {
    constructor() {
        super();

        this.addField(
            new Field(
                {
                    name: "name",
                    label: "Name",
                    type: FieldType.TEXT,
                    placeholder: "Enter your name",
                    value: "John Doe"
                }
            )
        )
    }
}