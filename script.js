// ============================================================
//  CareSync – Smart Elderly Care & Assisted Living Ecosystem
//  script.js  |  v1.0  |  Hackathon MVP
// ============================================================

'use strict';

// ── SAMPLE DATA ──────────────────────────────────────────────
const SAMPLE_MEDICATIONS = [
  {
    id: 'med1', name: 'Amlodipine 5mg', time: '09:00', timeLabel: '09:00 AM',
    purpose: 'Sample Blood Pressure Routine',
    food: 'After Breakfast', color: '#0D9488',
    status: 'pending', note: 'Take with a full glass of water.'
  },
  {
    id: 'med2', name: 'Metformin 500mg', time: '14:00', timeLabel: '02:00 PM',
    purpose: 'Sample Blood Sugar Routine',
    food: 'With Lunch', color: '#1E3A8A',
    status: 'pending', note: 'Must be taken with food.'
  },
  {
    id: 'med3', name: 'Atorvastatin 10mg', time: '21:00', timeLabel: '09:00 PM',
    purpose: 'Sample Cholesterol Routine',
    food: 'After Dinner', color: '#7C3AED',
    status: 'pending', note: 'Best taken in the evening.'
  }
];

const SAMPLE_APPOINTMENTS = [
  {
    id: 'apt1', doctor: 'Dr. Priya Sharma', specialty: 'Cardiology',
    hospital: 'City Heart Institute, Delhi',
    date: futureDateStr(3), time: '10:30 AM',
    prep: 'Fasting required (8 hours). Bring previous ECG reports.'
  },
  {
    id: 'apt2', doctor: 'Dr. Rajan Mehta', specialty: 'Ophthalmology',
    hospital: 'Vision Care Clinic, Gurugram',
    date: futureDateStr(10), time: '03:00 PM',
    prep: 'Avoid driving after appointment. Eye drops will be administered.'
  }
];

const SAMPLE_DISCHARGE = `DISCHARGE SUMMARY
Patient: Ramesh Kumar | Age: 74 | Ward: Cardiology
Admission: 2026-11-10 | Discharge: 2026-11-14

PRESCRIBED MEDICATIONS:
- Aspirin 75mg - Once daily - After breakfast
- Ramipril 2.5mg - Once daily - Morning (09:00 AM)

FOLLOW-UP APPOINTMENTS:
- Dr. Priya Sharma - Cardiology - 2026-11-25 10:00 AM - City Heart Institute
- Dr. Arvind Nair - Nephrology - 2026-12-05 11:30 AM - Kidney Care Clinic

INSTRUCTIONS:
Avoid heavy exertion. Low sodium diet. Contact emergency if chest pain recurs.`;

const ACTIVITY_LOG_SAMPLE = [
  { id: 'l1', ts: Date.now() - 3600000 * 2, icon: '💊', msg: 'Amlodipine 5mg marked as Taken (09:00 AM)', type: 'success' },
  { id: 'l2', ts: Date.now() - 3600000 * 5, icon: '📅', msg: 'Appointment with Dr. Priya Sharma added.', type: 'info' },
  { id: 'l3', ts: Date.now() - 3600000 * 8, icon: '😊', msg: 'Mood Check-In: Patient reported feeling Happy.', type: 'info' }
];

const SAMPLE_STREAK = [
  { label: 'Mon', pct: 100 }, { label: 'Tue', pct: 67 }, { label: 'Wed', pct: 100 },
  { label: 'Thu', pct: 100 }, { label: 'Fri', pct: 33 }, { label: 'Sat', pct: 67 },
  { label: 'Sun', pct: 0 }
];

