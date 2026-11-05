/* lomba.js v2 — admin: Start per event + Finish/DNF + juara otomatis */
document.addEventListener("DOMContentLoaded", () => {
  const s = requireRole("admin", "../");
  if (!s) return;
  headerAuth("../");
  const sel = document.getElementById("eventSelect");
  fillEventSelect(sel, getCurrentEventId());
  sel.addEventListener("change", () => { setCurrentEventId(sel.value); renderStart(); renderFinisher(); });
  document.getElementById("btnCari").addEventListener("click", cari);
  document.getElementById("inputCari").addEventListener("keydown", e => { if (e.key === "Enter") cari(); });
  renderStart();
  renderFinisher();
  setInterval(() => {
    const el = document.getElementById("raceElapsed");
    const st = getRaceStart(getCurrentEventId());
    if (el && st) el.textContent = formatElapsed(Date.now() - st);
  }, 1000);
});
function msg(html, ok){ const el = document.getElementById("msg"); el.className = "alert " + (ok ? "ok" : "err"); el.innerHTML = html; }
function renderStart(){
  const eventId = getCurrentEventId();
  const ev = getEvent(eventId);
  const box = document.getElementById("raceStartBox");
  const start = getRaceStart(eventId);
  if (!start) {
    box.innerHTML = '<div style="display:flex;gap:12px;justify-content:space-between;align-items:center;flex-wrap:wrap"><div><b>🏁 Start Lomba — ' + esc(ev ? ev.nama : "") + '</b><br><span class="muted small">Belum dimulai. Tekan sekali saja — berlaku untuk semua peserta event ini.</span></div><button class="btn" onclick="aksiStart()">▶ Mulai Lomba</button></div>';
  } else {
    box.innerHTML = '<div style="display:flex;gap:12px;justify-content:space-between;align-items:center;flex-wrap:wrap"><div><b>🏁 Lomba sedang berjalan — ' + esc(ev ? ev.nama : "") + '</b><br><span class="muted small">Dimulai pukul ' + formatClock(start) + ' • Berjalan: <b id="raceElapsed">' + formatElapsed(Date.now() - start) + '</b></span></div><button class="btn ghost small" onclick="aksiResetStart()">Reset Start</button></div>';
  }
}
function aksiStart(){
  const eventId = getCurrentEventId();
  if (getRaceStart(eventId)) { msg("Lomba event ini sudah dimulai.", false); return; }
  setRaceStart(eventId, Date.now());
  renderStart();
  msg("🏁 Lomba <b>DIMULAI</b> pukul " + formatClock(getRaceStart(eventId)) + " untuk event ini.", true);
}
function aksiResetStart(){
  const eventId = getCurrentEventId();
  if (!confirm("Reset waktu start event ini? Waktu finish yang sudah tercatat tidak berubah, tapi finish berikutnya akan dihitung dari start yang baru.")) return;
  resetRaceStart(eventId);
  renderStart();
  msg("Waktu start direset.", true);
}
function renderFinisher(){
  const eventId = getCurrentEventId();
  const rows = loadPeserta().filter(p => p.eventId === eventId && p.finish === "finish")
    .sort((a,b) => parseWaktuKeDetik(a.waktu) - parseWaktuKeDetik(b.waktu));
  document.getElementById("tbodyFinisher").innerHTML = rows.map(p =>
    '<tr><td><b>' + esc(p.bib) + '</b><br>' + esc(p.nama) + '</td><td>' + esc(p.kategoriNama) + '</td><td>⏱ ' + esc(p.waktu) + '</td><td>' + badgeJuara(p) + '</td></tr>').join("")
    || '<tr><td colspan="4" class="muted">Belum ada finisher di event ini.</td></tr>';
}
function cari(){
  const parsed = qrParse(document.getElementById("inputCari").value);
  const eventId = parsed.eventId || getCurrentEventId();
  const p = findPesertaByBib(eventId, parsed.bib) || loadPeserta().find(x => x.eventId === eventId && x.nama.toLowerCase().includes(document.getElementById("inputCari").value.trim().toLowerCase()));
  const box = document.getElementById("hasilCari");
  if (!p) { box.innerHTML = '<div class="alert err">Tidak ditemukan di event ini.</div>'; return; }
  box.innerHTML = '<h3 style="margin:0">' + esc(p.nama) + ' (' + esc(p.bib) + ')</h3><p class="muted">' + esc(p.kategoriNama) + ' • Kaos ' + esc(p.kaos) + '</p>'
    + '<p>' + badgeBayar(p) + ' ' + badgeDaftarUlang(p) + ' ' + badgeRacepack(p) + ' ' + badgeFinish(p) + ' ' + badgeMedali(p) + ' ' + badgeJuara(p) + '</p>'
    + '<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn blue" onclick="aksiFinish(\'' + esc(p.id) + '\')">🏁 Tandai Finish</button><button class="btn" onclick="aksiDNF(\'' + esc(p.id) + '\')">Tandai DNF</button></div>';
}
function aksiFinish(id){
  const p = findPeserta(id);
  if (p.paymentStatus !== "lunas") { msg("Belum bisa finish: pembayaran belum lunas.", false); return; }
  if (p.racepack !== "sudah") { msg("Belum bisa finish: peserta belum mengambil race pack.", false); return; }
  if (p.finish === "finish") { msg("Peserta ini sudah tercatat finish.", false); return; }
  const start = getRaceStart(p.eventId);
  if (!start) { msg("Lomba belum dimulai. Tekan tombol ▶ Mulai Lomba di atas dulu.", false); return; }
  const w = formatElapsed(Date.now() - start);
  updatePeserta(id, { finish:"finish", waktu:w });
  hitungJuaraOtomatis(p.eventId);
  renderFinisher();
  msg("🏁 <b>" + esc(p.nama) + "</b> tercatat FINISH (" + esc(w) + "). Juara per kategori dihitung ulang otomatis.", true);
}
function aksiDNF(id){
  const p = findPeserta(id);
  updatePeserta(id, { finish:"DNF", waktu:"", juara:0 });
  hitungJuaraOtomatis(p.eventId);
  renderFinisher();
  msg("Peserta tercatat DNF. Juara per kategori dihitung ulang otomatis.", true);
}
