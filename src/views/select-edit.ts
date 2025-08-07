import Menu from "./menu";

interface Option {
    label: string;
    value: string;
}

export default class SelectEditView extends Menu {
    menu: Menu | null;
    onSave: ((value: any) => void) | null;

    constructor(name: string, options: Option[] = []) {
        let args = options.map((option) => {
            return {
                label: option.label,
                action: () => {
                    window.app?.pop(option.value);
                },
            };
        });
        super(args);
        this.title = `Edit ${name}`;
    }
}
