// script.js - Browser-side OCR (Tesseract.js) with PDF support (PDF.js)
// Records are stored in the browser's localStorage.

pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const $ = (id) => document.getElementById(id);
const fileInput = $('fileInput');
const fileNameEl = $('fileName');
const preview = $('preview');
const pdfCanvas = $('pdfCanvas');
const pager = $('pager');
const pageInfo = $('pageInfo');
const startOcrBtn = $('startOcr');
const progressEl = $('progress');
const extractedTextArea = $('extractedText');
const saveRecordBtn = $('saveRecord');
const downloadBtn = $('downloadText');
const clearBtn = $('clear');
const titleInput = $('title');
const villageInput = $('village');
const recordsList = $('recordsList');

const STORAGE_KEY = 'fra_ocr_records';

let lastFile = null;
let lastFileName = '';
let pdfDoc = null;
let currentPage = 1;
let lastLanguages = '';

/* ---------- File selection & preview ---------- */

fileInput.addEventListener('change', async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    lastFile = f;
    lastFileName = f.name || 'file';
    fileNameEl.textContent = lastFileName;
    resetPreview();

    const isPdf = f.type === 'application/pdf' || /\.pdf$/i.test(f.name);
    try {
        if (isPdf) {
            progressEl.textContent = 'Loading PDF...';
            const buf = await f.arrayBuffer();
            pdfDoc = await pdfjsLib.getDocument({ data: buf }).promise;
            currentPage = 1;
            await renderPdfPage(currentPage);
            progressEl.textContent = `PDF loaded (${pdfDoc.numPages} page${pdfDoc.numPages > 1 ? 's' : ''})`;
        } else {
            preview.src = URL.createObjectURL(f);
            preview.style.display = 'block';
            progressEl.textContent = 'Image loaded';
        }
    } catch (err) {
        console.error(err);
        progressEl.textContent = 'Could not preview file: ' + err.message;
    }
});

function resetPreview() {
    if (preview.src.startsWith('blob:')) URL.revokeObjectURL(preview.src);
    preview.removeAttribute('src');
    preview.style.display = 'none';
    pdfCanvas.style.display = 'none';
    pager.style.display = 'none';
    pdfDoc = null;
}

async function renderPageToCanvas(pageNum, canvas, scale) {
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
}

async function renderPdfPage(num) {
    await renderPageToCanvas(num, pdfCanvas, 1.2);
    pdfCanvas.style.display = 'block';
    pager.style.display = pdfDoc.numPages > 1 ? 'flex' : 'none';
    pageInfo.textContent = `Page ${num} / ${pdfDoc.numPages}`;
}

$('prevPage').addEventListener('click', () => {
    if (pdfDoc && currentPage > 1) renderPdfPage(--currentPage);
});
$('nextPage').addEventListener('click', () => {
    if (pdfDoc && currentPage < pdfDoc.numPages) renderPdfPage(++currentPage);
});

/* ---------- OCR ---------- */

function selectedLanguages() {
    const langs = [];
    if ($('lang-eng').checked) langs.push('eng');
    if ($('lang-hin').checked) langs.push('hin');
    if ($('lang-ori').checked) langs.push('ori');
    return langs.join('+');
}

startOcrBtn.addEventListener('click', async () => {
    if (!lastFile) return alert('Choose an image or PDF file first.');
    const langs = selectedLanguages();
    if (!langs) return alert('Select at least one language.');

    startOcrBtn.disabled = true;
    extractedTextArea.value = '';
    let worker;

    try {
        let currentLabel = '';
        worker = await Tesseract.createWorker({
            logger: (m) => {
                if (m.status) {
                    const pct = m.progress != null ? ` ${Math.round(m.progress * 100)}%` : '';
                    progressEl.textContent = `${currentLabel}${m.status}${pct}`;
                }
            }
        });
        await worker.loadLanguage(langs);
        await worker.initialize(langs);

        const parts = [];
        if (pdfDoc) {
            const hidden = document.createElement('canvas');
            for (let p = 1; p <= pdfDoc.numPages; p++) {
                currentLabel = `Page ${p}/${pdfDoc.numPages}: `;
                await renderPageToCanvas(p, hidden, 2.5); // higher scale = better accuracy
                const { data } = await worker.recognize(hidden);
                parts.push(pdfDoc.numPages > 1 ? `--- Page ${p} ---\n${data.text.trim()}` : data.text.trim());
                extractedTextArea.value = parts.join('\n\n');
            }
        } else {
            const { data } = await worker.recognize(lastFile);
            parts.push(data.text.trim());
            extractedTextArea.value = parts.join('\n\n');
        }

        lastLanguages = langs;
        progressEl.textContent = 'Done ✓';
    } catch (err) {
        console.error(err);
        progressEl.textContent = 'OCR error: ' + err.message;
    } finally {
        if (worker) await worker.terminate();
        startOcrBtn.disabled = false;
    }
});

/* ---------- Download ---------- */

downloadBtn.addEventListener('click', () => {
    const text = extractedTextArea.value;
    if (!text) return alert('No text to download');
    const name = (titleInput.value || lastFileName.replace(/\.[^.]+$/, '') || 'ocr')
        .replace(/[\\/:*?"<>|]+/g, '_');
    // BOM makes Hindi/Odia display correctly in Notepad/Excel
    const blob = new Blob(['\uFEFF', text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name + '.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
});

/* ---------- Clear ---------- */

clearBtn.addEventListener('click', () => {
    resetPreview();
    fileInput.value = '';
    fileNameEl.textContent = '';
    lastFile = null;
    lastFileName = '';
    extractedTextArea.value = '';
    titleInput.value = '';
    villageInput.value = '';
    progressEl.textContent = 'Idle';
});

/* ---------- Records (localStorage) ---------- */

function getRecords() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

saveRecordBtn.addEventListener('click', () => {
    const text = extractedTextArea.value.trim();
    if (!text) return alert('Nothing to save. Run OCR first.');
    const records = getRecords();
    records.unshift({
        id: Date.now(),
        title: titleInput.value || lastFileName || 'Untitled',
        village: villageInput.value || '',
        language: lastLanguages,
        extractedText: text,
        createdAt: new Date().toISOString()
    });
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        progressEl.textContent = 'Saved ✓';
        loadRecords();
    } catch (e) {
        alert('Could not save: ' + e.message);
    }
});

recordsList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-del]');
    if (!btn) return;
    const id = Number(btn.dataset.del);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getRecords().filter((r) => r.id !== id)));
    loadRecords();
});

function loadRecords() {
    const arr = getRecords();
    if (arr.length === 0) {
        recordsList.innerHTML = '<div class="record">No saved records yet.</div>';
        return;
    }
    recordsList.innerHTML = arr.slice(0, 25).map((r) => `
      <div class="record">
        <strong>${escapeHtml(r.title)}</strong>
        <button class="btn danger small" data-del="${r.id}">Delete</button>
        <small>${new Date(r.createdAt).toLocaleString()} • ${escapeHtml(r.village)} • ${escapeHtml(r.language)}</small>
        <div style="margin-top:6px; white-space:pre-wrap; font-family:monospace; font-size:12px; color:#1f2937;">${escapeHtml(r.extractedText.slice(0, 400))}${r.extractedText.length > 400 ? '...' : ''}</div>
      </div>`).join('');
}

function escapeHtml(s) {
    if (!s) return '';
    return String(s)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

loadRecords();
