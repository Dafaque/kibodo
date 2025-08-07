export default class View {

    __popResolver: (value: any) => void;
    container: HTMLElement | null;
    title: string | null;
    error: string | null;

    constructor() {}

    render() {
        this.container = document.createElement('div');
        this.container.className = 'view';

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
        
        if (content) {
            this.container?.appendChild(content);
        }
        
        const appElement = document.getElementById('app');
        if (appElement) {
            appElement.innerHTML = '';
            appElement.appendChild(this.container);
        }
        
        return this.container;
    }

    renderContent():HTMLElement | null {
        return null;
    }

    renderError():HTMLElement {
        const error = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.textContent = "Error";
        error.appendChild(legend);
        const message = document.createElement('pre');
        message.textContent = this.error;
        error.appendChild(message);
        error.classList.add('error-container');
        return error;
    }

    // MARK: - V2
    // init view with arguments
    init(args: any): void {}

    // free resources when view exits
    destroy(): void {}

    // MARK: ActionsDelegate

    onUp() {}
    onDown() {}
    onLeft() {}
    onRight() {}
    onSubmit() {}
    onKeyDown(e: KeyboardEvent) {}
}
 