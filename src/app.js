const App = (() => {
  function init() {
    renderToday();
    renderLog();
    renderHabits();
    renderDiscover();
    setupNav();
    setupApiKey();
  }

  function setupNav() {
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
      });
    });
  }

  function setupApiKey() {
    const key = Store.getApiKey();
    const dot = document.querySelector('.status-dot');
    const txt = document.querySelector('.status-text');
    if (key) {
      dot.className = 'status-dot';
      txt.textContent = 'AI ready';
    } else {
      dot.className = 'status-dot error';
      txt.textContent = 'No API key';
    }
  }

  return { init };
})();

async function askAI(outputId, prompt) {
  const apiKey = Store.getApiKey();
  const outEl = document.getElementById(outputId);
  if (!outEl) return;

  if (!apiKey) {
    outEl.classList.add('visible');
    outEl.innerHTML = `<strong>Add your Claude API key</strong> to enable AI suggestions. Click the status indicator in the sidebar, or open <code>config.html</code>.`;
    showApiKeyPrompt();
    return;
  }

  outEl.classList.add('visible');
  outEl.innerHTML = `<div class="ai-loading"><div class="ai-spinner"></div>Thinking...</div>`;

  const dot = document.querySelector('.status-dot');
  const txt = document.querySelector('.status-text');
  dot.className = 'status-dot loading';
  txt.textContent = 'Asking AI...';

  const routes = Store.getFrequentRoutes().slice(0, 4);
  const stats = Store.getStats();

  const systemPrompt = `You are Wayfarer, a smart travel habit assistant. The user has these travel patterns: ${stats.count} trips logged, avg commute ${stats.avgDur} min, top routes: ${routes.map(r=>`${r.from}→${r.to} (${r.count}x, avg ${r.avgDur}min)`).join(', ')}. Today's calendar: Lunch in Capitol Hill at 12pm, Dentist at 3pm, Gym at 6pm. Be helpful, specific, and concise. Use plain text, no markdown formatting.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await res.json();

    if (data.error) throw new Error(data.error.message);

    const text = data.content?.[0]?.text || 'No response.';
    outEl.innerHTML = text.replace(/\n/g, '<br>');

    dot.className = 'status-dot';
    txt.textContent = 'AI ready';
  } catch (err) {
    outEl.innerHTML = `<strong>Error:</strong> ${err.message}`;
    dot.className = 'status-dot error';
    txt.textContent = 'AI error';
  }
}

async function askAIFromInput(inputId, outputId) {
  const input = document.getElementById(inputId);
  if (!input || !input.value.trim()) return;
  const prompt = input.value.trim();
  input.value = '';
  await askAI(outputId, prompt);
}

function showApiKeyPrompt() {
  const existing = document.getElementById('apikey-modal');
  if (existing) { existing.style.display = 'flex'; return; }

  const modal = document.createElement('div');
  modal.id = 'apikey-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:999';
  modal.innerHTML = `
    <div style="background:var(--bg2);border:1px solid var(--border2);border-radius:var(--r-lg);padding:24px;width:380px;font-family:var(--font-mono)">
      <div style="font-family:var(--font-head);font-size:16px;font-weight:600;margin-bottom:8px">Add your Claude API key</div>
      <div style="font-size:12px;color:var(--text2);margin-bottom:14px;line-height:1.6">Get your key from <strong style="color:var(--accent)">console.anthropic.com</strong>. It's stored locally in your browser only.</div>
      <div class="key-input-row">
        <input type="password" id="modal-api-key" placeholder="sk-ant-..." value="${Store.getApiKey()}" />
        <button class="btn-primary" onclick="saveApiKey()">Save</button>
      </div>
      <button class="btn-secondary" style="width:100%;margin-top:8px" onclick="document.getElementById('apikey-modal').style.display='none'">Cancel</button>
    </div>
  `;
  document.body.appendChild(modal);
}

function saveApiKey() {
  const key = document.getElementById('modal-api-key').value.trim();
  if (key) {
    Store.setApiKey(key);
    document.getElementById('apikey-modal').style.display = 'none';
    const dot = document.querySelector('.status-dot');
    const txt = document.querySelector('.status-text');
    dot.className = 'status-dot';
    txt.textContent = 'AI ready';
  }
}

document.querySelector('.api-status').addEventListener('click', showApiKeyPrompt);

document.addEventListener('DOMContentLoaded', App.init);
