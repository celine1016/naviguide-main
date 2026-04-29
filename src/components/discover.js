function renderDiscover() {
  const pane = document.getElementById('tab-discover');

  const places = [
    { icon: '☕', name: 'Broadcast Coffee', meta: '0.1 mi off your AM commute · 4.8★', why: 'Opens 7am — fits your 9am standup prep', wyc: '#b8f55a' },
    { icon: '🥗', name: 'Mkt. to Table', meta: 'Near your Capitol Hill lunch spot · 4.6★', why: 'Quick weekday lunches, matches your 12pm slot', wyc: '#7de8a0' },
    { icon: '🏋️', name: "Barry's South Lake Union", meta: '0.4 mi from office · 4.7★', why: '6pm classes align with your gym habit', wyc: '#5acfff' },
    { icon: '🛒', name: 'Metropolitan Market', meta: '0.3 mi off gym→home route · 4.5★', why: 'Monday evenings — natural grocery detour', wyc: '#f5c842' },
    { icon: '🌿', name: 'Volunteer Park', meta: 'Near First Hill · Free', why: 'Good 20-min wind-down between dentist and gym', wyc: '#7de8a0' },
  ];

  pane.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Discover</div>
        <div class="page-sub">Places that fit your routes and schedule</div>
      </div>
    </div>

    <div class="suggest">
      <div class="suggest-label">Personalized for you</div>
      <div class="suggest-title">Picked from your patterns</div>
      <div class="suggest-body">Based on your frequent routes and calendar, these spots fit naturally into your week without adding meaningful travel time.</div>
    </div>

    <div class="card">
      ${places.map(p => `
        <div class="disc-item">
          <div class="disc-icon">${p.icon}</div>
          <div>
            <div class="disc-name">${p.name}</div>
            <div class="disc-meta">${p.meta}</div>
            <div class="disc-why" style="color:${p.wyc}">${p.why}</div>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="card">
      <div class="card-label">Find more places</div>
      <div class="form-grid" style="grid-template-columns:1fr auto">
        <input type="text" id="disc-q" placeholder="e.g. quiet cafes near my work route" />
        <button class="btn-primary" onclick="askAIFromInput('disc-q','disc-ai-out')">Search</button>
      </div>
      <div class="ai-response" id="disc-ai-out"></div>
    </div>
  `;
}