function futureDateStr(daysAhead) {
  const d = new Date(); d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

// ── STATE ─────────────────────────────────────────────────────
let state = {};

function loadState() {
  try {
    const saved = localStorage.getItem('caresync_state');
    if (saved) { state = JSON.parse(saved); }
    else { resetToSampleData(false); }
  } catch (e) { resetToSampleData(false); }
}

function saveState() {
  localStorage.setItem('caresync_state', JSON.stringify(state));
}

function resetToSampleData(ask = true) {
  if (ask && !confirm('⚠️ Reset all demo data? This will restore original sample medications, appointments, and clear the activity log. Continue?')) return;
  state = {
    mode: 'elderly',
    lang: 'en',
    medications: JSON.parse(JSON.stringify(SAMPLE_MEDICATIONS)),
    appointments: JSON.parse(JSON.stringify(SAMPLE_APPOINTMENTS)),
    activityLog: JSON.parse(JSON.stringify(ACTIVITY_LOG_SAMPLE)),
    streak: JSON.parse(JSON.stringify(SAMPLE_STREAK)),
    caretakerEmail: 'caretaker@example.com',
    patientName: 'Ramesh Kumar',
    caretakerName: 'Sunita Kumar',
    caretakerRole: 'Primary Caretaker'
  };
  saveState();
  if (ask) { renderAll(); showToast('Demo data restored successfully.', 'success'); }
}

// ── TRANSLATIONS ──────────────────────────────────────────────
const T = {
  en: {
    greeting_morning: 'Good Morning', greeting_afternoon: 'Good Afternoon', greeting_evening: 'Good Evening',
    today_meds: "Today's Medications", upcoming_appts: 'Upcoming Appointments',
    mark_taken: 'Mark as Taken', mark_missed: 'Mark Missed', taken: 'Taken', missed: 'Missed', pending: 'Pending',
    read_aloud: '🔊 Read My Schedule Aloud', stop_reading: '⏹ Stop Reading',
    mood_title: '💬 How are you feeling right now?',
    mood_happy: 'Happy 😊', mood_tired: 'Tired 😴', mood_pain: 'In Pain 😣', mood_dizzy: 'Dizzy 🌀',
    mood_logged: '✅ Mood logged — your caretaker has been notified!',
    adherence: 'Medication Adherence', streak: '7-Day Streak',
    activity_log: 'Activity Log', reminder_centre: 'Reminder Centre',
    discharge_parser: 'Discharge Note Parser',
    add_medication: 'Add Medication', add_appointment: 'Add Appointment',
    sos_title: '🚨 Emergency SOS', sos_sub: 'Tap to alert your caretaker immediately',
    edit: 'Edit', delete: 'Delete', save: 'Save', cancel: 'Cancel', close: 'Close',
    caretaker_portal: 'Caretaker Portal', switch_elderly: 'Elderly Mode',
    medicines_taken_today: 'of medicines taken today',
    conflict_warn: '⚠️ Schedule Warning',
    sim_dose: '💊 Simulate Dose Reminder',
    sim_missed: '⚠️ Simulate Missed Alert',
    sim_appt: '📅 Simulate Appointment Reminder',
    email_config: 'Caretaker Email:', save_email: 'Save',
    load_sample: '📄 Load Sample Discharge', extract_preview: '🔍 Extract & Preview',
    confirm_add: 'Confirm & Add to Schedule',
  },
  hi: {
    greeting_morning: 'सुप्रभात', greeting_afternoon: 'शुभ दोपहर', greeting_evening: 'शुभ संध्या',
    today_meds: 'आज की दवाइयाँ', upcoming_appts: 'आगामी डॉक्टर अपॉइंटमेंट',
    mark_taken: 'दवा ली ✓', mark_missed: 'छूट गई ✗', taken: 'ली गई', missed: 'छूटी', pending: 'बाकी',
    read_aloud: '🔊 मेरा शेड्यूल पढ़ें', stop_reading: '⏹ रोकें',
    mood_title: '💬 आप अभी कैसा महसूस कर रहे हैं?',
    mood_happy: 'खुश 😊', mood_tired: 'थका हुआ 😴', mood_pain: 'दर्द में 😣', mood_dizzy: 'चक्कर 🌀',
    mood_logged: '✅ मूड दर्ज हुआ — देखभालकर्ता को सूचित किया गया!',
    adherence: 'दवा पालन', streak: '7-दिन की स्थिति',
    activity_log: 'गतिविधि लॉग', reminder_centre: 'रिमाइंडर केंद्र',
    discharge_parser: 'डिस्चार्ज नोट पार्सर',
    add_medication: 'दवा जोड़ें', add_appointment: 'अपॉइंटमेंट जोड़ें',
    sos_title: '🚨 आपातकाल SOS', sos_sub: 'देखभालकर्ता को तुरंत अलर्ट करें',
    edit: 'संपादित', delete: 'हटाएं', save: 'सहेजें', cancel: 'रद्द करें', close: 'बंद करें',
    caretaker_portal: 'देखभालकर्ता पोर्टल', switch_elderly: 'बुजुर्ग मोड',
    medicines_taken_today: 'आज की दवाइयाँ ली गई',
    conflict_warn: '⚠️ शेड्यूल चेतावनी',
    sim_dose: '💊 डोज़ रिमाइंडर',
    sim_missed: '⚠️ मिस अलर्ट',
    sim_appt: '📅 अपॉइंटमेंट रिमाइंडर',
    email_config: 'देखभालकर्ता ईमेल:', save_email: 'सहेजें',
    load_sample: '📄 नमूना नोट लोड करें', extract_preview: '🔍 निकालें और देखें',
    confirm_add: 'पुष्टि करें और जोड़ें',
  }
};

function t(key) { return (T[state.lang] || T.en)[key] || key; }

// ── DOM HELPERS ───────────────────────────────────────────────
const $ = id => document.getElementById(id);
const qs = sel => document.querySelector(sel);
const qsa = sel => document.querySelectorAll(sel);

function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  });
  children.forEach(c => c && e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
  return e;
}

