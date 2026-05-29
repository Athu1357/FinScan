function openAIWindow() {
  document.getElementById('aiWindow').style.display = 'flex';
}

function closeAIWindow() {
  document.getElementById('aiWindow').style.display = 'none';
}

async function sendAIMessage() {
  const input = document.getElementById('aiInput');
  const message = input.value.trim();
  if (!message) return;

  const container = document.getElementById('aiMessages');

  const userMsg = document.createElement('div');
  userMsg.classList.add('user-message');
  userMsg.textContent = message;
  container.appendChild(userMsg);
  input.value = '';
  container.scrollTop = container.scrollHeight;

  const botMsg = document.createElement('div');
  botMsg.classList.add('bot-message');
  botMsg.textContent = 'Thinking...';
  container.appendChild(botMsg);
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
    botMsg.textContent = reply;
  } catch (err) {
    console.error('Fetch error:', err);
    botMsg.textContent = 'Error: ' + err.message;
  }

  container.scrollTop = container.scrollHeight;
}

document.addEventListener('click', function(e) {
  const aiWindow = document.getElementById('aiWindow');
  if (e.target === aiWindow) closeAIWindow();
});
