/* auth.js v2 — user statis + role terpisah.
   Demo:
   - admin@runfest.id / admin123        -> Admin (semua)
   - panitia@runfest.id / panitia123    -> Admin (alias lama)
   - daftar@runfest.id / daftar123      -> Pendaftaran
   - racepack@runfest.id / racepack123  -> Race Pack
   - medali@runfest.id / medali123      -> Medali & Souvenir
   - budi@runfest.id / peserta123       -> Peserta (RF-101, RunFest 2026)
   Akun peserta baru dibuat lewat daftar.html, disimpan di RF2_USERS.
   Jangan pakai password asli di prototipe ini. */
const STATIC_USERS = [
  { email:"admin@runfest.id", pass:"admin123", role:"admin", nama:"Admin RunFest" },
  { email:"panitia@runfest.id", pass:"panitia123", role:"admin", nama:"Panitia RunFest" },
  { email:"daftar@runfest.id", pass:"daftar123", role:"pendaftaran", nama:"Petugas Pendaftaran" },
  { email:"racepack@runfest.id", pass:"racepack123", role:"racepack", nama:"Petugas Race Pack" },
  { email:"medali@runfest.id", pass:"medali123", role:"medali", nama:"Petugas Medali" },
  { email:"budi@runfest.id", pass:"peserta123", role:"peserta", nama:"Budi Santoso" },
];
const ROLE_LABEL = { admin:"Admin", pendaftaran:"Pendaftaran", racepack:"Race Pack", medali:"Medali", peserta:"Peserta" };
const ROLE_HOME = {
  admin:"pages/dashboard.html",
  pendaftaran:"pages/pendaftaran.html",
  racepack:"pages/racepack.html",
  medali:"pages/medali.html",
  peserta:"pages/peserta.html",
};
function extraUsers(){ try { return JSON.parse(localStorage.getItem("RF2_USERS") || "[]"); } catch(e){ return []; } }
function allUsers(){ return [...STATIC_USERS, ...extraUsers()]; }
function getSession(){ try { return JSON.parse(localStorage.getItem("RF2_SESSION") || "null"); } catch(e){ return null; } }
function setSession(u){ localStorage.setItem("RF2_SESSION", JSON.stringify({ email:u.email, role:u.role, nama:u.nama })); }
function logout(){ localStorage.removeItem("RF2_SESSION"); location.href = location.pathname.includes("/pages/") ? "../login.html" : "login.html"; }
function login(email, pass){
  const u = allUsers().find(x => x.email.toLowerCase() === email.trim().toLowerCase() && x.pass === pass);
  if (!u) return null;
  setSession(u); return u;
}
function requireRole(allowed, root){
  const s = getSession();
  if (!s) { location.href = (root||"") + "login.html"; return null; }
  const list = Array.isArray(allowed) ? allowed : [allowed];
  if (list.length && !list.includes(s.role)) {
    location.href = (root||"") + ROLE_HOME[s.role];
    return null;
  }
  return s;
}
function headerAuth(root){
  const s = getSession();
  const el = document.getElementById("authArea");
  if (!el || el.dataset.authDone) return;
  el.dataset.authDone = "1";
  el.querySelectorAll("a").forEach(a => {
    const h = a.getAttribute("href") || "";
    if (h.includes("login.html") || h.includes("register.html")) a.remove();
  });
  const add = (html) => { const t = document.createElement("span"); t.innerHTML = html; while (t.firstChild) el.appendChild(t.firstChild); };
  if (!s) {
    add('<a href="'+(root||"")+'login.html">Masuk</a><a href="'+(root||"")+'daftar.html">Daftar Event</a>');
  } else {
    add('<a href="'+(root||"")+ROLE_HOME[s.role]+'">Halo, '+esc(s.nama)+' ('+(ROLE_LABEL[s.role]||s.role)+')</a><a href="#" onclick="logout();return false;">Keluar</a>');
  }
}
/* Isi <select> event. root tidak dipakai di sini, hanya untuk konsistensi. */
function fillEventSelect(selectEl, selectedId){
  if (!selectEl) return;
  const events = loadEvents();
  selectEl.innerHTML = events.map(e => '<option value="'+e.id+'">'+esc(e.nama)+' — '+esc(e.tanggal)+' ('+esc(e.status)+')</option>').join("");
  selectEl.value = selectedId || getCurrentEventId();
}
