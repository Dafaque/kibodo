import View from "./view";

class TextView extends View {
    lines: string[];
    constructor() {
        super();
        this.lines = [];
    }

    renderContent() {
        const text = document.createElement('div');
        text.className = 'text';
        this.lines.forEach(line => {
            const lineElement = document.createElement('div');
            lineElement.textContent = line;
            text.appendChild(lineElement);
        });
        return text;
    }


    addLine(line: string): void {
        this.lines.push(line);
    }

    onDown(): void {
        window.scrollBy(0, 1);
    }

    onUp(): void {
        window.scrollBy(0, -1);
    }

}

export default TextView;