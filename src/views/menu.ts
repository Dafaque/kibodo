import View from "./view";

interface Option {
    label: string;
    action: () => void;
}

export default class Menu extends View {
    options: any[];
    selectedIndex: number;

    constructor() {
        super();
        this.options = [];
        this.selectedIndex = 0;
    }

    addItem(text: string, action: () => void) {
        this.options.push({ label: text, action });
        this.render();
    }

    renderContent() {
        const container = document.createElement('div');
        container.className = 'menu';
        
        this.options.forEach((option, index) => {
            const item = document.createElement('div');
            item.className = 'menu-item';
            if (index === this.selectedIndex) {
                item.classList.add('selected');
            }
            
            item.textContent = option.label || option;
            item.dataset.index = index.toString();
            
            if (option.action) {
                item.dataset.action = option.action;
            }
            
            container.appendChild(item);
        });
        
        return container;
    }

    onUp = () => {
        this.selectedIndex = Math.max(0, this.selectedIndex - 1);
        this.updateSelection();
    }
    onDown = () => {
        this.selectedIndex = Math.min(this.options.length - 1, this.selectedIndex + 1);
        this.updateSelection();
    }
    onSubmit = () => {
        this.selectCurrent();
    }

    updateSelection() {
        const items = document.querySelectorAll('.menu-item');
        items.forEach((item, index) => {
            if (index === this.selectedIndex) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    selectCurrent() {
        const option = this.options[this.selectedIndex];
        if (option && option.action) {
            option.action();
        }
    }
}
