function fillPrompt(text) {
  document.getElementById('coachInput').value = text;
  document.getElementById('coachInput').focus();
}

async function sendCoachMessage() {
  const input = document.getElementById('coachInput');
  const message = input.value.trim();
  if (!message) return;

  const container = document.getElementById('coachMessages');

  const userRow = document.createElement('div');
  userRow.classList.add('coach-user-row');
  userRow.innerHTML = `<div class="coach-bubble user">${message}</div>`;
  container.appendChild(userRow);
  input.value = '';
  container.scrollTop = container.scrollHeight;

  const botRow = document.createElement('div');
  botRow.classList.add('coach-bot-row');
  botRow.innerHTML = `
    <div class="coach-avatar"><i class="ti ti-robot"></i></div>
    <div class="coach-bubble bot typing">
      <span></span><span></span><span></span>
    </div>`;
  container.appendChild(botRow);
  container.scrollTop = container.scrollHeight;

  const apiKey = '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';

  const importedData = getAppData();
  const spendingSummary = importedData && importedData.length
    ? (() => {
        const cats = getByCategory(importedData);
        const total = getTotalSpending(importedData);
        return `Total spending: $${total.toFixed(2)}. By category: ${Object.entries(cats).map(([k,v]) => `${k}: $${v.toFixed(2)}`).join(', ')}`;
      })()
    : typeof expenses !== 'undefined' && expenses.length
      ? expenses.map(e => `${e.name}: $${e.amount}/mo`).join(', ')
      : 'No expenses tracked yet.';

  const prompt = `You are a friendly, expert personal finance AI coach built into the FinScan app.
The user's current tracked expenses are: ${spendingSummary}
User message: ${message}
Reply in 2–4 sentences. Be specific, actionable, and encouraging. No bullet points.`;

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://athu1357.github.io/FinScan/',
        'X-Title': 'FinScan AI'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b:free',
        max_tokens: 300,
        messages: [
          { role: 'system', content: 'You are a helpful personal finance coach.' },
          { role: 'user', content: prompt }
        ]
      })
    });
    const data = await res.json();
    console.log('Response:', data);
    const reply = data.choices?.[0]?.message?.content || data.error?.message || 'No response received.';
    botRow.querySelector('.coach-bubble').classList.remove('typing');
    botRow.querySelector('.coach-bubble').innerHTML = reply;
  } catch (err) {
    console.error('Fetch error:', err);
    botRow.querySelector('.coach-bubble').classList.remove('typing');
    botRow.querySelector('.coach-bubble').textContent = 'Error: ' + err.message;
  }

  container.scrollTop = container.scrollHeight;
}
