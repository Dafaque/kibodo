import View from "./view";

export default class TextView extends View {
    value: string;
    placeholder: string;
    onSave: (value: string) => void;
    field: any;

    constructor(data: any) {
        super();
        this.setTitle(`Edit ${data.field.label}`);
        this.value = data.currentValue;
        this.placeholder = data.field.placeholder;
        this.onSave = data.onSave;
        this.field = data.field;
    }

    renderContent() {
        const container = document.createElement('div');
        container.className = 'text-edit-container';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'text-input';
        input.value = this.value || '';
        input.placeholder = this.placeholder || 'Enter text...';
        
        // Устанавливаем курсор в конец
        input.addEventListener('focus', () => {
            input.setSelectionRange(input.value.length, input.value.length);
        });
        
        container.appendChild(input);
        
        // Фокусируем поле
        setTimeout(() => {
            input.focus();
        }, 100);
        
        return container;
    }

    onKeyDown(e: KeyboardEvent) {
        const input = document.querySelector('.text-input') as HTMLInputElement;
        
        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                this.save();
                break;
                
            case 'Escape':
                e.preventDefault();
                this.goBack();
                break;
        }
    }

    save() {
        const input = document.querySelector('.text-input') as HTMLInputElement;
        const value = input.value;
        
        if (this.onSave) {
            this.onSave(value);
        }
        
        this.goBack();
    }

    cacheable = () => {
        return false;
    }
}