function showToast(msg, type = 'info') {
  let tw = $('toast-wrap');
  if (!tw) { tw = el('div', { id: 'toast-wrap', style: 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:2000;display:flex;flex-direction:column;gap:.5rem;' }); document.body.appendChild(tw); }
  const colors = { success: '#059669', danger: '#DC2626', warn: '#D97706', info: '#1E3A8A' };
  const toast = el('div', {
    style: `background:${colors[type]||colors.info};color:#fff;padding:.75rem 1.25rem;border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,.2);font-size:.88rem;font-weight:600;max-width:320px;animation:fadeInUp .3s ease;`
  }, msg);
  tw.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .4s'; setTimeout(() => toast.remove(), 400); }, 3500);
}

// ── MODAL HELPERS ─────────────────────────────────────────────
function openModal(id) {
  const ov = $(id); if (!ov) return;
  ov.classList.add('open');
  ov.addEventListener('click', e => { if (e.target === ov) closeModal(id); }, { once: true });
}
function closeModal(id) {
  const ov = $(id); if (!ov) return;
  ov.classList.remove('open');
}

// ── DATE/TIME ─────────────────────────────────────────────────
function formatDate(d = new Date()) {
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return t('greeting_morning');
  if (h < 17) return t('greeting_afternoon');
  return t('greeting_evening');
}

function daysUntil(dateStr) {
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(dateStr); d.setHours(0,0,0,0);
  return Math.round((d - today) / 86400000);
}

function formatTs(ts) {
  return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) +
    ', ' + new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function countdownLabel(dateStr) {
  const d = daysUntil(dateStr);
  if (d === 0) return { text: '📍 Today', cls: 'today' };
  if (d === 1) return { text: '⏰ Tomorrow', cls: 'soon' };
  if (d < 0) return { text: `${Math.abs(d)}d ago`, cls: 'upcoming' };
  return { text: `📅 In ${d} days`, cls: 'upcoming' };
}

// ── PROGRESS RING ─────────────────────────────────────────────
function updateProgressRing() {
  const meds = state.medications;
  const total = meds.length;
  const taken = meds.filter(m => m.status === 'taken').length;
  const pct = total ? Math.round((taken / total) * 100) : 0;
  const circumference = 2 * Math.PI * 30;
  const offset = circumference - (pct / 100) * circumference;
  const ring = $('progress-ring-fg');
  if (ring) { ring.style.strokeDasharray = circumference; ring.style.strokeDashoffset = offset; }
  const txt = $('progress-ring-text');
  if (txt) txt.innerHTML = `${taken}<small>/${total}</small>`;
  const sub = $('greet-sub-meds');
  if (sub) sub.textContent = `${taken} of ${total} ${t('medicines_taken_today')}`;
}

// ── ADHERENCE ─────────────────────────────────────────────────
function getAdherence() {
  const meds = state.medications;
  const decided = meds.filter(m => m.status !== 'pending');
  if (!decided.length) return 0;
  return Math.round((meds.filter(m => m.status === 'taken').length / meds.length) * 100);
}

function renderAdherence() {
  const pct = getAdherence();
  const pctEl = $('adh-pct'); if (pctEl) pctEl.textContent = pct + '%';
  const bar = $('adh-bar'); if (bar) bar.style.width = pct + '%';
  renderStreak();
}

function renderStreak() {
  const sg = $('streak-grid'); if (!sg) return;
  sg.innerHTML = '';
  state.streak.forEach(day => {
    const cls = day.pct >= 80 ? 'great' : day.pct >= 50 ? 'ok' : day.pct > 0 ? 'poor' : 'empty';
    sg.innerHTML += `<div class="streak-day ${cls}"><span>${day.pct > 0 ? day.pct + '%' : '—'}</span><span class="s-label">${day.label}</span></div>`;
  });
}

// ── ACTIVITY LOG ──────────────────────────────────────────────
function logActivity(icon, msg, type = 'info') {
  state.activityLog.unshift({ id: 'l' + Date.now(), ts: Date.now(), icon, msg, type });
  if (state.activityLog.length > 100) state.activityLog.pop();
  saveState();
  renderActivityLog();
}

function renderActivityLog() {
  const list = $('activity-log-list'); if (!list) return;
  if (!state.activityLog.length) {
    list.innerHTML = '<div class="empty-state"><div class="empty-icon">📋</div><p>No activity yet.</p></div>';
    return;
  }
  list.innerHTML = state.activityLog.slice(0, 50).map(e =>
    `<div class="log-entry ${e.type}">
      <span class="log-icon">${e.icon}</span>
      <span class="log-msg">${e.msg}</span>
      <span class="log-time">${formatTs(e.ts)}</span>
    </div>`).join('');
}

// ── CONFLICT CHECKER ──────────────────────────────────────────
function checkConflicts() {
  const warnings = [];
  const times = {};
  state.medications.forEach(m => {
    if (times[m.time]) warnings.push(`⏱ "${m.name}" and "${times[m.time]}" are both scheduled at ${m.timeLabel}.`);
    else times[m.time] = m.name;
  });
  const fastingMeds = state.medications.filter(m => /fast/i.test(m.food));
  const afterMealMeds = state.medications.filter(m => /after|with lunch|with dinner|with breakfast/i.test(m.food));
  if (fastingMeds.length && afterMealMeds.length) {
    warnings.push(`🍽 Note: Some medications require fasting while others require food intake. Please follow individual instructions.`);
  }
  const cb = $('conflict-banner');
  if (cb) {
    if (warnings.length) {
      cb.innerHTML = `<strong>${t('conflict_warn')}:</strong> ${warnings.join(' | ')} <em style="display:block;margin-top:.3rem;font-size:.75rem;">Note: This is a schedule check only — not clinical drug-interaction verification.</em>`;
      cb.classList.add('visible');
    } else {
      cb.classList.remove('visible');
    }
  }
}

// ── RENDER MEDICATIONS ────────────────────────────────────────
function renderMedications(containerId = 'med-cards-elderly') {
  const container = $(containerId); if (!container) return;
  if (!state.medications.length) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">💊</div><p>No medications added yet.</p></div>';
    return;
  }
  container.innerHTML = state.medications.map(m => `
    <div class="med-card ${m.status} fade-in" id="medcard-${m.id}">
      <div class="med-card-top">
        <div class="med-name">💊 ${m.name}</div>
        <div class="med-time-badge">⏰ ${m.timeLabel}</div>
      </div>
      <div class="med-purpose">📌 ${m.purpose}</div>
      <div class="med-food">🍽 ${m.food}</div>
      ${m.note ? `<div class="text-sm text-muted mb-1">📝 ${m.note}</div>` : ''}
      <div class="med-actions">
        ${m.status !== 'taken'
          ? `<button class="btn btn-success" onclick="markMed('${m.id}','taken')">✅ ${t('mark_taken')}</button>`
          : `<span class="badge badge-success">✅ ${t('taken')}</span>`}
        ${m.status !== 'missed'
          ? `<button class="btn btn-danger btn-sm" onclick="markMed('${m.id}','missed')">❌ ${t('mark_missed')}</button>`
          : `<span class="badge badge-danger">❌ ${t('missed')}</span>`}
        ${m.status !== 'pending' ? `<button class="btn btn-ghost btn-sm" onclick="markMed('${m.id}','pending')">↩ Reset</button>` : ''}
        ${containerId === 'med-cards-caretaker' ? `
          <button class="btn btn-secondary btn-sm" onclick="openEditMedModal('${m.id}')">✏️ ${t('edit')}</button>
          <button class="btn btn-danger btn-sm" onclick="deleteMed('${m.id}')">🗑 ${t('delete')}</button>
        ` : ''}
      </div>
    </div>`).join('');
}

function markMed(id, status) {
  const med = state.medications.find(m => m.id === id);
  if (!med) return;
  med.status = status;
  saveState();
  const icon = status === 'taken' ? '✅' : status === 'missed' ? '❌' : '↩';
  const type = status === 'taken' ? 'success' : status === 'missed' ? 'urgent' : 'info';
  logActivity(icon, `${med.name} marked as ${status.charAt(0).toUpperCase() + status.slice(1)} (${med.timeLabel})`, type);
  renderMedications('med-cards-elderly');
  renderMedications('med-cards-caretaker');
  updateProgressRing();
  renderAdherence();
  checkConflicts();
  showToast(`${med.name} marked as ${status}.`, type === 'success' ? 'success' : type === 'urgent' ? 'danger' : 'info');
}

function deleteMed(id) {
  if (!confirm('Delete this medication?')) return;
  const med = state.medications.find(m => m.id === id);
  state.medications = state.medications.filter(m => m.id !== id);
  saveState();
  logActivity('🗑', `Medication "${med?.name}" deleted from schedule.`, 'info');
  renderMedications('med-cards-elderly');
  renderMedications('med-cards-caretaker');
  updateProgressRing();
  renderAdherence();
  checkConflicts();
  renderStatCards();
  showToast('Medication deleted.', 'warn');
}

// ── MED FORM MODAL ────────────────────────────────────────────
let editingMedId = null;

function openAddMedModal() {
  editingMedId = null;
  $('med-modal-title').textContent = 'Add Medication';
  $('med-form').reset();
  openModal('med-modal');
}

function openEditMedModal(id) {
  const med = state.medications.find(m => m.id === id);
  if (!med) return;
  editingMedId = id;
  $('med-modal-title').textContent = 'Edit Medication';
  $('med-form-name').value = med.name;
  $('med-form-time').value = med.time;
  $('med-form-purpose').value = med.purpose;
  $('med-form-food').value = med.food;
  $('med-form-note').value = med.note || '';
  openModal('med-modal');
}

function saveMedForm() {
  const name = $('med-form-name').value.trim();
  const time = $('med-form-time').value;
  const purpose = $('med-form-purpose').value.trim();
  const food = $('med-form-food').value.trim();
  const note = $('med-form-note').value.trim();
  if (!name || !time) { showToast('Name and time are required.', 'danger'); return; }
  const h = parseInt(time.split(':')[0]);
  const ampm = h < 12 ? 'AM' : 'PM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const timeLabel = `${String(h12).padStart(2,'0')}:${time.split(':')[1]} ${ampm}`;

  if (editingMedId) {
    const med = state.medications.find(m => m.id === editingMedId);
    Object.assign(med, { name, time, timeLabel, purpose, food, note });
    logActivity('✏️', `Medication "${name}" updated.`, 'info');
    showToast('Medication updated.', 'success');
  } else {
    const newMed = { id: 'med' + Date.now(), name, time, timeLabel, purpose, food, note, status: 'pending' };
    state.medications.push(newMed);
    state.medications.sort((a, b) => a.time.localeCompare(b.time));
    logActivity('➕', `New medication "${name}" added at ${timeLabel}.`, 'info');
    showToast('Medication added.', 'success');
  }
  saveState();
  closeModal('med-modal');
  renderMedications('med-cards-elderly');
  renderMedications('med-cards-caretaker');
  updateProgressRing();
  renderAdherence();
  checkConflicts();
  renderStatCards();
}

// ── RENDER APPOINTMENTS ───────────────────────────────────────
function renderAppointments(containerId = 'appt-cards-elderly') {
  const container = $(containerId); if (!container) return;
  if (!state.appointments.length) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">📅</div><p>No appointments scheduled.</p></div>';
    return;
  }
  container.innerHTML = state.appointments.map(a => {
    const cd = countdownLabel(a.date);
    return `
    <div class="appt-card fade-in">
      <div class="appt-countdown ${cd.cls}">${cd.text}</div>
      <div class="appt-doctor">👨‍⚕️ ${a.doctor}</div>
      <div class="appt-spec">${a.specialty}</div>
      <div class="appt-hospital">🏥 ${a.hospital}</div>
      <div class="appt-datetime">📅 ${new Date(a.date).toLocaleDateString('en-IN', { day:'numeric',month:'long',year:'numeric' })} &nbsp;⏰ ${a.time}</div>
      ${a.prep ? `<div class="appt-prep">⚠️ ${a.prep}</div>` : ''}
      ${containerId === 'appt-cards-caretaker' ? `
      <div class="appt-actions">
        <button class="btn btn-secondary btn-sm" onclick="openEditApptModal('${a.id}')">✏️ ${t('edit')}</button>
        <button class="btn btn-danger btn-sm" onclick="deleteAppt('${a.id}')">🗑 ${t('delete')}</button>
      </div>` : ''}
    </div>`;
  }).join('');
}

function deleteAppt(id) {
  if (!confirm('Delete this appointment?')) return;
  const appt = state.appointments.find(a => a.id === id);
  state.appointments = state.appointments.filter(a => a.id !== id);
  saveState();
  logActivity('🗑', `Appointment with ${appt?.doctor} deleted.`, 'info');
  renderAppointments('appt-cards-elderly');
  renderAppointments('appt-cards-caretaker');
  renderStatCards();
  showToast('Appointment deleted.', 'warn');
}

// ── APPT FORM MODAL ───────────────────────────────────────────
let editingApptId = null;

function openAddApptModal() {
  editingApptId = null;
  $('appt-modal-title').textContent = 'Add Appointment';
  $('appt-form').reset();
  openModal('appt-modal');
}

function openEditApptModal(id) {
  const appt = state.appointments.find(a => a.id === id);
  if (!appt) return;
  editingApptId = id;
  $('appt-modal-title').textContent = 'Edit Appointment';
  $('appt-form-doctor').value = appt.doctor;
  $('appt-form-spec').value = appt.specialty;
  $('appt-form-hospital').value = appt.hospital;
  $('appt-form-date').value = appt.date;
  $('appt-form-time').value = appt.time;
  $('appt-form-prep').value = appt.prep || '';
  openModal('appt-modal');
}

function saveApptForm() {
  const doctor = $('appt-form-doctor').value.trim();
  const specialty = $('appt-form-spec').value.trim();
  const hospital = $('appt-form-hospital').value.trim();
  const date = $('appt-form-date').value;
  const time = $('appt-form-time').value.trim();
  const prep = $('appt-form-prep').value.trim();
  if (!doctor || !date) { showToast('Doctor name and date are required.', 'danger'); return; }

  if (editingApptId) {
    const appt = state.appointments.find(a => a.id === editingApptId);
    Object.assign(appt, { doctor, specialty, hospital, date, time, prep });
    logActivity('✏️', `Appointment with ${doctor} updated.`, 'info');
    showToast('Appointment updated.', 'success');
  } else {
    const newAppt = { id: 'apt' + Date.now(), doctor, specialty, hospital, date, time, prep };
    state.appointments.push(newAppt);
    state.appointments.sort((a, b) => a.date.localeCompare(b.date));
    logActivity('📅', `New appointment with ${doctor} (${specialty}) added.`, 'info');
    showToast('Appointment added.', 'success');
  }
  saveState();
  closeModal('appt-modal');
  renderAppointments('appt-cards-elderly');
  renderAppointments('appt-cards-caretaker');
  renderStatCards();
}

// ── STAT CARDS ────────────────────────────────────────────────
function renderStatCards() {
  const sc = $('stat-cards'); if (!sc) return;
  const total = state.medications.length;
  const taken = state.medications.filter(m => m.status === 'taken').length;
  const missed = state.medications.filter(m => m.status === 'missed').length;
  const apptCount = state.appointments.length;
  const adh = getAdherence();
  sc.innerHTML = `
    <div class="stat-card"><div class="stat-icon">💊</div><div class="stat-val">${total}</div><div class="stat-lbl">Total Medications</div></div>
    <div class="stat-card"><div class="stat-icon">✅</div><div class="stat-val">${taken}</div><div class="stat-lbl">Taken Today</div></div>
    <div class="stat-card"><div class="stat-icon">❌</div><div class="stat-val">${missed}</div><div class="stat-lbl">Missed Today</div></div>
    <div class="stat-card"><div class="stat-icon">📅</div><div class="stat-val">${apptCount}</div><div class="stat-lbl">Appointments</div></div>
    <div class="stat-card"><div class="stat-icon">📊</div><div class="stat-val">${adh}%</div><div class="stat-lbl">Adherence Rate</div></div>
    <div class="stat-card"><div class="stat-icon">📝</div><div class="stat-val">${state.activityLog.length}</div><div class="stat-lbl">Activity Entries</div></div>`;
}

// ── MOOD CHECK-IN ─────────────────────────────────────────────
function logMood(mood, emoji) {
  logActivity(emoji, `Mood Check-In: Patient reported feeling ${mood}.`, 'info');
  saveState();
  const conf = $('mood-confirm');
  if (conf) { conf.style.display = 'block'; conf.textContent = t('mood_logged'); }
  setTimeout(() => { if (conf) conf.style.display = 'none'; }, 4000);
  showToast(t('mood_logged'), 'success');
}

// ── READ ALOUD ────────────────────────────────────────────────
let isSpeaking = false;

function readScheduleAloud() {
  if (isSpeaking) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    updateReadAloudBtn();
    return;
  }
  const meds = state.medications;
  let text = `Hello ${state.patientName}. Here is your medication schedule for today. `;
  meds.forEach((m, i) => {
    text += `Medication ${i+1}: ${m.name}. Time: ${m.timeLabel}. Instructions: ${m.food}. Status: ${m.status}. `;
  });
  text += `You have ${state.appointments.length} upcoming appointments. Have a great day!`;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = state.lang === 'hi' ? 'hi-IN' : 'en-IN';
  utter.rate = 0.9; utter.pitch = 1;
  utter.onend = () => { isSpeaking = false; updateReadAloudBtn(); };
  utter.onerror = () => { isSpeaking = false; updateReadAloudBtn(); };
  window.speechSynthesis.speak(utter);
  isSpeaking = true;
  updateReadAloudBtn();
}

