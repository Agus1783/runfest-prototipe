/* data.js v2 — SATU-SATUNYA sumber data prototipe v2.
   Key localStorage diawali RF2_ supaya tidak bentrok dengan v1.
   Model:
   - Event: {id, nama, tanggal, lokasi, status: draft|aktif|selesai}
   - Kategori: {id, eventId, nama, jarak, harga, kuota} — harga bisa diubah admin,
     tapi harga peserta yang sudah daftar TIDAK ikut berubah (disimpan di peserta.harga).
   - Peserta (= satu pendaftaran): {id, eventId, bib, nama, email, telepon, kaos,
     kategoriId, kategoriNama, jarak, harga, invoice, paymentStatus: pending|lunas,
     paymentMethod, daftarUlang: belum|sudah, racepack, finish: belum|finish|DNF,
     waktu, medali, sertifikat, juara, kostum, kostumDesc}
   - Start lomba: per event, RF2_STARTS = {eventId: timestamp}
   PEMBAYARAN ADALAH SIMULASI PROTOTIPE, bukan gateway asli, tidak ada uang asli. */
const SEED_EVENTS = [
  { id:"EVT-2026", nama:"RunFest 2026", tanggal:"2026-02-15", lokasi:"Lapangan Utama", status:"selesai" },
  { id:"EVT-2027", nama:"RunFest 2027", tanggal:"2027-02-14", lokasi:"Lapangan Utama", status:"aktif" },
  { id:"EVT-2028", nama:"RunFest 2028", tanggal:"2028-02-13", lokasi:"Lapangan Utama", status:"draft" },
];
const SEED_CATEGORIES = [
  { id:"CAT26-5K", eventId:"EVT-2026", nama:"5K", jarak:"5K", harga:150000, kuota:500 },
  { id:"CAT26-10K", eventId:"EVT-2026", nama:"10K", jarak:"10K", harga:200000, kuota:500 },
  { id:"CAT26-3K", eventId:"EVT-2026", nama:"Anak 3K", jarak:"3K", harga:100000, kuota:300 },
  { id:"CAT27-5K", eventId:"EVT-2027", nama:"5K", jarak:"5K", harga:175000, kuota:500 },
  { id:"CAT27-10K", eventId:"EVT-2027", nama:"10K", jarak:"10K", harga:225000, kuota:500 },
  { id:"CAT27-HM", eventId:"EVT-2027", nama:"Half Marathon (HM)", jarak:"21K", harga:375000, kuota:400 },
  { id:"CAT27-FM", eventId:"EVT-2027", nama:"Full Marathon (FM)", jarak:"42K", harga:550000, kuota:300 },
  { id:"CAT27-3K", eventId:"EVT-2027", nama:"Anak 3K", jarak:"3K", harga:125000, kuota:300 },
  { id:"CAT28-5K", eventId:"EVT-2028", nama:"5K", jarak:"5K", harga:200000, kuota:500 },
  { id:"CAT28-10K", eventId:"EVT-2028", nama:"10K", jarak:"10K", harga:250000, kuota:500 },
  { id:"CAT28-HM", eventId:"EVT-2028", nama:"Half Marathon (HM)", jarak:"21K", harga:400000, kuota:400 },
  { id:"CAT28-FM", eventId:"EVT-2028", nama:"Full Marathon (FM)", jarak:"42K", harga:600000, kuota:300 },
  { id:"CAT28-3K", eventId:"EVT-2028", nama:"Anak 3K", jarak:"3K", harga:150000, kuota:300 },
];
function _mk(nama, email, bib, kategoriId, kategoriNama, jarak, harga, invoice, extra){
  return Object.assign({ id:"", eventId:"", bib, nama, email, telepon:"", kaos:"M", kategoriId, kategoriNama, jarak, harga, invoice, paymentStatus:"lunas", paymentMethod:"QRIS", daftarUlang:"sudah", racepack:"belum", finish:"belum", waktu:"", medali:"belum", sertifikat:"belum", juara:0, kostum:"-", kostumDesc:"" }, extra || {});
}
const SEED_PARTICIPANTS = (function(){
  const list = [];
  const add = (eventId, p) => { p.eventId = eventId; p.id = eventId + ":" + p.bib; list.push(p); };
  add("EVT-2026", _mk("Budi Santoso","budi@runfest.id","RF-101","CAT26-10K","10K","10K",200000,"INV-2026-001",{telepon:"0812-0000-101",kaos:"L",racepack:"sudah",finish:"finish",waktu:"48:12",medali:"sudah",sertifikat:"sudah",juara:2}));
  add("EVT-2026", _mk("Putri Ayu Lestari","putri@runfest.id","RF-102","CAT26-10K","10K","10K",200000,"INV-2026-002",{telepon:"0812-0000-102",kaos:"M",racepack:"sudah",finish:"finish",waktu:"46:05",medali:"sudah",sertifikat:"sudah",juara:1}));
  add("EVT-2026", _mk("Andi Wijaya","andi@runfest.id","RF-103","CAT26-10K","10K","10K",200000,"INV-2026-003",{telepon:"0812-0000-103",kaos:"XL",racepack:"sudah",finish:"finish",waktu:"51:40",juara:3,kostum:"Nominasi",kostumDesc:"Kostum robot kardus"}));
  add("EVT-2026", _mk("Sari Melati","sari@runfest.id","RF-104","CAT26-5K","5K","5K",150000,"INV-2026-004",{telepon:"0812-0000-104",kaos:"S",racepack:"sudah",finish:"finish",waktu:"29:18",juara:1,kostum:"Pemenang",kostumDesc:"Kostum bunga matahari raksasa"}));
  add("EVT-2026", _mk("Rizky Pratama","rizky@runfest.id","RF-105","CAT26-5K","5K","5K",150000,"INV-2026-005",{telepon:"0812-0000-105",kaos:"L",racepack:"sudah"}));
  add("EVT-2026", _mk("Dewi Kartika","dewi@runfest.id","RF-106","CAT26-10K","10K","10K",200000,"INV-2026-006",{telepon:"0812-0000-106",kaos:"M",daftarUlang:"belum"}));
  add("EVT-2026", _mk("Fajar Nugraha","fajar@runfest.id","RF-107","CAT26-5K","5K","5K",150000,"INV-2026-007",{telepon:"0812-0000-107",kaos:"L",racepack:"sudah",finish:"DNF",kostum:"Nominasi",kostumDesc:"Kostum superhero daur ulang"}));
  add("EVT-2026", _mk("Nadia Zahra","nadia@runfest.id","RF-108","CAT26-5K","5K","5K",150000,"INV-2026-008",{telepon:"0812-0000-108",kaos:"S",daftarUlang:"belum"}));
  add("EVT-2026", _mk("Kirana Cilik","kirana@runfest.id","RF-201","CAT26-3K","Anak 3K","3K",100000,"INV-2026-009",{telepon:"0812-0000-201",kaos:"XS",racepack:"sudah",finish:"finish",waktu:"18:42",medali:"sudah",sertifikat:"sudah",juara:1}));
  add("EVT-2026", _mk("Bima Aditya","bima@runfest.id","RF-202","CAT26-3K","Anak 3K","3K",100000,"INV-2026-010",{telepon:"0812-0000-202",kaos:"S",racepack:"sudah",finish:"finish",waktu:"19:05",juara:2,kostum:"Nominasi",kostumDesc:"Kostum dinosaurus"}));
  add("EVT-2026", _mk("Aisyah Putri","aisyah@runfest.id","RF-203","CAT26-3K","Anak 3K","3K",100000,"INV-2026-011",{telepon:"0812-0000-203",kaos:"XS",racepack:"sudah",finish:"finish",waktu:"20:31",juara:3}));
  add("EVT-2026", _mk("Zaki Ramadhan","zaki@runfest.id","RF-204","CAT26-3K","Anak 3K","3K",100000,"INV-2026-012",{telepon:"0812-0000-204",kaos:"S",daftarUlang:"belum"}));
  add("EVT-2027", _mk("Dimas Pratama","dimas@runfest.id","RF27-101","CAT27-10K","10K","10K",225000,"INV-2027-001",{telepon:"0812-0000-301",kaos:"L",paymentStatus:"pending",paymentMethod:"",daftarUlang:"belum"}));
  add("EVT-2027", _mk("Intan Permata","intan@runfest.id","RF27-102","CAT27-HM","Half Marathon (HM)","21K",375000,"INV-2027-002",{telepon:"0812-0000-302",kaos:"M",daftarUlang:"sudah"}));
  add("EVT-2027", _mk("Yoga Saputra","yoga@runfest.id","RF27-103","CAT27-FM","Full Marathon (FM)","42K",550000,"INV-2027-003",{telepon:"0812-0000-303",kaos:"L",daftarUlang:"sudah",racepack:"sudah"}));
  add("EVT-2027", _mk("Lina Maharani","lina@runfest.id","RF27-104","CAT27-5K","5K","5K",175000,"INV-2027-004",{telepon:"0812-0000-304",kaos:"S",paymentStatus:"pending",paymentMethod:"",daftarUlang:"belum"}));
  add("EVT-2027", _mk("Kevin Chandra","kevin@runfest.id","RF27-105","CAT27-3K","Anak 3K","3K",125000,"INV-2027-005",{telepon:"0812-0000-305",kaos:"S",daftarUlang:"belum"}));
  add("EVT-2027", _mk("Maya Sari","maya@runfest.id","RF27-106","CAT27-HM","Half Marathon (HM)","21K",375000,"INV-2027-006",{telepon:"0812-0000-306",kaos:"M",daftarUlang:"sudah",racepack:"sudah"}));
  return list;
})();

