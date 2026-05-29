/* ================================================
   DEMORA BASKETBALL — Admin Shared JS
   ================================================ */

/* ── SUPABASE CONFIG ── */
const SUPABASE_URL      = 'https://smgyhukoxmlzadrlusnd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZ3lodWtveG1semFkcmx1c25kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMDU2MDksImV4cCI6MjA5NTU4MTYwOX0.r3nXB1rY7k3UPVufO0-CMOVrDWwte-8fmlETCKdQRmQ';

let db;
if (typeof window !== 'undefined' && window.supabase && SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
  db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/* ── AUTH GUARD ── */
async function requireAuth() {
  if (!db) return; // dev mode — no Supabase yet
  const { data: { session } } = await db.auth.getSession();
  if (!session) window.location.href = 'login.html';
}

/* ── MARK ACTIVE NAV LINK ── */
function markActive() {
  const file = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-nav a').forEach(a => {
    if ((a.getAttribute('href') || '').split('/').pop() === file) a.classList.add('active');
  });
}

/* ── SIGN OUT ── */
async function signOut() {
  if (db) await db.auth.signOut();
  window.location.href = 'login.html';
}

/* ── TOAST ── */
function toast(msg, type = 'success') {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    el.innerHTML = '<span class="toast-dot"></span><span id="toast-msg"></span>';
    document.body.appendChild(el);
  }
  el.className = `toast ${type}`;
  document.getElementById('toast-msg').textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 3200);
}

/* ── MODAL HELPERS ── */
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('open');
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
}
function closeAllModals() {
  document.querySelectorAll('.modal-bg').forEach(m => m.classList.remove('open'));
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllModals(); });

/* ── CONFIRM DELETE ── */
function confirmDelete(msg) {
  return window.confirm(msg || 'Are you sure you want to delete this?');
}

/* ── FORMAT DATE ── */
function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}
function fmtTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' });
}
function fmtMonth(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { month:'short', year:'numeric' });
}

/* ── AUTO INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  markActive();
  document.getElementById('signOutBtn')?.addEventListener('click', signOut);
  // close modal on overlay click
  document.querySelectorAll('.modal-bg').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
  });
});