function updateReadAloudBtn() {
  const btn = $('read-aloud-btn');
  if (btn) btn.textContent = isSpeaking ? t('stop_reading') : t('read_aloud');
}

// ── SOS ───────────────────────────────────────────────────────
function triggerSOS() {
  logActivity('🚨', 'EMERGENCY SOS TRIGGERED by patient/caretaker!', 'urgent');
  saveState();
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 300, 600].forEach(delay => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine'; osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.4, ctx.currentTime + delay/1000);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay/1000 + 0.25);
      osc.start(ctx.currentTime + delay/1000);
      osc.stop(ctx.currentTime + delay/1000 + 0.3);
    });
  } catch(e) {}

  const email = encodeURIComponent(state.caretakerEmail);
  const sub = encodeURIComponent(`🚨 URGENT: Emergency SOS Alert – ${state.patientName}`);
  const body = encodeURIComponent(`EMERGENCY ALERT\n\nPatient: ${state.patientName}\nTime: ${new Date().toLocaleString()}\nStatus: Patient has triggered an Emergency SOS alert.\n\nPlease contact immediately!\n\n— CareSync Emergency System`);
  $('sos-mailto-link').href = `mailto:${email}?subject=${sub}&body=${body}`;

  const waMsg = encodeURIComponent(`🚨 EMERGENCY ALERT: ${state.patientName} has triggered an SOS at ${new Date().toLocaleTimeString()}. Please contact immediately!`);
  $('sos-wa-link').href = `https://wa.me/?text=${waMsg}`;

  openModal('sos-modal');
}

