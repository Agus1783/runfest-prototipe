/* data.js — SATU-SATUNYA sumber data prototipe.
   Ganti GFORM_URL dengan link Google Form asli panitia.
   Semua perubahan status disimpan di localStorage (key RF_STATE),
   jadi dashboard, scan, peserta & podium selalu sinkron selama
   dibuka dari server lokal yang sama. */
const GFORM_URL = "https://forms.gle/PASTE-LINK-GFORM-DISINI";
const EVENT_NAME = "Run Festival 2026";
const EVENT_DATE =
  "Minggu, 15 Februari 2026 • 05.30 WIB • Sekretariat & Start/Finish: Lapangan Utama";

const SEED = [
  {
    bib: "RF-101",
    nama: "Budi Santoso",
    kategori: "Dewasa",
    jarak: "10K",
    email: "budi@runfest.id",
    telepon: "0812-0000-101",
    kaos: "L",
    racepack: "sudah",
    finish: "finish",
    waktu: "48:12",
    medali: "sudah",
    sertifikat: "sudah",
    juara: 2,
    kostum: "-",
    kostumDesc: "",
  },
  {
    bib: "RF-102",
    nama: "Putri Ayu Lestari",
    kategori: "Dewasa",
    jarak: "10K",
    email: "putri@runfest.id",
    telepon: "0812-0000-102",
    kaos: "M",
    racepack: "sudah",
    finish: "finish",
    waktu: "46:05",
    medali: "sudah",
    sertifikat: "sudah",
    juara: 1,
    kostum: "-",
    kostumDesc: "",
  },
  {
    bib: "RF-103",
    nama: "Andi Wijaya",
    kategori: "Dewasa",
    jarak: "10K",
    email: "andi@runfest.id",
    telepon: "0812-0000-103",
    kaos: "XL",
    racepack: "sudah",
    finish: "finish",
    waktu: "51:40",
    medali: "belum",
    sertifikat: "belum",
    juara: 3,
    kostum: "Nominasi",
    kostumDesc: "Kostum robot kardus",
  },
  {
    bib: "RF-104",
    nama: "Sari Melati",
    kategori: "Dewasa",
    jarak: "5K",
    email: "sari@runfest.id",
    telepon: "0812-0000-104",
    kaos: "S",
    racepack: "sudah",
    finish: "finish",
    waktu: "29:18",
    medali: "belum",
    sertifikat: "belum",
    juara: 0,
    kostum: "Pemenang",
    kostumDesc: "Kostum bunga matahari raksasa",
  },
  {
    bib: "RF-105",
    nama: "Rizky Pratama",
    kategori: "Dewasa",
    jarak: "5K",
    email: "rizky@runfest.id",
    telepon: "0812-0000-105",
    kaos: "L",
    racepack: "sudah",
    finish: "belum",
    waktu: "",
    medali: "belum",
    sertifikat: "belum",
    juara: 0,
    kostum: "-",
    kostumDesc: "",
  },
  {
    bib: "RF-106",
    nama: "Dewi Kartika",
    kategori: "Dewasa",
    jarak: "10K",
    email: "dewi@runfest.id",
    telepon: "0812-0000-106",
    kaos: "M",
    racepack: "belum",
    finish: "belum",
    waktu: "",
    medali: "belum",
    sertifikat: "belum",
    juara: 0,
    kostum: "-",
    kostumDesc: "",
  },
  {
    bib: "RF-107",
    nama: "Fajar Nugraha",
    kategori: "Dewasa",
    jarak: "5K",
    email: "fajar@runfest.id",
    telepon: "0812-0000-107",
    kaos: "L",
    racepack: "sudah",
    finish: "DNF",
    waktu: "",
    medali: "belum",
    sertifikat: "belum",
    juara: 0,
    kostum: "Nominasi",
    kostumDesc: "Kostum superhero daur ulang",
  },
  {
    bib: "RF-108",
    nama: "Nadia Zahra",
    kategori: "Dewasa",
    jarak: "5K",
    email: "nadia@runfest.id",
    telepon: "0812-0000-108",
    kaos: "S",
    racepack: "belum",
    finish: "belum",
    waktu: "",
    medali: "belum",
    sertifikat: "belum",
    juara: 0,
    kostum: "-",
    kostumDesc: "",
  },
  {
    bib: "RF-201",
    nama: "Kirana Cilik",
    kategori: "Anak-Anak",
    jarak: "3K",
    email: "kirana@runfest.id",
    telepon: "0812-0000-201",
    kaos: "XS",
    racepack: "sudah",
    finish: "finish",
    waktu: "18:42",
    medali: "sudah",
    sertifikat: "sudah",
    juara: 1,
    kostum: "-",
    kostumDesc: "",
  },
  {
    bib: "RF-202",
    nama: "Bima Aditya",
    kategori: "Anak-Anak",
    jarak: "3K",
    email: "bima@runfest.id",
    telepon: "0812-0000-202",
    kaos: "S",
    racepack: "sudah",
    finish: "finish",
    waktu: "19:05",
    medali: "belum",
    sertifikat: "belum",
    juara: 2,
    kostum: "Nominasi",
    kostumDesc: "Kostum dinosaurus",
  },
  {
    bib: "RF-203",
    nama: "Aisyah Putri",
    kategori: "Anak-Anak",
    jarak: "3K",
    email: "aisyah@runfest.id",
    telepon: "0812-0000-203",
    kaos: "XS",
    racepack: "sudah",
    finish: "finish",
    waktu: "20:31",
    medali: "belum",
    sertifikat: "belum",
    juara: 3,
    kostum: "-",
    kostumDesc: "",
  },
  {
    bib: "RF-204",
    nama: "Zaki Ramadhan",
    kategori: "Anak-Anak",
    jarak: "3K",
    email: "zaki@runfest.id",
    telepon: "0812-0000-204",
    kaos: "S",
    racepack: "belum",
    finish: "belum",
    waktu: "",
    medali: "belum",
    sertifikat: "belum",
    juara: 0,
    kostum: "-",
    kostumDesc: "",
  },
];

