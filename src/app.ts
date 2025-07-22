import Router from "./router";
import View from "./views/view";

declare global {
    interface Window {
        app: App;
    }
}

export default class App {
    currentView: View | null;
    router: Router | null;

    constructor() {
        this.currentView = null;
        this.router = null;
        
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