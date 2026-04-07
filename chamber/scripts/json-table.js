const fileInput = document.getElementById('json-file');
const textInput = document.getElementById('json-input');
const parseButton = document.getElementById('parse-btn');
const clearButton = document.getElementById('clear-btn');
const copyButton = document.getElementById('copy-btn');
const downloadButton = document.getElementById('download-btn');
const tableContainer = document.getElementById('table-container');
const statusText = document.getElementById('status');
const rowCount = document.getElementById('row-count');
const columnCount = document.getElementById('column-count');

let currentTable = {
    columns: [],
    rows: []
};

const setStatus = (message, isError = false) => {
    statusText.textContent = message;
    statusText.style.color = isError ? '#a32121' : '#1b6192';
};

const resetTableState = () => {
    currentTable = { columns: [], rows: [] };
    tableContainer.innerHTML = '';
    rowCount.textContent = '0';
    columnCount.textContent = '0';
    copyButton.disabled = true;
    downloadButton.disabled = true;
};

const safeStringify = (value) => {
    if (value === null || value === undefined) {
        return '';
    }

    if (typeof value === 'object') {
        try {
            return JSON.stringify(value);
        } catch (error) {
            return String(value);
        }
    }

    return String(value);
};

const normalizeJson = (payload) => {
    if (Array.isArray(payload)) {
        return payload;
    }

    if (payload && typeof payload === 'object') {
        if (Array.isArray(payload.data)) {
            return payload.data;
        }
        if (Array.isArray(payload.items)) {
            return payload.items;
        }
        if (Array.isArray(payload.results)) {
            return payload.results;
        }
        return [payload];
    }

    return [payload];
};

const buildColumns = (rows) => {
    const columns = [];
    const seen = new Set();

    rows.forEach((row) => {
        if (row && typeof row === 'object' && !Array.isArray(row)) {
            Object.keys(row).forEach((key) => {
                if (!seen.has(key)) {
                    seen.add(key);
                    columns.push(key);
                }
            });
        }
    });

    if (columns.length === 0) {
        columns.push('value');
    }

    return columns;
};

const normalizeRows = (rows) => rows.map((row) => {
    if (row && typeof row === 'object' && !Array.isArray(row)) {
        return row;
    }
    return { value: row };
});

const renderTable = (columns, rows) => {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');

    columns.forEach((column) => {
        const th = document.createElement('th');
        th.textContent = column;
        headRow.appendChild(th);
    });

    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    rows.forEach((row) => {
        const tr = document.createElement('tr');
        columns.forEach((column) => {
            const td = document.createElement('td');
            td.textContent = safeStringify(row[column]);
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);
};

const updateCounts = (columns, rows) => {
    rowCount.textContent = rows.length.toString();
    columnCount.textContent = columns.length.toString();
};

const parseAndRender = (text) => {
    if (!text || !text.trim()) {
        resetTableState();
        setStatus('Paste JSON or upload a file to get started.', true);
        return;
    }

    try {
        const parsed = JSON.parse(text);
        const rawRows = normalizeJson(parsed);
        const rows = normalizeRows(rawRows);
        const columns = buildColumns(rows);

        if (!rows.length) {
            resetTableState();
            setStatus('No rows found in the JSON data.', true);
            return;
        }

        currentTable = { columns, rows };
        renderTable(columns, rows);
        updateCounts(columns, rows);
        copyButton.disabled = false;
        downloadButton.disabled = false;
        setStatus('Table created successfully.');
    } catch (error) {
        resetTableState();
        setStatus(`Invalid JSON: ${error.message}`, true);
    }
};

const toCsvValue = (value) => {
    const stringValue = safeStringify(value);
    if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
};

const buildCsv = (columns, rows) => {
    const header = columns.map(toCsvValue).join(',');
    const body = rows.map((row) => columns.map((column) => toCsvValue(row[column])).join(','));
    return [header, ...body].join('\n');
};

const buildTsv = (columns, rows) => {
    const header = columns.join('\t');
    const body = rows.map((row) => columns.map((column) => safeStringify(row[column])).join('\t'));
    return [header, ...body].join('\n');
};

const copyTable = async () => {
    if (!currentTable.rows.length) {
        setStatus('Generate a table first.', true);
        return;
    }

    const tsv = buildTsv(currentTable.columns, currentTable.rows);

    try {
        await navigator.clipboard.writeText(tsv);
        setStatus('Table copied to clipboard.');
    } catch (error) {
        setStatus('Copy failed. Please try again in a secure (https) context.', true);
    }
};

const downloadCsv = () => {
    if (!currentTable.rows.length) {
        setStatus('Generate a table first.', true);
        return;
    }

    const csv = buildCsv(currentTable.columns, currentTable.rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'json-table.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus('CSV downloaded.');
};

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        textInput.value = e.target.result;
        setStatus(`Loaded ${file.name}. Click "Generate Table" to continue.`);
    };
    reader.onerror = () => {
        setStatus('Could not read the file. Please try again.', true);
    };
    reader.readAsText(file);
});

parseButton.addEventListener('click', () => parseAndRender(textInput.value));

clearButton.addEventListener('click', () => {
    textInput.value = '';
    fileInput.value = '';
    resetTableState();
    setStatus('Cleared. Paste JSON or upload a file.');
});

copyButton.addEventListener('click', copyTable);
downloadButton.addEventListener('click', downloadCsv);

resetTableState();