/* SUMBER PENDAFTARAN — pembeda penting:
   - "gform" = peserta RESMI, sudah isi Google Form panitia. Inilah yang
     dihitung sebagai "Total peserta" dan yang boleh ambil race pack.
   - "web"   = baru register akun di web ini, BELUM isi GForm. Akun ini
     TIDAK dihitung sebagai peserta resmi sampai panitia mengonfirmasi
     di scan.html bahwa ia sudah isi GForm (sumber berubah jadi "gform").
   Data lama (tanpa field sumber) dimigrasi otomatis: email yang ada di
   daftar akun register-web (RF_USERS) dianggap "web", sisanya "gform". */
function migrateSumber(list) {
  let webEmails = [];
  try {
    webEmails = JSON.parse(localStorage.getItem("RF_USERS") || "[]").map((u) =>
      String(u.email || "").toLowerCase(),
    );
  } catch (e) {}
  let changed = false;
  list.forEach((p) => {
    if (!p.sumber) {
      p.sumber = webEmails.includes(String(p.email || "").toLowerCase())
        ? "web"
        : "gform";
      changed = true;
    }
  });
  if (changed) savePeserta(list);
  return list;
}
function loadPeserta() {
  try {
    const raw = localStorage.getItem("RF_STATE");
    if (raw) return migrateSumber(JSON.parse(raw));
  } catch (e) {}
  const seed = JSON.parse(JSON.stringify(SEED)).map((p) => ({
    ...p,
    sumber: "gform",
  }));
  localStorage.setItem("RF_STATE", JSON.stringify(seed));
  return seed;
}
function savePeserta(list) {
  localStorage.setItem("RF_STATE", JSON.stringify(list));
}
function resetPeserta() {
  localStorage.removeItem("RF_STATE");
  return loadPeserta();
}
function findPeserta(bib) {
  return loadPeserta().find(
    (p) =>
      p.bib.toUpperCase() ===
      String(bib || "")
        .trim()
        .toUpperCase(),
  );
}
function updatePeserta(bib, patch) {
  const list = loadPeserta();
  const i = list.findIndex((p) => p.bib === bib);
  if (i < 0) return null;
  list[i] = { ...list[i], ...patch };
  savePeserta(list);
  return list[i];
}
/* Payload QR: format tetap, dibaca halaman scan.html */
function qrPayload(p) {
  return `RUNFEST-2026|${p.bib}|${p.nama}|${p.kategori}`;
}
function bibFromQr(text) {
  const m = String(text || "").match(/RF-\d+/i);
  return m
    ? m[0].toUpperCase()
    : String(text || "")
        .trim()
        .toUpperCase();
}
function badgeRacepack(p) {
  return p.racepack === "sudah"
    ? '<span class="badge ok">Sudah diambil</span>'
    : '<span class="badge warn">Belum diambil</span>';
}
function badgeFinish(p) {
  if (p.finish === "finish")
    return (
      '<span class="badge ok">Finish' +
      (p.waktu ? " • " + p.waktu : "") +
      "</span>"
    );
  if (p.finish === "DNF")
    return '<span class="badge bad">DNF / Tidak finish</span>';
  return '<span class="badge warn">Belum finish</span>';
}
function badgeMedali(p) {
  return p.medali === "sudah"
    ? '<span class="badge ok">Medali + Sertifikat sudah</span>'
    : '<span class="badge warn">Belum diambil</span>';
}
function isGform(p) {
  return (p.sumber || "gform") === "gform";
}
function badgeSumber(p) {
  return isGform(p)
    ? '<span class="badge ok">Via GForm</span>'
    : '<span class="badge warn">Web saja — belum isi GForm</span>';
}
function esc(s) {
  return String(s == null ? "" : s).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
}
