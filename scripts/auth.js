/* auth.js — login/register STATIS (prototipe, tanpa backend).
   Akun demo:
   - Panitia: panitia@runfest.id / panitia123  -> dashboard panitia
   - Peserta: budi@runfest.id / peserta123     -> dashboard peserta (BIB RF-101)
   Akun register baru disimpan di localStorage (RF_USERS) dan otomatis
   dibuatkan BIB baru. Jangan pakai password asli di prototipe ini. */
const STATIC_USERS = [
  {
    email: "panitia@runfest.id",
    pass: "panitia123",
    role: "panitia",
    nama: "Panitia Run Festival",
    bib: "",
  },
  {
    email: "budi@runfest.id",
    pass: "peserta123",
    role: "peserta",
    nama: "Budi Santoso",
    bib: "RF-101",
  },
];
function extraUsers() {
  try {
    return JSON.parse(localStorage.getItem("RF_USERS") || "[]");
  } catch (e) {
    return [];
  }
}
function allUsers() {
  return [...STATIC_USERS, ...extraUsers()];
}
function getSession() {
  try {
    return JSON.parse(localStorage.getItem("RF_SESSION") || "null");
  } catch (e) {
    return null;
  }
}
function setSession(u) {
  localStorage.setItem(
    "RF_SESSION",
    JSON.stringify({
      email: u.email,
      role: u.role,
      nama: u.nama,
      bib: u.bib || "",
    }),
  );
}
function logout() {
  localStorage.removeItem("RF_SESSION");
  // Dari pages/ harus naik satu level, dari root langsung ke login.html
  location.href = location.pathname.includes("/pages/")
    ? "../login.html"
    : "login.html";
}
function login(email, pass) {
  const u = allUsers().find(
    (x) =>
      x.email.toLowerCase() === email.trim().toLowerCase() && x.pass === pass,
  );
  if (!u) return null;
  setSession(u);
  return u;
}
/* root = "" dari root, "../" dari pages/ — dipakai untuk redirect logout */
function requireRole(role, root) {
  const s = getSession();
  if (!s) {
    location.href = (root || "") + "login.html";
    return null;
  }
  if (role && s.role !== role) {
    location.href =
      s.role === "panitia"
        ? (root || "") + "pages/dashboard.html"
        : (root || "") + "pages/peserta.html";
    return null;
  }
  return s;
}
function headerAuth(root) {
  const s = getSession();
  const el = document.getElementById("authArea");
  if (!el || el.dataset.authDone) return;
  el.dataset.authDone = "1";
  // Jangan hapus link navigasi yang sudah ada; hanya sesuaikan area akun.
  el.querySelectorAll("a").forEach((a) => {
    if (
      a.getAttribute("href") &&
      (a.getAttribute("href").includes("login.html") ||
        a.getAttribute("href").includes("register.html"))
    )
      a.remove();
  });
  const add = (html) => {
    const t = document.createElement("span");
    t.innerHTML = html;
    while (t.firstChild) el.appendChild(t.firstChild);
  };
  if (!s) {
    add(
      '<a href="' +
        (root || "") +
        'login.html">Masuk</a><a href="' +
        (root || "") +
        'register.html">Daftar Akun</a>',
    );
  } else {
    const home =
      s.role === "panitia" ? "pages/dashboard.html" : "pages/peserta.html";
    add(
      '<a href="' +
        (root || "") +
        home +
        '">Halo, ' +
        esc(s.nama) +
        '</a><a href="#" onclick="logout();return false;">Keluar</a>',
    );
  }
}
