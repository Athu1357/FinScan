const addBtn = document.getElementById('addExpenseBtn');
if (addBtn) {
  addBtn.addEventListener('click', () => {
    const name = prompt('Expense name:');
    if (!name) return;
    const amount = parseFloat(prompt('Monthly amount:'));
    if (isNaN(amount)) return;
    const category = prompt('Category:') || 'Other';
    DEMO_EXPENSES.push({ date: new Date().toISOString().slice(0,10), category, amount, description: name });
    renderExpenses();
  });
}

const CATEGORY_ICONS = {
  food: 'ti-tools-kitchen-2',
  coffee: 'ti-coffee',
  subscriptions: 'ti-device-tv',
  transport: 'ti-car',
  rent: 'ti-home',
  entertainment: 'ti-music',
  health: 'ti-heart',
  shopping: 'ti-shopping-cart',
};

function getCategoryIcon(category) {
  const key = (category || '').toLowerCase();
  for (const [k, icon] of Object.entries(CATEGORY_ICONS)) {
    if (key.includes(k)) return icon;
  }
  return 'ti-receipt';
}

function renderExpenses() {
  const data = getActiveData();
  const isImportedMode = isImported();

  const container = document.getElementById('expensesContainer');
  const badge = document.getElementById('expenseCountBadge');
  if (badge) badge.textContent = data.length + ' items';

  if (container) {
    container.innerHTML = '';
    data.slice(0, 20).forEach((row, i) => {
      const div = document.createElement('div');
      div.classList.add('expense-item');
      const icon = getCategoryIcon(row.category);
      div.innerHTML = `
        <div class="expense-icon"><i class="ti ${icon}"></i></div>
        <div class="expense-info">
          <h3>${row.description || row.category}</h3>
          <p>${row.category}${row.date ? ' · ' + row.date : ''}</p>
        </div>
        <div class="expense-amount">$${Number(row.amount).toFixed(2)}</div>
        ${!isImportedMode ? `<button class="delete-btn" onclick="deleteExpense(${i})">Remove</button>` : ''}
      `;
      container.appendChild(div);
    });
  }

  const total = getTotalSpending(data);
  const topCat = getTopCategory(data);
  const subCount = data.filter(r => (r.category || '').toLowerCase().includes('subscription')).length;

  const totalEl = document.getElementById('totalSpending');
  const subEl = document.getElementById('subscriptionCount');
  const topCatEl = document.getElementById('topCategory');

  if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
  if (subEl) subEl.textContent = subCount;
  if (topCatEl) topCatEl.textContent = topCat[0];
}

renderExpenses();