function getActiveData() {
  const imported = getAppData();
  return (imported && imported.length) ? imported : [];
}

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

function renderExpenses() {
  const container = document.getElementById('expensesContainer');
  if (!container) return;

  container.innerHTML = '';

  if (expenses.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:13px;padding:12px 0;">No expenses yet. Add one to get started.</p>';
    updateStats();
    return;
  }

  const icons = ['ti-coffee', 'ti-tools-kitchen-2', 'ti-device-tv', 'ti-device-tv', 'ti-receipt'];

  expenses.forEach((expense, index) => {
    const div = document.createElement('div');
    div.classList.add('expense-item');
    const icon = icons[index] || 'ti-credit-card';
    div.innerHTML = `
      <div class="expense-icon"><i class="ti ${icon}"></i></div>
      <div class="expense-info">
        <h3>${expense.name}</h3>
        <p>Monthly Spending</p>
      </div>
      <span class="expense-amount">$${expense.amount}</span>
      <button class="delete-btn" onclick="deleteExpense(${index})">Delete</button>
    `;
    container.appendChild(div);
  });

  updateStats();
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  renderExpenses();
}

function updateStats() {
  const total = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalEl = document.getElementById('totalSpending');
  const subEl = document.getElementById('subscriptionCount');
  const badgeEl = document.getElementById('expenseCountBadge');
  if (totalEl) totalEl.textContent = `$${total}`;
  if (subEl) subEl.textContent = expenses.length;
  if (badgeEl) badgeEl.textContent = `${expenses.length} items`;
}

function saveExpenses() {}