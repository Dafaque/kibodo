import View from "./views/view";


export default class App {
    view: View | null;
    viewsStack: View[];

    constructor(homeView: View) {
        this.view = homeView;
        this.viewsStack = [homeView];
        this.listenKeyboard();
        window.app = this;
        this.view.render();
    }

    listenKeyboard() {
        document.addEventListener('keydown', (e) => {
           switch (e.key) {
            case 'Escape':
                e.preventDefault();
                this.handleESC();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.view?.onUp();
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.view?.onDown();
                break;
            case 'Enter':
                e.preventDefault();
                this.view?.onSubmit();
                break;
            default:
                this.view?.onKeyDown(e);
           }
        });

    }

    handleESC() {
        this.pop();
    }

    push(view: View, args?: any): Promise<any> {
        return new Promise<any>((resolve) => { 
            this.viewsStack.push(view);
            this.view = view;
            this.view.init(args);
            this.view.render();
            this.view.__popResolver = resolve;
        });
    }

    pop(args?: any) {
        if (this.viewsStack.length === 1) {
            return;
        }
        let v = this.viewsStack.pop();
        v?.destroy();
        v?.__popResolver(args);
        this.view = this.viewsStack[this.viewsStack.length - 1];
        this.view.render();
    }
}