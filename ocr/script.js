// script.js - Uploads image to server for OCR + fetches records from MongoDB

const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const startOcrBtn = document.getElementById('startOcr');
const progressEl = document.getElementById('progress');
const extractedTextArea = document.getElementById('extractedText');
const saveRecordBtn = document.getElementById('saveRecord'); // not used now
const downloadBtn = document.getElementById('downloadText');
const clearBtn = document.getElementById('clear');
const titleInput = document.getElementById('title');
const villageInput = document.getElementById('village');
const recordsList = document.getElementById('recordsList');

let lastFile = null;
let lastFileName = '';

fileInput.addEventListener('change', (e) => {
    const f = e.target.files[0];
    if (!f) return;
    lastFile = f;
    lastFileName = f.name || 'image';
    preview.src = URL.createObjectURL(f);
});

startOcrBtn.addEventListener('click', async () => {
    if (!lastFile) {
        alert('Choose an image file first.');
        return;
    }

    progressEl.textContent = 'Uploading & extracting...';

    const formData = new FormData();
    formData.append('image', lastFile);
    formData.append('title', titleInput.value || lastFileName);
    formData.append('village', villageInput.value || '');

    try {
        const res = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        const j = await res.json();
        if (res.ok) {
            extractedTextArea.value = j.record.extractedText || '';
            progressEl.textContent = 'Done ✓';
            loadRecords();
        } else {
            progressEl.textContent = 'Error: ' + (j.error || 'Upload failed');
        }
    } catch (err) {
        console.error(err);
        progressEl.textContent = 'Network error: ' + err.message;
    }
});

downloadBtn.addEventListener('click', () => {
    const text = extractedTextArea.value;
    if (!text) return alert('No text to download');
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (titleInput.value || 'ocr') + '.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
});

clearBtn.addEventListener('click', () => {
    preview.src = '';
    lastFile = null;
    extractedTextArea.value = '';
    titleInput.value = '';
    villageInput.value = '';
    progressEl.textContent = 'Idle';
});

async function loadRecords() {
    recordsList.textContent = 'Loading...';
    try {
        const res = await fetch('/records');
        if (!res.ok) throw new Error('Failed to fetch');
        const arr = await res.json();
        if (!Array.isArray(arr) || arr.length === 0) {
            recordsList.innerHTML = '<div class="record">No saved records yet.</div>';
            return;
        }
        recordsList.innerHTML = arr.slice(0, 25).map(r => {
            return `<div class="record">
        <strong>${escapeHtml(r.title)}</strong>
        <small>${new Date(r.createdAt).toLocaleString()} • ${escapeHtml(r.village || '')} • ${escapeHtml(r.language || '')}</small>
        <div style="margin-top:6px; white-space:pre-wrap; font-family:monospace; font-size:12px; color:#1f2937;">${escapeHtml(r.extractedText.slice(0, 400))}${r.extractedText.length > 400 ? '...' : ''}</div>
      </div>`;
        }).join('');
    } catch (e) {
        recordsList.textContent = 'Failed to load records: ' + e.message;
    }
}

function escapeHtml(s) {
    if (!s) return '';
    return s
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

// initial load
loadRecords();
