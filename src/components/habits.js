function renderHabits() {
  const pane = document.getElementById('tab-habits');
  const stats = Store.getStats();
  const routes = Store.getFrequentRoutes();
  const days = Store.getDayBreakdown();
  const modes = Store.getModeBreakdown();
  const dayKeys = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const maxDay = Math.max(...Object.values(days), 1);

  const dotColors = ['#b8f55a','#5acfff','#7de8a0','#f5c842','#ff6b6b','#c77dff'];

  pane.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Habits</div>
        <div class="page-sub">Patterns from your ${stats.count} logged trips</div>
      </div>
    </div>

    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-val">${stats.count}</div>
        <div class="stat-lbl">total trips</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${stats.avgDur} min</div>
        <div class="stat-lbl">avg duration</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${stats.topDay}</div>
        <div class="stat-lbl">busiest day</div>
      </div>
    </div>

    <div class="card">
      <div class="card-label">Frequent routes</div>
      ${routes.length ? routes.map((r, i) => `
        <div class="route-row">
          <div class="rdot" style="background:${dotColors[i % dotColors.length]}"></div>
          <div class="rinfo">
            <div class="rname">${r.from} → ${r.to}</div>
            <div class="rmeta">Avg ${r.avgDur} min · ${r.count}x · ${r.topMode || 'Mixed'}</div>
          </div>
          <div class="badge ${r.count >= 4 ? 'badge-g' : r.count >= 2 ? 'badge-y' : 'badge-b'}">${r.count >= 4 ? 'Optimized' : r.count >= 2 ? 'Building' : 'New'}</div>
        </div>
      `).join('') : '<div class="empty">Log more trips to see patterns</div>'}
    </div>

    <div class="card">
      <div class="card-label">Trips by day</div>
      <div class="bar-chart">
        ${dayKeys.map(d => `
          <div class="bar-col">
            <div class="bar-fill ${d === 'Sat' || d === 'Sun' ? 'weekend' : ''}" style="height:${Math.round((days[d]||0)/maxDay*64)}px"></div>
            <div class="bar-lbl">${d[0]}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-label">Transport modes</div>
      ${modes.length ? modes.map(m => `
        <div class="mode-row">
          <div class="mode-name">${m.mode}</div>
          <div class="mode-track"><div class="mode-fill" style="width:${m.pct}%;background:var(--accent)"></div></div>
          <div class="mode-pct">${m.pct}%</div>
        </div>
      `).join('') : '<div class="empty">No data yet</div>'}
    </div>

    <div class="card">
      <div class="card-label">AI habit insights</div>
      <div class="btn-row">
        <button class="btn-secondary" onclick="askAI('habits-ai-out', buildHabitsPrompt())">Analyze my patterns</button>
        <button class="btn-secondary" onclick="askAI('habits-ai-out', buildOptimizePrompt())">Suggest optimizations</button>
      </div>
      <div class="ai-response" id="habits-ai-out"></div>
    </div>
  `;
}

function buildHabitsPrompt() {
  const routes = Store.getFrequentRoutes();
  const stats = Store.getStats();
  const modes = Store.getModeBreakdown();
  return `Analyze my travel habits: ${stats.count} trips logged, avg ${stats.avgDur} min, busiest day is ${stats.topDay}. Top routes: ${routes.slice(0,3).map(r=>`${r.from}→${r.to} (${r.count}x, avg ${r.avgDur}min, ${r.topMode})`).join('; ')}. Mode split: ${modes.map(m=>`${m.mode} ${m.pct}%`).join(', ')}. Give me 3 specific insights about my travel patterns. Be concise.`;
}

function buildOptimizePrompt() {
  const routes = Store.getFrequentRoutes();
  return `Based on these routes: ${routes.slice(0,4).map(r=>`${r.from}→${r.to} (avg ${r.avgDur}min, ${r.topMode})`).join('; ')}, suggest 3 specific ways I could optimize my travel — different modes, timing, or route combinations. Be practical and brief.`;
}
