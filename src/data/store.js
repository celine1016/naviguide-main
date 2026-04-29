const Store = (() => {
  const STORAGE_KEY = 'wayfarer_trips';
  const API_KEY_KEY = 'wayfarer_api_key';

  const seedTrips = [
    { from: 'Home', to: 'Work', dur: 34, mode: 'Driving', purpose: 'Commute', date: daysAgo(1) },
    { from: 'Work', to: 'Gym', dur: 12, mode: 'Driving', purpose: 'Gym', date: daysAgo(1) },
    { from: 'Home', to: 'Work', dur: 38, mode: 'Driving', purpose: 'Commute', date: daysAgo(2) },
    { from: 'Work', to: 'Coffee', dur: 5, mode: 'Walking', purpose: 'Food', date: daysAgo(2) },
    { from: 'Home', to: 'Work', dur: 31, mode: 'Driving', purpose: 'Commute', date: daysAgo(3) },
    { from: 'Work', to: 'Gym', dur: 14, mode: 'Driving', purpose: 'Gym', date: daysAgo(3) },
    { from: 'Home', to: 'Grocery', dur: 9, mode: 'Driving', purpose: 'Errand', date: daysAgo(3) },
    { from: 'Home', to: 'Work', dur: 36, mode: 'Driving', purpose: 'Commute', date: daysAgo(4) },
    { from: 'Work', to: 'Coffee', dur: 4, mode: 'Walking', purpose: 'Food', date: daysAgo(4) },
    { from: 'Work', to: 'Gym', dur: 11, mode: 'Driving', purpose: 'Gym', date: daysAgo(5) },
  ];

  function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [...seedTrips];
    } catch { return [...seedTrips]; }
  }

  function save(trips) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(trips)); } catch {}
  }

  function getApiKey() {
    return localStorage.getItem(API_KEY_KEY) || '';
  }

  function setApiKey(key) {
    localStorage.setItem(API_KEY_KEY, key);
  }

  let trips = load();

  function addTrip(t) {
    t.date = new Date().toISOString().split('T')[0];
    trips.unshift(t);
    save(trips);
    return trips;
  }

  function deleteTrip(i) {
    trips.splice(i, 1);
    save(trips);
    return trips;
  }

  function getTrips() { return trips; }

  function getStats() {
    if (!trips.length) return { count: 0, avgDur: 0, topDay: '—', topRoute: '—' };
    const avgDur = Math.round(trips.reduce((a, t) => a + t.dur, 0) / trips.length);
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const dayCounts = {};
    trips.forEach(t => {
      const d = days[new Date(t.date).getDay()];
      dayCounts[d] = (dayCounts[d] || 0) + 1;
    });
    const topDay = Object.entries(dayCounts).sort((a,b) => b[1]-a[1])[0]?.[0] || '—';

    const routeCounts = {};
    trips.forEach(t => {
      const k = `${t.from} → ${t.to}`;
      routeCounts[k] = (routeCounts[k] || 0) + 1;
    });
    const topRoute = Object.entries(routeCounts).sort((a,b) => b[1]-a[1])[0]?.[0] || '—';

    return { count: trips.length, avgDur, topDay, topRoute };
  }

  function getFrequentRoutes() {
    const map = {};
    trips.forEach(t => {
      const k = `${t.from}|||${t.to}`;
      if (!map[k]) map[k] = { from: t.from, to: t.to, count: 0, durs: [], modes: {} };
      map[k].count++;
      map[k].durs.push(t.dur);
      map[k].modes[t.mode] = (map[k].modes[t.mode] || 0) + 1;
    });
    return Object.values(map)
      .sort((a,b) => b.count - a.count)
      .slice(0, 6)
      .map(r => ({
        ...r,
        avgDur: Math.round(r.durs.reduce((a,b) => a+b,0) / r.durs.length),
        topMode: Object.entries(r.modes).sort((a,b) => b[1]-a[1])[0]?.[0]
      }));
  }

  function getDayBreakdown() {
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const counts = { Mon:0, Tue:0, Wed:0, Thu:0, Fri:0, Sat:0, Sun:0 };
    const dayMap = [6,0,1,2,3,4,5];
    trips.forEach(t => {
      const idx = dayMap[new Date(t.date).getDay()];
      counts[days[idx]]++;
    });
    return counts;
  }

  function getModeBreakdown() {
    const modes = {};
    trips.forEach(t => { modes[t.mode] = (modes[t.mode] || 0) + 1; });
    const total = trips.length || 1;
    return Object.entries(modes)
      .sort((a,b) => b[1]-a[1])
      .map(([mode, count]) => ({ mode, pct: Math.round(count/total*100) }));
  }

  const calendarEvents = [
    { time: '9:00 AM', title: 'Team standup', loc: null },
    { time: '12:00 PM', title: 'Lunch with Sarah', loc: 'Capitol Hill, Seattle', depart: '11:42 AM', eta: '14 min' },
    { time: '3:00 PM', title: 'Dentist appt', loc: 'First Hill Dental', depart: '2:46 AM', eta: '8 min' },
    { time: '6:00 PM', title: 'Gym', loc: 'Seattle Athletic Club', depart: '5:47 PM', eta: '12 min' },
  ];

  return { addTrip, deleteTrip, getTrips, getStats, getFrequentRoutes, getDayBreakdown, getModeBreakdown, calendarEvents, getApiKey, setApiKey };
})();
