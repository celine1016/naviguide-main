function renderToday() {
  const pane = document.getElementById('tab-today');
  const stats = Store.getStats();
  const events = Store.calendarEvents;

  pane.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Today</div>
        <div class="page-sub">${new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</div>
      </div>
    </div>

    <div class="suggest" id="today-suggest">
      <div class="suggest-label">AI route suggestion</div>
      <div class="suggest-title">Optimized day ahead</div>
      <div class="suggest-body">You have lunch in Capitol Hill at 12pm and gym at 6pm. Leave by 11:42 AM — and consider swapping your usual coffee stop to Broadcast on the return trip to save 9 min total.</div>
      <div class="chips">
        <button class="chip chip-accent" onclick="this.closest('.suggest').style.display='none'">Sounds good</button>
        <button class="chip" onclick="askAI('suggest-ai-out', 'Give me 2 alternative route options for today that avoid highway traffic')">More options</button>
      </div>
      <div class="ai-response" id="suggest-ai-out"></div>
    </div>

    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-val">${events.filter(e=>e.loc).length}</div>
        <div class="stat-lbl">trips today</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${events.filter(e=>e.loc).reduce((a,e)=>a+parseInt(e.eta||0),0)} min</div>
        <div class="stat-lbl">travel time</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${stats.avgDur} min</div>
        <div class="stat-lbl">your avg commute</div>
      </div>
    </div>

    <div class="card">
      <div class="card-label">Calendar</div>
      ${events.map(e => `
        <div class="cal-row">
          <div class="cal-time">${e.time}</div>
          <div class="cal-body">
            <div class="cal-title">${e.title}</div>
            ${e.loc ? `<div class="cal-loc">${e.loc}</div>` : '<div class="cal-loc" style="color:var(--text3)">Remote</div>'}
            ${e.depart ? `<div class="cal-pill">Leave by ${e.depart} · ~${e.eta}</div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>

    <div class="card">
      <div class="card-label">Route map</div>
      <div class="map-box">
        <svg width="100%" height="100%" viewBox="0 0 500 140">
          <line x1="80" y1="80" x2="220" y2="50" stroke="rgba(184,245,90,0.4)" stroke-width="1.5" stroke-dasharray="5 4"/>
          <line x1="220" y1="50" x2="380" y2="95" stroke="rgba(184,245,90,0.4)" stroke-width="1.5" stroke-dasharray="5 4"/>
          <line x1="380" y1="95" x2="80" y2="80" stroke="rgba(255,255,255,0.1)" stroke-width="1" stroke-dasharray="3 5"/>
          <circle cx="80" cy="80" r="8" fill="#b8f55a"/>
          <text x="80" y="66" text-anchor="middle" font-size="10" fill="#b8f55a" font-family="DM Mono, monospace">Home</text>
          <circle cx="220" cy="50" r="8" fill="#5acfff"/>
          <text x="220" y="36" text-anchor="middle" font-size="10" fill="#5acfff" font-family="DM Mono, monospace">Lunch</text>
          <circle cx="380" cy="95" r="8" fill="#7de8a0"/>
          <text x="380" y="81" text-anchor="middle" font-size="10" fill="#7de8a0" font-family="DM Mono, monospace">Gym</text>
          <text x="250" y="132" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.2)" font-family="DM Mono, monospace">dashed = suggested return</text>
        </svg>
      </div>
    </div>

    <div class="card">
      <div class="card-label">Ask AI about today</div>
      <div class="form-grid" style="grid-template-columns:1fr auto">
        <input type="text" id="today-q" placeholder="e.g. What's the best time to leave for my 3pm?" />
        <button class="btn-primary" onclick="askAIFromInput('today-q','today-ai-out')">Ask</button>
      </div>
      <div class="ai-response" id="today-ai-out"></div>
    </div>
  `;
}
