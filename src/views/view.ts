export default class View {
    data: any;
    container: HTMLElement | null;
    title: string | null;

    constructor() {
        this.data = null;
        this.container = null;
        this.title = null; // Автоматический title
    }

    setTitle(title: string) {
        this.title = title;
    }

    render() {
        // Создаем контейнер
        this.container = document.createElement('div');
        this.container.className = 'view';
        
        // Устанавливаем title из data если он есть
        if (this.data?.field?.label) {
            this.title = this.data.field.label;
        }
        
        // Добавляем заголовок если есть
        if (this.title) {
            const titleElement = document.createElement('h1');
            titleElement.textContent = this.title;
            titleElement.classList.add('title');
            this.container?.appendChild(titleElement);
        }
        
        // Рендерим содержимое
        const child = this.renderContent();
        if (child != null && child != undefined) {
            this.container?.appendChild(child);
        }
        
        // Заменяем содержимое app
        const appElement = document.getElementById('app');
        if (appElement) {
            appElement.innerHTML = '';
            appElement.appendChild(this.container);
        }
        
        return this.container;
    }

    renderContent() {
        // Переопределяется в наследниках
    }

    goBack() {
        if (window.app && window.app.router) {
            const currentPath = window.app.router.getCurrentPath();
            const parentPath = this.getParentPath(currentPath || "");
            if (parentPath) {
                window.app.router.navigate(parentPath);
            }
        }
    }

    getParentPath(path: string) {
        const parts = path.split('/').filter(part => part);
        if (parts.length === 0) {
            return null;
        }
        parts.pop();
        if (parts.length === 0) {
            return "/";
        }
        return "/" + parts.join("/");
    }

    // Методы для обработки событий (переопределяются в наследниках)
    onKeyDown(e: KeyboardEvent) {
        // Переопределяется в наследниках
    }

    onKeyUp(e: KeyboardEvent) {
        // Переопределяется в наследниках
    }

    onSubmit(e: Event) {
        // Переопределяется в наследниках
    }

    // Не кэшировать вью
    cacheable() {
        return true;
    }

    // Вью показана
    appear(args: any) {}
}
 