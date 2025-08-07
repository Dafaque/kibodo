import Menu from "./menu";

export default class SelectEditView extends Menu {
    menu: Menu | null;
    onSave: ((value: any) => void) | null;

    constructor() {
        super();
        this.menu = null;
        this.onSave = null;
    }

    renderContent() {
        const container = document.createElement('div');
        container.className = 'select-view';
        
        const field = this.data?.field;
        const currentValue = this.data?.currentValue;
        
        if (!field || !field.choices) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'No choices available';
            container.appendChild(errorMessage);
            return container;
        }
        
        // Создаем меню из choices
        const menuOptions = field.choices.map(choice => ({
            label: choice.text || choice.label,
            action: () => {
                if (this.data?.onSave) {
                    this.data.onSave(choice.value);
                }
                this.goBack();
            }
        }));
        
        this.menu = new Menu(menuOptions);
        const menuElement = this.menu.render();
        container.appendChild(menuElement);
        
        return container;
    }

    onKeyDown(e: KeyboardEvent) {
        if (this.menu) {
            this.menu.onKeyDown(e);
        }
    }

    cacheable = () => {
        return false;
    }
}