function _load(key, seed){
  try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw); } catch(e){}
  const copy = JSON.parse(JSON.stringify(seed));
  localStorage.setItem(key, JSON.stringify(copy));
  return copy;
}
function loadEvents(){ return _load("RF2_EVENTS", SEED_EVENTS); }
function saveEvents(list){ localStorage.setItem("RF2_EVENTS", JSON.stringify(list)); }
function loadCategories(){ return _load("RF2_CATEGORIES", SEED_CATEGORIES); }
function saveCategories(list){ localStorage.setItem("RF2_CATEGORIES", JSON.stringify(list)); }
function loadPeserta(){ return _load("RF2_PARTICIPANTS", SEED_PARTICIPANTS); }
function savePeserta(list){ localStorage.setItem("RF2_PARTICIPANTS", JSON.stringify(list)); }
function resetAll(){ localStorage.removeItem("RF2_EVENTS"); localStorage.removeItem("RF2_CATEGORIES"); localStorage.removeItem("RF2_PARTICIPANTS"); }
function getEvent(id){ return loadEvents().find(e => e.id === id); }
function getCategories(eventId){ return loadCategories().filter(c => c.eventId === eventId); }
function getCategory(id){ return loadCategories().find(c => c.id === id); }
function getCurrentEventId(){
  const saved = localStorage.getItem("RF2_CURRENT_EVENT");
  if (saved && getEvent(saved)) return saved;
  const active = loadEvents().find(e => e.status === "aktif");
  return active ? active.id : loadEvents()[0].id;
}
function setCurrentEventId(id){ localStorage.setItem("RF2_CURRENT_EVENT", id); }
function findPeserta(id){ return loadPeserta().find(p => p.id === id); }
function findPesertaByBib(eventId, bib){
  return loadPeserta().find(p => p.eventId === eventId && p.bib.toUpperCase() === String(bib||"").trim().toUpperCase());
}
function updatePeserta(id, patch){
  const list = loadPeserta();
  const i = list.findIndex(p => p.id === id);
  if (i < 0) return null;
  list[i] = Object.assign({}, list[i], patch);
  savePeserta(list);
  return list[i];
}
function nextBib(eventId){
  const ev = getEvent(eventId);
  const year = ev && ev.tanggal ? ev.tanggal.slice(2,4) : "27";
  const list = loadPeserta().filter(p => p.eventId === eventId);
  let max = 100;
  list.forEach(p => { const m = String(p.bib).match(/(\d+)$/); if (m) max = Math.max(max, parseInt(m[1], 10)); });
  return "RF" + year + "-" + (max + 1);
}
function nextInvoice(eventId){
  const ev = getEvent(eventId);
  const year = ev && ev.tanggal ? ev.tanggal.slice(0,4) : "2027";
  const n = loadPeserta().filter(p => p.eventId === eventId).length + 1;
  return "INV-" + year + "-" + String(n).padStart(3, "0");
}
function formatRupiah(n){ return "Rp " + Number(n||0).toLocaleString("id-ID"); }
function formatTanggal(t){
  try { const d = new Date(t + "T00:00:00"); return d.toLocaleDateString("id-ID", { weekday:"long", day:"numeric", month:"long", year:"numeric" }); } catch(e){ return t; }
}
function esc(s){ return String(s==null?"":s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c])); }
function qrPayload(p){ return "RUNFEST|" + p.eventId + "|" + p.bib + "|" + p.nama + "|" + p.kategoriNama; }
function qrParse(text){
  const parts = String(text||"").split("|");
  if (parts.length >= 3 && parts[0].toUpperCase() === "RUNFEST") return { eventId: parts[1], bib: parts[2] };
  const m = String(text||"").match(/(RF\d*-\d+)/i);
  return { eventId: null, bib: m ? m[1].toUpperCase() : String(text||"").trim().toUpperCase() };
}
/* Start per event + waktu finish */
function _starts(){ try { return JSON.parse(localStorage.getItem("RF2_STARTS") || "{}"); } catch(e){ return {}; } }
function getRaceStart(eventId){ const s = _starts(); return s[eventId] || null; }
function setRaceStart(eventId, ts){ const s = _starts(); s[eventId] = ts; localStorage.setItem("RF2_STARTS", JSON.stringify(s)); }
function resetRaceStart(eventId){ const s = _starts(); delete s[eventId]; localStorage.setItem("RF2_STARTS", JSON.stringify(s)); }
function formatClock(ts){ const d = new Date(ts); const p = n => String(n).padStart(2,"0"); return p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds()); }
function formatElapsed(ms){ const s = Math.floor(ms/1000); const h = Math.floor(s/3600); const m = Math.floor((s%3600)/60); const sec = s%60; const p = n => String(n).padStart(2,"0"); return h>0 ? h+":"+p(m)+":"+p(sec) : m+":"+p(sec); }
function parseWaktuKeDetik(w){
  if (!w) return Infinity;
  const parts = String(w).trim().split(":").map(Number);
  if (parts.some(n => Number.isNaN(n))) return Infinity;
  if (parts.length === 2) return parts[0]*60 + parts[1];
  if (parts.length === 3) return parts[0]*3600 + parts[1]*60 + parts[2];
  return Infinity;
}
/* Juara otomatis per event + kategori (bukan per label Dewasa/Anak saja).
   Ini menyelesaikan anomali v1: 5K dan 10K kini kategori berbeda, jadi
   Sari 5K tidak lagi menggeser podium 10K. Kostum TIDAK disentuh di sini. */
