let parsedRows = [];

const dropzone = document.getElementById('dropzone');
dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('dragover'); });
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
dropzone.addEventListener('drop', e => {
  e.preventDefault();
  dropzone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) processFile(file);
});

function handleFile(event) {
  const file = event.target.files[0];
  if (file) processFile(file);
}

function processFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  const reader = new FileReader();

  reader.onload = function(e) {
    let rows = [];
    if (ext === 'csv') {
      const text = e.target.result;
      const lines = text.trim().split('\n');
      for (let i = 1; i < lines.length; i++) {
        const vals = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        if (vals.length >= 4) {
          rows.push({
            date: vals[0],
            category: vals[1],
            amount: parseFloat(vals[2]) || 0,
            description: vals[3]
          });
        }
      }
    } else {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);
      rows = data.map(row => ({
        date: row['Date'] || row['date'] || '',
        category: row['Category'] || row['category'] || '',
        amount: parseFloat(row['Amount'] || row['amount']) || 0,
        description: row['Description'] || row['description'] || ''
      }));
    }

    parsedRows = rows.filter(r => r.amount > 0);
    showPreview(parsedRows);
  };

  if (ext === 'csv') {
    reader.readAsText(file);
  } else {
    reader.readAsBinaryString(file);
  }
}

function showPreview(rows) {
  const table = document.getElementById('previewTable');
  const badge = document.getElementById('rowCountBadge');
  badge.textContent = `${rows.length} rows`;

  let html = `<thead><tr>
    <th>Date</th><th>Category</th><th>Amount</th><th>Description</th>
  </tr></thead><tbody>`;

  rows.slice(0, 10).forEach(r => {
    html += `<tr>
      <td>${r.date}</td>
      <td>${r.category}</td>
      <td>$${r.amount.toFixed(2)}</td>
      <td>${r.description}</td>
    </tr>`;
  });

  if (rows.length > 10) {
    html += `<tr><td colspan="4" style="text-align:center;color:var(--text-muted);font-size:12px;">... and ${rows.length - 10} more rows</td></tr>`;
  }

  html += '</tbody>';
  table.innerHTML = html;
  document.getElementById('previewSection').style.display = 'block';
  document.getElementById('importSuccess').style.display = 'none';
}

function confirmImport() {
  if (!parsedRows.length) return;
  localStorage.setItem('finScanData', JSON.stringify(parsedRows));
  localStorage.setItem('finScanImported', 'true');
  document.getElementById('previewSection').style.display = 'none';
  document.getElementById('importSuccess').style.display = 'block';
}

function cancelImport() {
  parsedRows = [];
  document.getElementById('previewSection').style.display = 'none';
  document.getElementById('fileInput').value = '';
}
