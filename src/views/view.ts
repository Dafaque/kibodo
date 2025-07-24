export default class View {
    container: HTMLElement | null;
    title: string | null;
    error: string | null;

    constructor() {
        this.container = null;
        this.title = null;
        this.error = null;
        // TODO нужно в найти место видимое всегда для юзера, и там оставить лейбл как управлять через клаву/esc/enter

        // TODO нужен терминал-стайл спиннер. Через методы управлять показом спиннера.
    }

    render() {
        // Создаем контейнер
        this.container = document.createElement('div');
        this.container.className = 'view';
        
        // Добавляем заголовок если есть
        if (this.title) {
            const titleElement = document.createElement('h1');
            titleElement.textContent = this.title;
            titleElement.classList.add('title');
            this.container?.appendChild(titleElement);
        }

        var content: HTMLElement | null = null;
        if (this.error) {
            content = this.renderError();
        } else {
            content = this.renderContent();
        }
        
        // Рендерим содержимое
        if (content) {
            this.container?.appendChild(content);
        }
        
        // Заменяем содержимое app
        const appElement = document.getElementById('app');
        if (appElement) {
            appElement.innerHTML = '';
            appElement.appendChild(this.container);
        }
        
        return this.container;
    }

    renderContent():HTMLElement | null {
        // Переопределяется в наследниках
        return null;
    }

    renderError():HTMLElement {
        const error = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.textContent = this.error;
        error.appendChild(legend);
        const message = document.createElement('pre');
        message.textContent = this.error;
        error.appendChild(message);
        return error;
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




    // MARK: - V2
    // init view with arguments
    init(args: any): void {
        // Переопределяется в наследниках
    }

    // free resources when view exits
    destroy(): void {
        // Переопределяется в наследниках
    }

    // MARK: ActionsDelegate

    onUp() {}
    onDown() {}
    onLeft() {}
    onRight() {}
    onSubmit() {}
}
 