// ── REMINDER/EMAIL SIMULATION ─────────────────────────────────
function saveEmail() {
  const em = $('caretaker-email-input').value.trim();
  if (!em) { showToast('Please enter an email address.', 'danger'); return; }
  state.caretakerEmail = em;
  saveState();
  showToast('Email address saved!', 'success');
}

function simulateReminder(type) {
  const email = state.caretakerEmail || 'caretaker@example.com';
  let subject, body, logMsg;
  const now = new Date().toLocaleString('en-IN');

  if (type === 'dose') {
    const nextMed = state.medications.find(m => m.status === 'pending') || state.medications[0];
    subject = `💊 Upcoming Dose Reminder: ${nextMed?.name || 'Medication'} – CareSync`;
    body = `Dear Caretaker,\n\nThis is a reminder that ${state.patientName}'s upcoming dose is due:\n\n📌 Medication: ${nextMed?.name || 'N/A'}\n⏰ Scheduled Time: ${nextMed?.timeLabel || 'N/A'}\n🍽 Instructions: ${nextMed?.food || 'N/A'}\n\nPlease ensure the medication is taken on time.\n\nTimestamp: ${now}\n\n— CareSync Smart Care System\n[SIMULATED AUTOMATED NOTIFICATION]`;
    logMsg = `Dose reminder simulated for ${nextMed?.name}.`;
  } else if (type === 'missed') {
    const missed = state.medications.filter(m => m.status === 'missed');
    subject = `⚠️ MISSED MEDICATION ALERT – ${state.patientName} – CareSync`;
    body = `URGENT NOTIFICATION\n\nPatient: ${state.patientName}\n\nThe following medication(s) were MISSED:\n${missed.map(m => `• ${m.name} (${m.timeLabel})`).join('\n') || '• (No missed meds currently – simulated)'}\n\nPlease follow up immediately.\n\nTimestamp: ${now}\n\n— CareSync Smart Care System\n[SIMULATED AUTOMATED NOTIFICATION]`;
    logMsg = `Missed medication alert simulated (${missed.length} missed).`;
  } else {
    const nextAppt = state.appointments[0];
    subject = `📅 Appointment Reminder: ${nextAppt?.doctor || 'Doctor'} – CareSync`;
    body = `Dear Caretaker,\n\nReminder for upcoming appointment:\n\n👨‍⚕️ Doctor: ${nextAppt?.doctor || 'N/A'}\n🏥 Specialty: ${nextAppt?.specialty || 'N/A'}\n📍 Hospital: ${nextAppt?.hospital || 'N/A'}\n📅 Date: ${nextAppt?.date || 'N/A'}\n⏰ Time: ${nextAppt?.time || 'N/A'}\n${nextAppt?.prep ? `⚠️ Preparation: ${nextAppt.prep}` : ''}\n\nTimestamp: ${now}\n\n— CareSync Smart Care System\n[SIMULATED AUTOMATED NOTIFICATION]`;
    logMsg = `Appointment reminder simulated for ${nextAppt?.doctor}.`;
  }

  logActivity('📧', logMsg, 'info');
  saveState();

  $('email-preview-to').textContent = email;
  $('email-preview-subject').textContent = subject;
  $('email-preview-time').textContent = now;
  $('email-preview-body').textContent = body;
  $('email-mailto-btn').href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  openModal('email-modal');
  renderActivityLog();
}

