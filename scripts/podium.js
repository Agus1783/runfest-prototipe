/* podium.js v2 — podium per event, dikelompokkan per kategori */
document.addEventListener("DOMContentLoaded", () => {
  headerAuth("../");
  const sel = document.getElementById("eventSelect");
  fillEventSelect(sel, getCurrentEventId());
  sel.addEventListener("change", () => { setCurrentEventId(sel.value); render(); });
  render();
});
function render(){
  const eventId = getCurrentEventId();
  const list = loadPeserta().filter(p => p.eventId === eventId);
  const medals = ["🥇","🥈","🥉"];
  const kats = getCategories(eventId);
  document.getElementById("podiumBox").innerHTML = kats.map(k => {
    const rows = list.filter(p => p.kategoriId === k.id && p.juara > 0).sort((a,b) => a.juara - b.juara);
    if (!rows.length) return "";
    return '<section class="card" style="margin-bottom:16px"><h2>Podium ' + esc(k.nama) + ' (' + esc(k.jarak) + ')</h2><div class="podium" style="margin-top:12px">' + rows.map(p =>
      '<div class="'+(p.juara===1?"first":p.juara===2?"second":"third")+'"><div class="podium-rank">' + medals[p.juara-1] + ' Juara ' + p.juara + '</div><div class="podium-name">' + esc(p.nama) + '</div><div class="podium-meta">' + esc(p.bib) + (p.waktu ? ' • ⏱ ' + esc(p.waktu) : '') + '</div><div class="small">Hadiah khusus juara ' + p.juara + '</div></div>'
    ).join("") + '</div></section>';
  }).join("") || '<div class="card"><p class="muted">Belum ada juara untuk event ini.</p></div>';
  const noms = list.filter(p => p.kostum !== "-");
  document.getElementById("kostumList").innerHTML = noms.length ? noms.map(p =>
    '<tr><td><b>' + esc(p.nama) + '</b> (' + esc(p.bib) + ')</td><td>' + esc(p.kategoriNama) + '</td><td>' + esc(p.kostumDesc || "—") + '</td><td>' + (p.kostum === "Pemenang" ? '<span class="badge gold">🏆 Pemenang (+ souvenir)</span>' : '<span class="badge info">Nominasi</span>') + '</td></tr>').join("")
    : '<tr><td colspan="4" class="muted">Belum ada nominasi kostum untuk event ini.</td></tr>';
}
