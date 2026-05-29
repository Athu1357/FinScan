function getAppData() {
  const raw = localStorage.getItem('finScanData');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function isImported() {
  return localStorage.getItem('finScanImported') === 'true';
}

function getTotalSpending(data) {
  return data.reduce((sum, r) => sum + r.amount, 0);
}

function getByCategory(data) {
  const cats = {};
  data.forEach(r => {
    const cat = r.category || 'Other';
    cats[cat] = (cats[cat] || 0) + r.amount;  
  });
  return cats;
}

function getTopCategory(data) {
  const cats = getByCategory(data);
  return Object.entries(cats).sort((a, b) => b[1] - a[1])[0] || ['None', 0];
}

function getMonthlySummary(data) {
  const months = {};
  data.forEach(r => {
    const month = r.date ? r.date.substring(0, 7) : 'Unknown';
    months[month] = (months[month] || 0) + r.amount;
  });
  return months;
}