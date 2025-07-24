import View from "./view.js";

interface Field {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    readonly: boolean;
    value: string;
    defaultValue: string;
}

export default class Form extends View {
    fields: Record<string, Field>;
    currentFieldIndex: number;
    values: Record<string, string>;
    onSave: ((values: Record<string, string>) => void) | null;

    constructor() {
        super();
        this.fields = {};
        this.currentFieldIndex = 0;
        this.values = {};
        
        // Инициализируем значения
        Object.values(this.fields).forEach(field => {
            this.values[field.name] = field.value || '';
        });
    }


    addField(name: string, label: string, type: string, options: Record<string, any> = {}): void {
        const field = {
            name,
            label,
            type,
            placeholder: options.placeholder,
            readonly: options.readonly || false,
            value: options.value,
            defaultValue: options.defaultValue,
            ...options
        };
        
        this.fields[field.name] = field;
        
        // Устанавливаем defaultValue сразу при добавлении поля
        if (field.defaultValue !== undefined) {
            this.values[field.name] = field.defaultValue;
        } else if (field.value !== undefined) {
            this.values[field.name] = field.value;
        }
    }

    renderContent() {
        const form = document.createElement('form');
        form.className = 'form';
        let firstEditableFieldFound = false;
        Object.values(this.fields).forEach((field, index) => {
            if (!firstEditableFieldFound && !field.readonly) {
                firstEditableFieldFound = true;
                this.currentFieldIndex = index;
            }
            
            const fieldGroup = document.createElement('div');
            fieldGroup.className = 'form-group';
            fieldGroup.dataset.fieldIndex = index.toString();
            
            if (index === this.currentFieldIndex) {
                fieldGroup.classList.add('selected');
                fieldGroup.focus();
            }
            
            if (field.readonly) {
                fieldGroup.classList.add('readonly');
            }
            
            const label = document.createElement('label');
            label.textContent = field.label || field.name;
            fieldGroup.appendChild(label);
            
            if (field.readonly) {
                const value = document.createElement('div');
                value.className = 'field-value readonly';
                value.textContent = this.values[field.name] || field.value || '';
                fieldGroup.appendChild(value);
            } else if (field.type === 'checkbox') {
                const checkbox = document.createElement('div');
                checkbox.className = 'field-value checkbox';
                checkbox.textContent = this.values[field.name] || field.value ? '[X]' : '[ ]';
                checkbox.dataset.fieldName = field.name;
                fieldGroup.appendChild(checkbox);
            } else {
                const value = document.createElement('div');
                value.className = 'field-value';
                value.textContent = this.values[field.name] || field.value || field.placeholder || 'Enter...';
                fieldGroup.appendChild(value);
            }
            
            form.appendChild(fieldGroup);
        });
        
        // Добавляем кнопку Save
        const saveButton = document.createElement('button');
        saveButton.className = 'btn save-button';
        saveButton.textContent = 'Save';
        saveButton.type = 'submit';
        saveButton.dataset.fieldIndex = this.fields.length.toString();
        
        if (this.currentFieldIndex === Object.keys(this.fields).length) {
            saveButton.classList.add('selected');
        }
        
        form.appendChild(saveButton);
        
        return form;
    }

    onUp = () => {
        this.navigateField(-1);
    }
    onDown = () => {
        this.navigateField(1);
    }

    onSubmit() {
        this.save();
    }

    navigateField(direction: number) {
        // Убираем выделение с текущего элемента
        const currentSelected = document.querySelector('.form-group.selected, .save-button.selected');
        if (currentSelected) {
            currentSelected.classList.remove('selected');
        }
        // Вычисляем новый индекс
        let newIndex = this.currentFieldIndex + direction;
        const maxIndex = Object.keys(this.fields).length; // включая кнопку Save
        
        if (newIndex < 0) {
            newIndex = maxIndex;
        } else if (newIndex > maxIndex) {
            newIndex = 0;
        }
        
        // Пропускаем readonly поля при навигации
        if (newIndex <  maxIndex) {
            const field = this.fields[newIndex];
            if (field && field.readonly) {
                // Пропускаем readonly поле
                if (direction > 0) {
                    newIndex++;
                } else {
                    newIndex--;
                }
                // Рекурсивно вызываем для следующего поля
                this.currentFieldIndex = newIndex;
                this.navigateField(direction);
                return;
            }
        }
        
        this.currentFieldIndex = newIndex;
        
        // Выделяем новый элемент
        if (newIndex === maxIndex) {
            // Кнопка Save
            const saveButton = document.querySelector('.save-button');
            if (saveButton) {
                saveButton.classList.add('selected');
            }
        } else {
            // Поле формы
            const fieldGroup = document.querySelector(`[data-field-index="${newIndex}"]`);
            if (fieldGroup) {
                fieldGroup.classList.add('selected');
            }
        }
    }

    handleEnter() { // TODO: Костыль какаой-то
        if (this.currentFieldIndex === Object.keys(this.fields).length) {
            // Кнопка Save
            this.save();
        } else {
            // Поле формы
            
            const field = Object.values(this.fields)[this.currentFieldIndex];
            if (field && !field.readonly) {
                this.editField(field);
            }
        }
    }

    editField(field: Field) {
        if (field.type === 'checkbox') {
            // Переключаем checkbox
            this.values[field.name] = !this.values[field.name] ? 'true' : 'false';
            const checkbox = document.querySelector(`[data-field-name="${field.name}"]`);
            if (checkbox) {
                checkbox.textContent = this.values[field.name] ? '[X]' : '[ ]';
            }
        } else if (field.type === 'select') {
            // Переходим к выбору опции
            const currentPath = window.app.router?.getCurrentPath();
            const selectPath = this.getChildPath(currentPath || "", "select-edit");
            
            window.app?.router?.navigate(selectPath, { // TODO Обычный push
                field: field,
                currentValue: this.values[field.name],
                onSave: (value: any) => {
                    this.values[field.name] = value;
                    this.render();
                }
            });
        } else {
            // Переходим к вводу текста
            const currentPath = window.app?.router?.getCurrentPath();
            const textPath = this.getChildPath(currentPath || "", "text-edit");
            
            window.app?.router?.navigate(textPath, { // TODO Обычный push, нафиг сложную навигацию
                field: field,
                currentValue: this.values[field.name],
                onSave: (value) => {
                    this.values[field.name] = value;
                    this.render();
                }
            });
        }
    }

    getChildPath(parentPath, childSegment) { // TODO Костыль
        if (parentPath === "/") {
            return "/" + childSegment;
        }
        return parentPath + "/" + childSegment;
    }

    save() {
        // Обрабатываем стилизованные checkbox
        const checkboxes = document.querySelectorAll('.checkbox');
        checkboxes.forEach(checkbox => {
            const fieldName = (checkbox as HTMLElement).dataset.fieldName;
            if (fieldName) {
                this.values[fieldName] = (checkbox as HTMLElement).textContent === '[X]' ? 'true' : 'false';
            }
        });
        
        // Вызываем callback если есть
        if (this.onSave) {
            this.onSave(this.values);
        }
    }
}