function hitungJuaraOtomatis(eventId){
  const list = loadPeserta();
  list.filter(p => p.eventId === eventId).forEach(p => { p.juara = 0; });
  const katIds = [...new Set(list.filter(p => p.eventId === eventId).map(p => p.kategoriId))];
  katIds.forEach(katId => {
    const finisher = list.filter(p => p.eventId === eventId && p.kategoriId === katId && p.finish === "finish")
      .sort((a,b) => parseWaktuKeDetik(a.waktu) - parseWaktuKeDetik(b.waktu) || a.bib.localeCompare(b.bib));
    finisher.slice(0,3).forEach((p,i) => { p.juara = i + 1; });
  });
  savePeserta(list);
}
/* Badges */
function badgeBayar(p){ return p.paymentStatus === "lunas" ? '<span class="badge ok">Lunas</span>' : '<span class="badge warn">Belum bayar</span>'; }
function badgeDaftarUlang(p){ return p.daftarUlang === "sudah" ? '<span class="badge ok">Daftar ulang ✓</span>' : '<span class="badge warn">Belum daftar ulang</span>'; }
function badgeRacepack(p){ return p.racepack === "sudah" ? '<span class="badge ok">Race pack ✓</span>' : '<span class="badge warn">Belum race pack</span>'; }
function badgeFinish(p){
  if (p.finish === "finish") return '<span class="badge ok">Finish' + (p.waktu ? " • " + p.waktu : "") + "</span>";
  if (p.finish === "DNF") return '<span class="badge bad">DNF</span>';
  return '<span class="badge warn">Belum finish</span>';
}
function badgeMedali(p){ return p.medali === "sudah" ? '<span class="badge ok">Medali + Sertifikat ✓</span>' : '<span class="badge warn">Belum medali</span>'; }
function badgeJuara(p){ return p.juara ? '<span class="badge gold">🏆 Juara ' + p.juara + '</span>' : ""; }
function badgeKostum(p){ return p.kostum && p.kostum !== "-" ? '<span class="badge info">🎭 ' + esc(p.kostum) + '</span>' : ""; }
