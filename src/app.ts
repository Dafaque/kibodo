import Router from "./router";
import View from "./views/view";

declare global {
    interface Window {
        app: App; // TODO: костыль, сделать нормально через статичесий синглтон или еще как
    }
}

export default class App {
    currentView: View | null;
    router: Router | null;

    constructor() {
        this.currentView = null;
        this.router = null;
        
        // TODO нафиг делегирование события. В currentView просто вызываем onUpPressed, onDown..... В фрейме 6 клавиш, больше не будет.
        // Глобальный обработчик ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                if (this.currentView && this.currentView.goBack) {
                    this.currentView.goBack();
                }
            }
        });
        
        // Проксирование событий в currentView
        document.addEventListener('keydown', (e) => {
            if (this.currentView && this.currentView.onKeyDown) {
                this.currentView.onKeyDown(e);
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (this.currentView && this.currentView.onKeyUp) {
                this.currentView.onKeyUp(e);
            }
        });
        
        document.addEventListener('submit', (e) => {
            if (this.currentView && this.currentView.onSubmit) {
                this.currentView.onSubmit(e);
            }
        });
        window.app = this;
    }
    
    setCurrentView(view: View | null) {
        this.currentView = view;
    }
    
    setRouter(router: Router) {
        this.router = router;
    }
}