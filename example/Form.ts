import {Form, FieldType} from "../src/views/form";

export default class FormView extends Form {
    constructor() {
        super([
            {
                name: "name",
                label: "Name",
                type: FieldType.TEXT,
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
                name: "usesKibodoFramework",
                label: "Uses Kibodo Framework",
                type: FieldType.CHECKBOX,
            }
        ]);
    }
    onSave = console.log;
}