// ── DISCHARGE PARSER ──────────────────────────────────────────
function loadSampleDischarge() {
  $('discharge-textarea').value = SAMPLE_DISCHARGE;
  $('discharge-preview').style.display = 'none';
}

function extractDischarge() {
  const text = $('discharge-textarea').value;
  if (!text.trim()) { showToast('Please enter or load a discharge summary.', 'warn'); return; }

  const medMatches = [];
  const lines = text.split('\n');
  lines.forEach(line => {
    const m = line.match(/[-•]\s*([A-Z][a-zA-Z\s]+\d+(?:\.\d+)?mg)[^\-]*([\d:]+\s*(?:AM|PM)?)?.*?(?:-(.*?))?$/i);
    if (m) {
      const name = m[1].trim();
      const time = m[2]?.trim() || '08:00 AM';
      const food = line.match(/after (breakfast|lunch|dinner)/i)?.[0] || line.match(/morning/i)?.[0] || 'As directed';
      medMatches.push({ type: 'med', name, time, food, raw: line.trim() });
    }
  });

  const apptMatches = [];
  lines.forEach(line => {
    const m = line.match(/[-•]\s*(Dr\.?\s+[A-Z][a-zA-Z\s]+)\s*-\s*([A-Za-z\s]+)\s*-\s*(\d{4}-\d{2}-\d{2})\s*([\d:]+\s*(?:AM|PM)?)?/i);
    if (m) {
      apptMatches.push({ type: 'appt', doctor: m[1].trim(), specialty: m[2].trim(), date: m[3].trim(), time: m[4]?.trim() || '10:00 AM', raw: line.trim() });
    }
  });

  const preview = $('discharge-preview');
  const list = $('discharge-items');
  if (!medMatches.length && !apptMatches.length) {
    showToast('No recognizable medication or appointment patterns found.', 'warn');
    return;
  }
  list.innerHTML = [...medMatches, ...apptMatches].map((item, i) =>
    `<div class="parsed-item">
      <input type="checkbox" id="pi${i}" data-idx="${i}" checked>
      <label for="pi${i}" style="cursor:pointer;flex:1;">
        ${item.type === 'med'
          ? `💊 <strong>${item.name}</strong> — ${item.time} — ${item.food}`
          : `📅 <strong>${item.doctor}</strong> (${item.specialty}) — ${item.date} at ${item.time}`}
      </label>
      <span class="badge ${item.type === 'med' ? 'badge-teal' : 'badge-blue'}">${item.type === 'med' ? 'Medication' : 'Appointment'}</span>
    </div>`
  ).join('');
  preview.style.display = 'block';
  preview.dataset.meds = JSON.stringify(medMatches);
  preview.dataset.appts = JSON.stringify(apptMatches);
}

