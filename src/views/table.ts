import View from "./view";

interface DataSource {
    // Fetch data from url
    url: string;
    // Headers to send with the request;
    urlHeaders?: Record<string, string>;
    // Attribute in response that represents the data
    attr: string;
}

export default class Table extends View {
    dataSource?: DataSource;
    data: any[];
    selectedRow: number;
    loading: boolean;

    constructor(dataSource: DataSource = null) {
        super();
        this.dataSource = dataSource;
        this.data = [];
        this.selectedRow = 0;
        this.fetchData();
    }

    setData(data: any[]) {
        this.data = data;
    }

    renderContent() {
        const container = document.createElement('div');
        container.className = 'table';
        if (this.loading) {
            const loading = document.createElement('div');
            loading.className = 'loading';
            loading.textContent = 'Loading...';
            container.appendChild(loading);
            return container;
        }
        
        if (this.data === undefined || this.data.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = 'No data available';
            container.appendChild(emptyMessage);
            return container;
        }
        
        // Создаем таблицу
        const table = document.createElement('table');
        table.classList.add('terminal-table');
        
        // Заголовки
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        const headers = Object.keys(this.data[0]);
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Данные
        const tbody = document.createElement('tbody');
        
        this.data.forEach((row, rowIndex) => {
            const tr = document.createElement('tr');
            
            if (rowIndex === this.selectedRow) {
                tr.classList.add('selected');
            }
            
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = row[header];
                tr.appendChild(td);
            });
            
            tbody.appendChild(tr);
        });
        
        table.appendChild(tbody);
        container.appendChild(table);
        
        return container;
    }

    onUp() {
        this.selectedRow = Math.max(0, this.selectedRow - 1);
        this.updateSelection();
    }
    onDown() {
        this.selectedRow = Math.min(this.data.length - 1, this.selectedRow + 1);
        this.updateSelection();
    }
    onSubmit() {
        this.selectCurrentRow();
    }

    updateSelection() {
        const rows = document.querySelectorAll('tbody tr');
        rows.forEach((row, index) => {
            if (index === this.selectedRow) {
                row.classList.add('selected');
            } else {
                row.classList.remove('selected');
            }
        });
    }

    selectCurrentRow() {
        if (this.data.length > 0 && this.onSelected) {
            const selectedData = this.data[this.selectedRow];
            this.onSelected(selectedData);
        }
    }

    onSelected(data: any) {}

    async fetchData() {
        if (!this.dataSource) {return;}
        this.loading = true;
        this.render();
        fetch(this.dataSource.url, {
            headers: this.dataSource.urlHeaders,
        })
        .then(response => response.json())
        .then(data => {
            if (!Object.hasOwn(data, this.dataSource.attr)) {
                throw new Error('Response does not contain property <' + this.dataSource.attr + '>');
            }
            this.data = data[this.dataSource.attr];
        })
        .then(() => {
            this.loading = false;
            this.render();
        }).catch(error => {
            this.loading = false;
            this.error = error.message;
            this.render();
        });
    }
}
