import View from "./view.ts";
import SelectEditView from "./select-edit.ts";
import TextEditView from "./text-edit.ts";

enum FieldType {
    TEXT = "text",
    CHECKBOX = "checkbox",
    SELECT = "select",
}

class FieldSelectOption {
    value: string;
    label: string;

    constructor(value: string, label: string) {
        this.value = value;
        this.label = label;
    }
}

class Field {
    name: string;
    label: string;
    type: FieldType;
    placeholder: string;
    readonly: boolean;
    value: string;
    options?: FieldSelectOption[];

    constructor(
        args:{
            name: string,
            label: string,
            type: FieldType,
            placeholder?: string,
            readonly?: boolean,
            value?: string,
            options?: FieldSelectOption[],
        }
    ) {
        this.name = args.name;
        this.label = args.label;
        this.type = args.type;
        this.placeholder = args.placeholder || 'Enter value';
        this.readonly = args.readonly || false;
        this.value = args.value || '';
        this.options = args.options;
    }
}

class Form extends View {
    fields: Record<string, Field>;
    currentFieldIndex: number;
    values: Record<string, string>;
    onSave: ((values: Record<string, string>) => void) | null;

    constructor() {
        super();
        this.fields = {};
        this.currentFieldIndex = 0;
        this.values = {};
        
        Object.values(this.fields).forEach(field => {
            this.values[field.name] = field.value || '';
        });
    }


    addField(field: Field): void {
        this.fields[field.name] = field;
        
        if (field.value !== undefined) {
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
            } else if (field.type === FieldType.CHECKBOX) {
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
                console.log(this.values[field.name], field.value, field.placeholder);
            }
            
            form.appendChild(fieldGroup);
        });
        
        // Добавляем кнопку Save
        const saveButton = document.createElement('button');
        saveButton.className = 'btn save-button';
        saveButton.textContent = 'Save';
        saveButton.type = 'submit';
        saveButton.dataset.fieldIndex = Object.keys(this.fields).toString();
        
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
        this.handleSubmit();
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

    handleSubmit() { // TODO: Костыль какаой-то
        if (this.currentFieldIndex === Object.keys(this.fields).length) {
            this.save();
        } else {
            const field = Object.values(this.fields)[this.currentFieldIndex];
            if (field && !field.readonly) {
                this.editField(field);
            }
        }
    }

    editField(field: Field) {
        if (field.type === FieldType.CHECKBOX) {
            this.values[field.name] = !this.values[field.name] ? 'true' : 'false';
            const checkbox = document.querySelector(`[data-field-name="${field.name}"]`);
            if (checkbox) {
                checkbox.textContent = this.values[field.name] ? '[X]' : '[ ]';
            }
        } else if (field.type === FieldType.SELECT) {
            window.app?.push(
                new SelectEditView(),
                {
                    field: field,
                    currentValue: this.values[field.name],
                },
            ).then((value) => {
                this.values[field.name] = value;
                this.render();
            });
        } else {
            window.app?.push(
                new TextEditView(
                    {
                        field: field,
                        currentValue: this.values[field.name],
                    }
                )
            ).then((value) => {
                if (value === undefined || value === null) { return; }
                this.values[field.name] = value;
                this.render();
            });
        }
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
        
        this.onSave?.(this.values);
    }
}

export { Form, FieldType, Field };