function confirmDischarge() {
  const preview = $('discharge-preview');
  const allItems = [...JSON.parse(preview.dataset.meds || '[]'), ...JSON.parse(preview.dataset.appts || '[]')];
  const checked = Array.from(qsa('#discharge-items input[type=checkbox]:checked')).map(cb => parseInt(cb.dataset.idx));

  let addedMeds = 0, addedAppts = 0;
  checked.forEach(idx => {
    const item = allItems[idx];
    if (!item) return;
    if (item.type === 'med') {
      const timeStr = item.time.replace(/\s*(AM|PM)/i, '');
      const [hh, mm] = timeStr.split(':').map(Number);
      const h24 = /PM/i.test(item.time) && hh !== 12 ? hh + 12 : /AM/i.test(item.time) && hh === 12 ? 0 : hh;
      const time24 = `${String(h24||8).padStart(2,'0')}:${String(mm||0).padStart(2,'0')}`;
      state.medications.push({ id: 'med' + Date.now() + idx, name: item.name, time: time24, timeLabel: item.time, purpose: 'From Discharge Summary', food: item.food, note: '', status: 'pending' });
      addedMeds++;
    } else {
      state.appointments.push({ id: 'apt' + Date.now() + idx, doctor: item.doctor, specialty: item.specialty, hospital: 'As per discharge', date: item.date, time: item.time, prep: '' });
      addedAppts++;
    }
  });

  state.medications.sort((a,b) => a.time.localeCompare(b.time));
  state.appointments.sort((a,b) => a.date.localeCompare(b.date));
  saveState();
  logActivity('📋', `Discharge parser: added ${addedMeds} medication(s) and ${addedAppts} appointment(s).`, 'success');
  preview.style.display = 'none';
  $('discharge-textarea').value = '';
  renderMedications('med-cards-elderly');
  renderMedications('med-cards-caretaker');
  renderAppointments('appt-cards-elderly');
  renderAppointments('appt-cards-caretaker');
  updateProgressRing();
  renderAdherence();
  checkConflicts();
  renderStatCards();
  showToast(`Added ${addedMeds} med(s) and ${addedAppts} appointment(s) from discharge summary!`, 'success');
}

