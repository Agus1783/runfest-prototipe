/* medali.js v2 — meja medali + kostum manual */
document.addEventListener("DOMContentLoaded", () => {
  const s = requireRole(["medali","admin"], "../");
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
  const list = loadPeserta().filter(p => p.eventId === eventId && p.finish === "finish" && p.medali !== "sudah");
  document.getElementById("tbodyAntrean").innerHTML = list.map(p =>
    '<tr><td><b>' + esc(p.bib) + '</b><br>' + esc(p.nama) + '</td><td>' + esc(p.kategoriNama) + '<br><span class="small muted">⏱ ' + esc(p.waktu) + ' ' + badgeJuara(p) + '</span></td>'
    + '<td><select id="kostum-' + esc(p.id) + '"><option value="-"' + (p.kostum==="-"?" selected":"") + '>Biasa</option><option value="Nominasi"' + (p.kostum==="Nominasi"?" selected":"") + '>Nominasi</option><option value="Pemenang"' + (p.kostum==="Pemenang"?" selected":"") + '>Pemenang (+ souvenir)</option></select> <button class="btn ghost small" onclick="aksiKostum(\'' + esc(p.id) + '\')">Simpan</button></td>'
    + '<td><button class="btn small green" onclick="aksiMedali(\'' + esc(p.id) + '\')">🏅 Serahkan Medali + Sertifikat</button></td></tr>').join("")
    || '<tr><td colspan="4" class="muted">Antrean kosong.</td></tr>';
}
function cari(){
  const parsed = qrParse(document.getElementById("inputCari").value);
  const eventId = parsed.eventId || getCurrentEventId();
  const p = findPesertaByBib(eventId, parsed.bib) || loadPeserta().find(x => x.eventId === eventId && x.nama.toLowerCase().includes(document.getElementById("inputCari").value.trim().toLowerCase()));
  const box = document.getElementById("hasilCari");
  if (!p) { box.innerHTML = '<div class="alert err">Tidak ditemukan di event ini.</div>'; return; }
  box.innerHTML = '<h3 style="margin:0">' + esc(p.nama) + ' (' + esc(p.bib) + ')</h3><p class="muted">' + esc(p.kategoriNama) + ' • ⏱ ' + esc(p.waktu || "-") + '</p>'
    + '<p>' + badgeFinish(p) + ' ' + badgeMedali(p) + ' ' + badgeJuara(p) + ' ' + badgeKostum(p) + '</p>'
    + (p.kostum === "Pemenang" ? '<p class="small">🎁 Pemenang kostum: sertakan souvenir saat penyerahan medali.</p>' : '')
    + '<button class="btn green" onclick="aksiMedali(\'' + esc(p.id) + '\')">🏅 Serahkan Medali + Sertifikat</button>';
}
function aksiMedali(id){
  const p = findPeserta(id);
  if (p.finish !== "finish") { msg("Medali + sertifikat hanya untuk peserta yang sampai finish.", false); return; }
  if (p.medali === "sudah") { msg("Medali + sertifikat sudah pernah diambil.", false); return; }
  updatePeserta(id, { medali:"sudah", sertifikat:"sudah" });
  render();
  msg("🏅 Medali + sertifikat diserahkan kepada <b>" + esc(p.nama) + "</b>." + (p.kostum === "Pemenang" ? " Jangan lupa souvenir kostum terbaik." : ""), true);
}
function aksiKostum(id){
  const kostum = document.getElementById("kostum-" + id).value;
  const p = findPeserta(id);
  if (kostum === "Pemenang") {
    const clash = loadPeserta().find(x => x.eventId === p.eventId && x.kostum === "Pemenang" && x.id !== id);
    if (clash) { msg("Pemenang Kostum Terbaik event ini sudah ditempati " + esc(clash.nama) + " (" + esc(clash.bib) + ").", false); return; }
  }
  updatePeserta(id, { kostum });
  render();
  msg("Tersimpan: Kostum: " + esc(kostum) + ".", true);
}
