/* pendaftaran.js v2 — meja pendaftaran: bayar + daftar ulang */
document.addEventListener("DOMContentLoaded", () => {
  const s = requireRole(["pendaftaran","admin"], "../");
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
  const list = loadPeserta().filter(p => p.eventId === eventId);
  document.getElementById("tbodyBelumBayar").innerHTML = list.filter(p => p.paymentStatus !== "lunas").map(p =>
    '<tr><td><b>' + esc(p.bib) + '</b><br>' + esc(p.nama) + '</td><td>' + esc(p.kategoriNama) + '<br>' + formatRupiah(p.harga) + '</td><td>' + esc(p.invoice) + '</td><td><button class="btn small green" onclick="aksiBayar(\'' + esc(p.id) + '\')">Konfirmasi Lunas</button></td></tr>').join("")
    || '<tr><td colspan="4" class="muted">Tidak ada antrean belum bayar.</td></tr>';
  document.getElementById("tbodyBelumDaftarUlang").innerHTML = list.filter(p => p.paymentStatus === "lunas" && p.daftarUlang !== "sudah").map(p =>
    '<tr><td><b>' + esc(p.bib) + '</b><br>' + esc(p.nama) + '</td><td>' + esc(p.kategoriNama) + '</td><td>' + esc(p.bib) + '</td><td><button class="btn small blue" onclick="aksiDaftarUlang(\'' + esc(p.id) + '\')">Tandai Daftar Ulang</button></td></tr>').join("")
    || '<tr><td colspan="4" class="muted">Tidak ada antrean daftar ulang.</td></tr>';
}
function cari(){
  const eventId = getCurrentEventId();
  const q = document.getElementById("inputCari").value.trim().toLowerCase();
  const p = loadPeserta().find(x => x.eventId === eventId && (x.bib.toLowerCase() === q || x.invoice.toLowerCase() === q || x.nama.toLowerCase().includes(q)));
  const box = document.getElementById("hasilCari");
  if (!p) { box.innerHTML = '<div class="alert err">Tidak ditemukan di event ini. Coba BIB, invoice, atau nama lengkap.</div>'; return; }
  box.innerHTML = '<h3 style="margin:0">' + esc(p.nama) + ' (' + esc(p.bib) + ')</h3><p class="muted">' + esc(p.kategoriNama) + ' • ' + formatRupiah(p.harga) + ' • Invoice ' + esc(p.invoice) + '</p>'
    + '<p>' + badgeBayar(p) + ' ' + badgeDaftarUlang(p) + ' ' + badgeRacepack(p) + ' ' + badgeFinish(p) + ' ' + badgeMedali(p) + '</p>'
    + '<div style="display:flex;gap:10px;flex-wrap:wrap">'
    + (p.paymentStatus !== "lunas" ? '<button class="btn green" onclick="aksiBayar(\'' + esc(p.id) + '\')">Konfirmasi Lunas</button>' : '')
    + (p.paymentStatus === "lunas" && p.daftarUlang !== "sudah" ? '<button class="btn blue" onclick="aksiDaftarUlang(\'' + esc(p.id) + '\')">Tandai Daftar Ulang</button>' : '')
    + '</div>';
}
function aksiBayar(id){
  updatePeserta(id, { paymentStatus:"lunas", paymentMethod:"Konfirmasi Petugas" });
  render();
  if (document.getElementById("inputCari").value.trim()) cari();
  msg("✅ Pembayaran dikonfirmasi lunas. Peserta sekarang resmi dan bisa daftar ulang.", true);
}
function aksiDaftarUlang(id){
  const p = findPeserta(id);
  if (p.paymentStatus !== "lunas") { msg("Belum bisa daftar ulang: pembayaran belum lunas.", false); return; }
  updatePeserta(id, { daftarUlang:"sudah" });
  render();
  if (document.getElementById("inputCari").value.trim()) cari();
  msg("✅ Daftar ulang selesai. Peserta bisa lanjut ke meja Race Pack.", true);
}
