const fileInput = document.getElementById('json-file');
const textInput = document.getElementById('json-input');
const endpointInput = document.getElementById('api-endpoint');
const tokenInput = document.getElementById('api-token');
const toggleTokenButton = document.getElementById('toggle-token');
const tokenStatus = document.getElementById('token-status');
const fetchButton = document.getElementById('fetch-btn');
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

let autoParseTimer = null;

const setStatus = (message, isError = false) => {
    statusText.textContent = message;
    statusText.style.color = isError ? '#a32121' : '#1b6192';
};

const setFetchState = (isLoading) => {
    fetchButton.disabled = isLoading;
    fetchButton.textContent = isLoading ? 'Fetching...' : 'Fetch JSON';
};

const updateTokenStatus = () => {
    const manualToken = tokenInput.value.trim();
    if (manualToken) {
        tokenStatus.textContent = 'Token status: Manual token provided.';
        tokenStatus.style.color = '#1b6192';
        return;
    }

    const storedToken = localStorage.getItem('AuthTokenKey');
    if (storedToken && storedToken.trim()) {
        tokenStatus.textContent = 'Token status: Using AuthTokenKey from localStorage.';
        tokenStatus.style.color = '#1b6192';
        return;
    }

    tokenStatus.textContent = 'Token status: No token found. Log in or paste one above.';
    tokenStatus.style.color = '#a32121';
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

const isPlainObject = (value) => !!value && typeof value === 'object' && !Array.isArray(value);

const flattenValue = (value, prefix, output) => {
    if (Array.isArray(value)) {
        if (value.length === 0) {
            output[prefix] = '';
            return;
        }
        const allObjects = value.every((item) => isPlainObject(item));
        if (allObjects) {
            value.forEach((item, index) => {
                flattenValue(item, `${prefix}[${index}]`, output);
            });
        } else {
            output[prefix] = value.map((item) => safeStringify(item)).join(', ');
        }
        return;
    }

    if (isPlainObject(value)) {
        Object.keys(value).forEach((key) => {
            const nextKey = prefix ? `${prefix}.${key}` : key;
            flattenValue(value[key], nextKey, output);
        });
        return;
    }

    output[prefix] = value;
};

const flattenRow = (row) => {
    if (!isPlainObject(row)) {
        return row;
    }

    const output = {};
    Object.keys(row).forEach((key) => {
        flattenValue(row[key], key, output);
    });
    return output;
};

const findFirstArray = (payload) => {
    const queue = [payload];
    const seen = new Set();

    while (queue.length) {
        const current = queue.shift();
        if (!current || typeof current !== 'object') {
            continue;
        }
        if (seen.has(current)) {
            continue;
        }
        seen.add(current);

        if (Array.isArray(current)) {
            return current;
        }

        Object.values(current).forEach((value) => {
            if (value && typeof value === 'object') {
                queue.push(value);
            }
        });
    }

    return null;
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
        const nestedArray = findFirstArray(payload);
        if (nestedArray) {
            return nestedArray;
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

const arrayRowToObject = (row) => row.reduce((acc, value, index) => {
    acc[`col_${index + 1}`] = value;
    return acc;
}, {});

const normalizeRows = (rows) => rows.map((row) => {
    if (Array.isArray(row)) {
        return flattenRow(arrayRowToObject(row));
    }
    if (isPlainObject(row)) {
        return flattenRow(row);
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

const getAuthToken = () => {
    const manualToken = tokenInput.value.trim();
    if (manualToken) {
        return manualToken;
    }

    const storedToken = localStorage.getItem('AuthTokenKey');
    return storedToken && storedToken.trim() ? storedToken.trim() : null;
};

const normalizeToken = (token) => {
    if (!token) {
        return null;
    }

    const trimmed = token.trim();
    if (!trimmed) {
        return null;
    }

    if (trimmed.toLowerCase().startsWith('authtokenkey=')) {
        return trimmed.slice('authtokenkey='.length).trim();
    }

    return trimmed;
};

const buildAuthHeader = (token) => {
    const normalized = normalizeToken(token);
    if (!normalized) {
        return null;
    }

    if (/^bearer\s+/i.test(normalized)) {
        return normalized;
    }

    return `Bearer ${normalized}`;
};

const fetchJsonFromEndpoint = async () => {
    const endpoint = endpointInput.value.trim();

    if (!endpoint) {
        setStatus('Paste the full API endpoint URL first.', true);
        return;
    }

    const token = getAuthToken();
    const authHeader = buildAuthHeader(token);
    if (!authHeader) {
        setStatus('Add a token above or log in to pathsay.fhtl.org so AuthTokenKey is in localStorage.', true);
        updateTokenStatus();
        return;
    }

    setFetchState(true);
    setStatus('Fetching data from the API...');

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                Authorization: authHeader
            }
        });

        if (!response.ok) {
            const errorBody = await response.text();
            const detail = errorBody ? ` - ${errorBody}` : '';
            throw new Error(`Request failed with ${response.status} ${response.statusText}${detail}`);
        }

        const rawText = await response.text();
        let data;
        try {
            data = rawText ? JSON.parse(rawText) : null;
        } catch (parseError) {
            const contentType = response.headers.get('content-type') || '';
            throw new Error(`Expected JSON but received ${contentType || 'unknown content type'}: ${rawText.slice(0, 200)}`);
        }
        textInput.value = JSON.stringify(data, null, 2);
        parseAndRender(textInput.value);
        setStatus('API data loaded. Table updated.');
        updateTokenStatus();
    } catch (error) {
        resetTableState();
        setStatus(`API error: ${error.message}`, true);
        updateTokenStatus();
    } finally {
        setFetchState(false);
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
        setStatus(`Loaded ${file.name}. Building table...`);
        parseAndRender(textInput.value);
    };
    reader.onerror = () => {
        setStatus('Could not read the file. Please try again.', true);
    };
    reader.readAsText(file);
});

parseButton.addEventListener('click', () => parseAndRender(textInput.value));
fetchButton.addEventListener('click', fetchJsonFromEndpoint);
endpointInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        fetchJsonFromEndpoint();
    }
});

textInput.addEventListener('input', () => {
    if (autoParseTimer) {
        clearTimeout(autoParseTimer);
    }
    autoParseTimer = setTimeout(() => {
        parseAndRender(textInput.value);
    }, 400);
});

clearButton.addEventListener('click', () => {
    textInput.value = '';
    fileInput.value = '';
    resetTableState();
    setStatus('Cleared. Paste JSON or upload a file.');
});

copyButton.addEventListener('click', copyTable);
downloadButton.addEventListener('click', downloadCsv);
toggleTokenButton.addEventListener('click', () => {
    const isHidden = tokenInput.type === 'password';
    tokenInput.type = isHidden ? 'text' : 'password';
    toggleTokenButton.textContent = isHidden ? 'Hide Token' : 'Show Token';
});
tokenInput.addEventListener('input', updateTokenStatus);

resetTableState();
setFetchState(false);
updateTokenStatus();
