import {Form, FieldType} from "../src/views/form";

export default class FormView extends Form {
    constructor() {
        super([
            {
                name: "id",
                label: "ID",
                type: FieldType.TEXT,
                value: "1234567890",
                readonly: true,
            },
            {
                name: "name",
                label: "Name",
                type: FieldType.TEXT,
            },
            {
                name: "email",
                label: "Email",
                type: FieldType.TEXT,
                value: "admin@example.com",
            },
            {
                name: "os",
                label: "Operating System",
                type: FieldType.SELECT,
                options: [
                    {
                        label: "Windows",
                        value: "windows"
                    },
                    {
                        label: "Linux",
                        value: "linux"
                    },
                    {
                        label: "MacOS",
                        value: "macos"
                    },
                ]
            },
            {
                name: "gender",
                label: "Gender",
                type: FieldType.SELECT,
                value: "male",
                options: [
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                ]
            },
            {
                name: "usesKibodoFramework",
                label: "Uses Kibodo Framework",
                type: FieldType.CHECKBOX,
                value: true,
            }
        ]);
        this.title = "Form view example";
    }
    onSave = console.log;
}