/* script.js v2 — beranda */
document.addEventListener("DOMContentLoaded", () => {
  headerAuth("");
  const sel = document.getElementById("eventSelect");
  fillEventSelect(sel, getCurrentEventId());
  sel.addEventListener("change", () => { setCurrentEventId(sel.value); render(); });
  render();
});
function render(){
  const eventId = getCurrentEventId();
  const ev = getEvent(eventId);
  const list = loadPeserta().filter(p => p.eventId === eventId);
  const resmi = list.filter(p => p.paymentStatus === "lunas");
  document.getElementById("eventInfo").textContent = ev ? ev.nama + " • " + formatTanggal(ev.tanggal) + " • " + ev.lokasi + " • Status: " + ev.status : "";
  document.getElementById("katEventNama").textContent = ev ? ev.nama : "";
  document.getElementById("podEventNama").textContent = ev ? ev.nama : "";
  document.getElementById("statResmi").textContent = resmi.length;
  document.getElementById("statRacepack").textContent = resmi.filter(p => p.racepack === "sudah").length;
  document.getElementById("statFinish").textContent = resmi.filter(p => p.finish === "finish").length;
  document.getElementById("statMedali").textContent = resmi.filter(p => p.medali === "sudah").length;
  const kats = getCategories(eventId);
  document.getElementById("katTbody").innerHTML = kats.map(k => {
    const n = list.filter(p => p.kategoriId === k.id && p.paymentStatus === "lunas").length;
    return '<tr><td><b>' + esc(k.nama) + '</b></td><td>' + esc(k.jarak) + '</td><td>' + formatRupiah(k.harga) + '</td><td>' + k.kuota + '</td><td>' + n + '</td></tr>';
  }).join("") || '<tr><td colspan="5" class="muted">Belum ada kategori untuk event ini. Admin bisa menambahkannya di Kelola Event.</td></tr>';
  const medals = ["🥇","🥈","🥉"];
  const podHtml = kats.map(k => {
    const rows = list.filter(p => p.kategoriId === k.id && p.juara > 0).sort((a,b) => a.juara - b.juara);
    if (!rows.length) return "";
    return '<h3 style="margin-top:14px">' + esc(k.nama) + '</h3><div class="podium">' + rows.map(p =>
      '<div class="'+(p.juara===1?"first":p.juara===2?"second":"third")+'"><div class="podium-rank">' + medals[p.juara-1] + ' Juara ' + p.juara + '</div><div class="podium-name">' + esc(p.nama) + '</div><div class="podium-meta">' + esc(p.bib) + (p.waktu ? ' • ⏱ ' + esc(p.waktu) : '') + '</div></div>'
    ).join("") + '</div>';
  }).join("");
  document.getElementById("podiumList").innerHTML = podHtml || '<p class="muted">Belum ada juara untuk event ini.</p>';
  const win = list.find(p => p.kostum === "Pemenang");
  document.getElementById("kostumWinner").innerHTML = win
    ? '<b>🏆 ' + esc(win.nama) + " (" + esc(win.bib) + ", " + esc(win.kategoriNama) + ")</b><br>" + esc(win.kostumDesc || "Kostum terbaik")
    : "Pemenang kostum terbaik belum diumumkan untuk event ini.";
}
