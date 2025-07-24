import View from "./views/view";


export default class App {
    view: View | null;
    viewsStack: View[];

    constructor(homeView: View) {
        this.view = homeView;
        this.viewsStack = [homeView];
        this.listenKeyboard();
        window.app = this;
    }

    listenKeyboard() {
        document.addEventListener('keydown', (e) => {
            e.preventDefault();
           switch (e.key) {
            case 'Escape':
                this.handleESC();
                break;
            case 'ArrowUp':
                this.view?.onUp();
                break;
            case 'ArrowDown':
                this.view?.onDown();
                break;
            case 'Enter':
                this.view?.onSubmit();
                break;
            default:
                this.handleKeyEvent(e);
           }
        });

    }

    handleKeyEvent(e: KeyboardEvent) {
        
    }

    handleESC() {
        this.pop();
    }
    
    setView(view: View | null) {
        this.view = view;
    }

    //! ВЬЮ ПОДИСЫВАЕТСЯ НА ПУШ ЕСЛИ ОЧЕТ ВИДЕТЬ ИЗМЕНЕНИЯ ВО ЬЮ В РЕЗУЛЬТАТЕ POP
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

    //! ВОЗВРАЩАЕМ ДАННЫЕ ЕСЛИ РОДИТЕЛЬСКОЕ ВЬЮ ОЖИДАЕТ ИЗМЕНЕНИЯ
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