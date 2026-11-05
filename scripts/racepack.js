/* racepack.js v2 — meja race pack saja */
document.addEventListener("DOMContentLoaded", () => {
  const s = requireRole(["racepack","admin"], "../");
  if (!s) return;
  headerAuth("../");
  const sel = document.getElementById("eventSelect");
  fillEventSelect(sel, getCurrentEventId());
  sel.addEventListener("change", () => { setCurrentEventId(sel.value); render(); });
  document.getElementById("btnCari").addEventListener("click", cari);
  document.getElementById("inputCari").addEventListener("keydown", e => { if (e.key === "Enter") cari(); });
  render();
});
function msg(html, ok){ const el = document.getElementById("msg"); el.className = "alert " + (ok ? "ok" : "err"); el.innerHTML = html; }
function render(){
  const eventId = getCurrentEventId();
  const list = loadPeserta().filter(p => p.eventId === eventId && p.paymentStatus === "lunas" && p.daftarUlang === "sudah" && p.racepack !== "sudah");
  document.getElementById("tbodyAntrean").innerHTML = list.map(p =>
    '<tr><td><b>' + esc(p.bib) + '</b><br>' + esc(p.nama) + '</td><td>' + esc(p.kategoriNama) + '</td><td>' + esc(p.bib) + '</td><td><button class="btn small" onclick="aksiRacepack(\'' + esc(p.id) + '\')">🎒 Serahkan Race Pack</button></td></tr>').join("")
    || '<tr><td colspan="4" class="muted">Antrean kosong.</td></tr>';
}
function cari(){
  const parsed = qrParse(document.getElementById("inputCari").value);
  const eventId = parsed.eventId || getCurrentEventId();
  const p = findPesertaByBib(eventId, parsed.bib) || loadPeserta().find(x => x.eventId === eventId && x.nama.toLowerCase().includes(document.getElementById("inputCari").value.trim().toLowerCase()));
  const box = document.getElementById("hasilCari");
  if (!p) { box.innerHTML = '<div class="alert err">Tidak ditemukan di event ini.</div>'; return; }
  box.innerHTML = '<h3 style="margin:0">' + esc(p.nama) + ' (' + esc(p.bib) + ')</h3><p class="muted">' + esc(p.kategoriNama) + ' • Kaos ' + esc(p.kaos) + '</p>'
    + '<p>' + badgeBayar(p) + ' ' + badgeDaftarUlang(p) + ' ' + badgeRacepack(p) + '</p>'
    + '<button class="btn" onclick="aksiRacepack(\'' + esc(p.id) + '\')">🎒 Serahkan Race Pack (BIB + totebag + air minum)</button>';
}
function aksiRacepack(id){
  const p = findPeserta(id);
  if (p.paymentStatus !== "lunas") { msg("Belum boleh ambil race pack: pembayaran belum lunas.", false); return; }
  if (p.daftarUlang !== "sudah") { msg("Belum boleh ambil race pack: peserta belum daftar ulang di meja Pendaftaran.", false); return; }
  if (p.racepack === "sudah") { msg("Race pack sudah pernah diambil.", false); return; }
  updatePeserta(id, { racepack:"sudah" });
  render();
  msg("✅ Race pack diserahkan: nomor peserta <b>" + esc(p.bib) + "</b> + totebag + air minum.", true);
}
