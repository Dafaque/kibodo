import View from "./view";
import SelectEditView from "./select-edit";
import TextEditView from "./text-edit";

enum FieldType {
    TEXT = 0,
    CHECKBOX = 1,
    SELECT = 2,
}

interface FieldSelectOption {
    value: string;
    label: string;
}

interface Field {
    name: string;
    label: string;
    type: FieldType;
    placeholder?: string;
    value?: string | boolean;
    readonly?: boolean;
    options?: FieldSelectOption[];
}

class Form extends View {
    fields: Field[];
    currentFieldIndex: number;
    onSave: ((values: Record<string, string>) => void) | null;

    constructor(fields: Field[] = []) {
        super();
        this.fields = fields;
        this.currentFieldIndex = 0;
    }


    addField(field: Field): void {
        this.fields.push(field);
        this.render();
    }

    renderContent() {
        const form = document.createElement('form');
        form.className = 'form';
        let firstEditableFieldFound = false;
        this.fields.forEach((field, index) => {
            if (!firstEditableFieldFound && field.readonly === undefined) {
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
            
            if (field.type === FieldType.CHECKBOX) {
                const checkbox = document.createElement('div');
                checkbox.className = 'field-value checkbox';
                checkbox.textContent = field.value ? '[X]' : '[ ]';
                checkbox.dataset.fieldName = field.name;
                fieldGroup.appendChild(checkbox);
            } else if (field.type === FieldType.SELECT) {
                const value = document.createElement('div');
                value.className = 'field-value';
                const selectedOption = field.options?.find(option => option.value === field.value);
                value.textContent = selectedOption?.label || field.placeholder || 'Select...';
                fieldGroup.appendChild(value);
            } else {
                const value = document.createElement('div');
                value.className = 'field-value';
                value.textContent = field.value?.toString() || field.placeholder || 'Enter...';
                fieldGroup.appendChild(value);
            }
            
            form.appendChild(fieldGroup);
        });
        
        const saveButton = document.createElement('button');
        saveButton.className = 'btn save-button';
        saveButton.textContent = 'Save';
        saveButton.type = 'submit';
        saveButton.dataset.fieldIndex = this.fields.length.toString();
        
        if (this.currentFieldIndex === this.fields.length) {
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

    navigateField(direction: number) {
        const currentSelected = document.querySelector('.form-group.selected, .save-button.selected');
        if (currentSelected) {
            currentSelected.classList.remove('selected');
        }
        let newIndex = this.currentFieldIndex + direction;
        const maxIndex = this.fields.length;
        
        if (newIndex < 0) {
            newIndex = maxIndex;
        } else if (newIndex > maxIndex) {
            newIndex = 0;
        }
        
        if (newIndex <  maxIndex) {
            const field = this.fields[newIndex];
            if (field && field.readonly) {
                if (direction > 0) {
                    newIndex++;
                } else {
                    newIndex--;
                }
                this.currentFieldIndex = newIndex;
                this.navigateField(direction);
                return;
            }
        }
        
        this.currentFieldIndex = newIndex;
        
        if (newIndex === maxIndex) {
            const saveButton = document.querySelector('.save-button');
            if (saveButton) {
                saveButton.classList.add('selected');
            }
        } else {
            const fieldGroup = document.querySelector(`[data-field-index="${newIndex}"]`);
            if (fieldGroup) {
                fieldGroup.classList.add('selected');
            }
        }
    }

    onSubmit() { // TODO: Костыль какаой-то
        if (this.currentFieldIndex === this.fields.length) {
            this.save();
        } else {
            const field = this.fields[this.currentFieldIndex];
            if (field && !field.readonly) {
                this.editField(field);
            }
        }
    }

    editField(field: Field) {
        if (field.type === FieldType.CHECKBOX) {
            console.log('checkbox', field.value);
            field.value = field.value == 'true' ? 'false' : 'true';
            const checkbox = document.querySelector(`[data-field-name="${field.name}"]`);
            if (checkbox) {
                checkbox.textContent = field.value == 'true' ? '[X]' : '[ ]';
            }
        } else if (field.type === FieldType.SELECT) {
            window.app?.push(
                new SelectEditView(field.name, field.options),
            ).then((value) => {
                if (value === undefined || value === null) { return; }
                field.value = value;
                this.render();
            });
        } else {
            window.app?.push(
                new TextEditView(
                    {
                        field: field,
                        currentValue: field.value?.toString() || '',
                    }
                )
            ).then((value) => {
                if (value === undefined || value === null) { return; }
                field.value = value;
                this.render();
            });
        }
    }

    save() {
        let values = {};
        this.fields.forEach(field => {
            if (field.type === FieldType.CHECKBOX) {
                values[field.name] = field.value === 'true' ? true : false;
            } else {
                values[field.name] = field.value;
            }
        });
        
        this.onSave?.(values);
    }
}

export { Form, FieldType };