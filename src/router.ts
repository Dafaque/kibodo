import View from "./views/view";
import TextView from "./views/text-view";
import SelectView from "./views/select-view";

class Router {
    routes: Map<string, any>;
    views: Map<string, any>;
    currentView: View | null;
    currentPath: string | null;

    constructor() {
        this.routes = new Map();
        this.views = new Map();
        this.currentView = null;
        this.currentPath = null;
    }

    register(path, ViewClass) {
        this.routes.set(path, ViewClass);
        
        // Автоматически регистрируем маршруты для редактирования
        this.registerEditRoutes(path, ViewClass);
    }

    // Автоматически регистрируем маршруты для редактирования
    registerEditRoutes(path: string, ViewClass: any) {
        // Импортируем view'ы для редактирования
        const textPath = this.getChildPath(path, "text-edit");
        this.routes.set(textPath, TextView);
        
        const selectPath = this.getChildPath(path, "select-edit");
        this.routes.set(selectPath, SelectView);
    }

    // Получить дочерний путь
    getChildPath(parentPath: string, childSegment: string) {
        if (parentPath === "/") {
            return "/" + childSegment;
        }
        return parentPath + "/" + childSegment;
    }

    navigate(path: string, data: any = null) {
        console.log(`Navigating to: ${path}`);
        
        // Проверяем, есть ли уже созданный view для этого пути
        if (!this.views.has(path)) {
            // Создаем новый view
            const ViewClass = this.routes.get(path);
            if (!ViewClass) {
                console.error(`Route not found: ${path}`);
                return;
            }
            
            this.currentView = new ViewClass(data);
            if (this.currentView?.cacheable()) {
                this.views.set(path, this.currentView);
            }
            
        } else {
            this.currentView = this.views.get(path);
        }

        window.app?.setCurrentView(this.currentView);
        // Delegate to APP
        this.currentView?.render();
        this.currentPath = path;
        this.currentView?.appear(data);
    }

    getCurrentView(): View | null {
        return this.currentView;
    }

    getCurrentPath(): string | null {
        return this.currentPath;
    }
}

export default Router; 