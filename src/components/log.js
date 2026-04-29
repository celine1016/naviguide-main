function renderLog() {
  const pane = document.getElementById('tab-log');
  const trips = Store.getTrips();

  pane.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Log Trip</div>
        <div class="page-sub">Manual entries + auto-detected from calendar</div>
      </div>
    </div>

    <div class="card">
      <div class="card-label">Add a trip</div>
      <div class="form-grid">
        <div class="field">
          <label>From</label>
          <input type="text" id="log-from" placeholder="e.g. Home" />
        </div>
        <div class="field">
          <label>To</label>
          <input type="text" id="log-to" placeholder="e.g. Coffee shop" />
        </div>
        <div class="field">
          <label>Duration (min)</label>
          <input type="number" id="log-dur" placeholder="20" min="1" max="300" />
        </div>
        <div class="field">
          <label>Mode</label>
          <select id="log-mode">
            <option value="">Select...</option>
            <option>Driving</option>
            <option>Walking</option>
            <option>Transit</option>
            <option>Cycling</option>
          </select>
        </div>
        <div class="field">
          <label>Purpose</label>
          <select id="log-purpose">
            <option value="">Select...</option>
            <option>Commute</option>
            <option>Errand</option>
            <option>Social</option>
            <option>Gym</option>
            <option>Food</option>
            <option>Other</option>
          </select>
        </div>
      </div>
      <div class="btn-row">
        <button class="btn-primary" onclick="submitTrip()">Add trip</button>
        <button class="btn-secondary" onclick="askAI('log-ai-out', buildLogPrompt())">Suggest what to log</button>
      </div>
      <div class="ai-response" id="log-ai-out"></div>
    </div>

    <div class="card">
      <div class="card-label">Trip log (${trips.length} entries)</div>
      <div id="trip-log-list">
        ${renderTripList(trips)}
      </div>
    </div>
  `;
}

function renderTripList(trips) {
  if (!trips.length) return '<div class="empty">No trips yet — add one above</div>';
  return trips.slice(0, 20).map((t, i) => `
    <div class="log-row">
      <div class="log-from">${t.from}</div>
      <div class="log-arrow">→</div>
      <div class="log-to">${t.to}</div>
      <div class="log-dur">${t.dur}m</div>
      <div class="log-mode"><span class="badge badge-b">${t.mode || '—'}</span></div>
      <div class="log-del" onclick="removeTrip(${i})">✕</div>
    </div>
  `).join('');
}

function submitTrip() {
  const from = document.getElementById('log-from').value.trim();
  const to = document.getElementById('log-to').value.trim();
  const dur = parseInt(document.getElementById('log-dur').value);
  const mode = document.getElementById('log-mode').value;
  const purpose = document.getElementById('log-purpose').value;

  if (!from || !to || !dur) {
    alert('Please fill in From, To, and Duration.');
    return;
  }

  Store.addTrip({ from, to, dur, mode, purpose });
  document.getElementById('log-from').value = '';
  document.getElementById('log-to').value = '';
  document.getElementById('log-dur').value = '';
  document.getElementById('log-mode').value = '';
  document.getElementById('log-purpose').value = '';

  renderLog();
  renderHabits();
}

function removeTrip(i) {
  Store.deleteTrip(i);
  renderLog();
  renderHabits();
}

function buildLogPrompt() {
  const routes = Store.getFrequentRoutes().slice(0, 4);
  const events = Store.calendarEvents.filter(e => e.loc);
  return `I'm tracking my travel habits. My frequent routes are: ${routes.map(r => `${r.from} to ${r.to} (${r.count}x, avg ${r.avgDur}min)`).join(', ')}. Today's calendar has: ${events.map(e => `${e.title} at ${e.loc}`).join(', ')}. What 3-5 specific trips should I log to improve my habit data? Be concise and specific.`;
}
