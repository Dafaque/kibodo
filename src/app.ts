import View from "./views/view";


export default class App {
    view: View | null;
    viewsStack: View[];

    constructor(homeView: View) {
        this.view = homeView;
        this.viewsStack = [homeView];
        // TODO нафиг делегирование события. В currentView просто вызываем onUpPressed, onDown..... В фрейме 6 клавиш, больше не будет.
        // Глобальный обработчик ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                if (this.view && this.view.goBack) {
                    this.view.goBack();
                }
            }
        });
        
        // Проксирование событий в currentView
        document.addEventListener('keydown', (e) => {
            if (this.view && this.view.onKeyDown) {
                this.view.onKeyDown(e);
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (this.view && this.view.onKeyUp) {
                this.view.onKeyUp(e);
            }
        });
        
        document.addEventListener('submit', (e) => {
            if (this.view && this.view.onSubmit) {
                this.view.onSubmit(e);
            }
        });
        window.app = this;
    }
    
    setView(view: View | null) {
        this.view = view;
    }

    push(view: View, args?: any): Promise<any> {
        let callback = new Promise((resolve, reject) => { 
            this.viewsStack.push(view);
            this.view = view;
            this.view.init(args);
            this.view.render();
            return resolve(this.view);
            
        });
        return callback;
    }

    pop(args?: any) {
        if (this.viewsStack.length === 1) {
            return;
        }
        let v = this.viewsStack.pop();
        v?.destroy();
        this.view = this.viewsStack[this.viewsStack.length - 1];
        this.view.render();
    }
}