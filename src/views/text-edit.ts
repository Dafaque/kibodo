import View from "./view";

export default class TextEditView extends View {
    value: string;
    placeholder: string;
    field: any;

    constructor(
        args: {field: any, currentValue: string}
    ) {
        super();
        this.field = args.field;
        this.value = args.currentValue;
        this.placeholder = args.field.placeholder;

        this.title = `Edit ${this.field.label}`;
    }

    init(args: {field: any, currentValue: string}) {
        
    }

    renderContent() {
        const container = document.createElement('div');
        container.className = 'text-edit-container';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'text-input';
        input.value = this.value || '';
        input.placeholder = this.placeholder || 'Enter text...';
        
        input.addEventListener('focus', () => {
            input.setSelectionRange(input.value.length, input.value.length);
        });
        
        container.appendChild(input);
        
        setTimeout(() => {
            input.focus();
        }, 100);
        
        return container;
    }

    onSubmit() {
        const input = document.querySelector('.text-input') as HTMLInputElement;
        const value = input.value;
        window.app?.pop(value);
    }
}