// ── CARETAKER MODE ────────────────────────────────────────────
function switchToCaretaker() { openModal('pin-modal'); }

function switchToElderly() {
  state.mode = 'elderly';
  document.body.classList.add('elderly-mode');
  saveState();
  $('elderly-view').style.display = 'block';
  $('caretaker-view').style.display = 'none';
  $('mode-badge').textContent = 'Elderly Mode';
  $('mode-badge').className = 'badge mode-badge elderly';
  $('btn-switch-mode').textContent = '🔐 Caretaker Portal';
  $('btn-switch-mode').onclick = switchToCaretaker;
  renderAll();
}

function enterCaretaker() {
  const digits = Array.from(qsa('.pin-digit')).map(i => i.value).join('');
  if (digits !== '1234') {
    $('pin-error').style.display = 'block';
    $('pin-error').textContent = 'Incorrect PIN. Demo PIN is 1234.';
    qsa('.pin-digit').forEach(d => { d.classList.add('shake'); setTimeout(() => d.classList.remove('shake'), 500); });
    return;
  }
  $('pin-error').style.display = 'none';
  qsa('.pin-digit').forEach(d => d.value = '');
  closeModal('pin-modal');
  state.mode = 'caretaker';
  document.body.classList.remove('elderly-mode');
  saveState();
  $('elderly-view').style.display = 'none';
  $('caretaker-view').style.display = 'block';
  $('mode-badge').textContent = 'Caretaker Mode';
  $('mode-badge').className = 'badge mode-badge caretaker';
  $('btn-switch-mode').textContent = '👴 Elderly Mode';
  $('btn-switch-mode').onclick = switchToElderly;
  renderAll();
}

// ── TABS ──────────────────────────────────────────────────────
function switchTab(groupId, tabId) {
  qsa(`#${groupId} .tab-btn`).forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
  qsa(`#${groupId} .tab-panel`).forEach(p => p.classList.toggle('active', p.id === tabId));
}

// ── LANGUAGE TOGGLE ───────────────────────────────────────────
function toggleLang() {
  state.lang = state.lang === 'en' ? 'hi' : 'en';
  saveState();
  $('lang-btn').textContent = state.lang === 'en' ? '🇮🇳 हिन्दी' : '🇬🇧 English';
  renderAll();
}

// ── FONT SIZE ─────────────────────────────────────────────────
let baseFontSize = 16;
function changeFontSize(delta) {
  baseFontSize = Math.max(12, Math.min(24, baseFontSize + delta));
  document.documentElement.style.fontSize = baseFontSize + 'px';
  showToast(`Font size: ${baseFontSize}px`, 'info');
}

// ── RENDER ALL ────────────────────────────────────────────────
function renderAll() {
  renderGreeting();
  renderMedications('med-cards-elderly');
  renderMedications('med-cards-caretaker');
  renderAppointments('appt-cards-elderly');
  renderAppointments('appt-cards-caretaker');
  updateProgressRing();
  renderAdherence();
  renderActivityLog();
  renderStatCards();
  checkConflicts();
  updateLangLabels();
  updateReadAloudBtn();
  if ($('caretaker-email-input')) $('caretaker-email-input').value = state.caretakerEmail || '';
}

function renderGreeting() {
  const gd = $('greet-date'); if (gd) gd.textContent = formatDate();
  const gt = $('greet-text'); if (gt) gt.textContent = `${greeting()}, ${state.patientName}! 👋`;
}

function updateLangLabels() {
  document.querySelectorAll('[data-t]').forEach(el => {
    const key = el.dataset.t;
    if (key) el.textContent = t(key);
  });
  document.querySelectorAll('[data-t-ph]').forEach(el => {
    el.placeholder = t(el.dataset.tPh);
  });
}

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadState();

  // Apply saved mode
  if (state.mode === 'elderly') {
    document.body.classList.add('elderly-mode');
    $('elderly-view').style.display = 'block';
    $('caretaker-view').style.display = 'none';
    $('mode-badge').textContent = 'Elderly Mode';
    $('mode-badge').className = 'badge mode-badge elderly';
    $('btn-switch-mode').textContent = '🔐 Caretaker Portal';
    $('btn-switch-mode').onclick = switchToCaretaker;
  } else {
    $('elderly-view').style.display = 'none';
    $('caretaker-view').style.display = 'block';
    $('mode-badge').textContent = 'Caretaker Mode';
    $('mode-badge').className = 'badge mode-badge caretaker';
    $('btn-switch-mode').textContent = '👴 Elderly Mode';
    $('btn-switch-mode').onclick = switchToElderly;
  }

  $('lang-btn').textContent = state.lang === 'en' ? '🇮🇳 हिन्दी' : '🇬🇧 English';

  // PIN input auto-advance
  qsa('.pin-digit').forEach((input, i, all) => {
    input.addEventListener('input', () => {
      if (input.value.length === 1 && i < all.length - 1) all[i+1].focus();
      if (input.value.length > 1) input.value = input.value.slice(-1);
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !input.value && i > 0) all[i-1].focus();
      if (e.key === 'Enter') enterCaretaker();
    });
  });

  // Caretaker tab switcher
  qsa('#ct-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab('ct-tabs', btn.dataset.tab));
  });

  renderAll();
});
