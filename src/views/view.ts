export default class View {
    data: any;
    container: HTMLElement | null;
    title: string | null;
    error: string | null;

    constructor() {
        this.data = null;
        this.container = null;
        this.title = null;
        // TODO нужен дефолтный атрибут error, котрый если не null будет вместо renderContent рендерить бокс с ошибкой а-ля алерт. В фреймворке не простых элементов для текста, надо чё-то придумать.

        // TODO нужно в найти место видимое всегда для юзера, и там оставить лейбл как управлять через клаву/esc/enter

        // TODO нужен терминал-стайл спиннер. Через методы управлять показом спиннера.
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
 