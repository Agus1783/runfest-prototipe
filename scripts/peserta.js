/* peserta.js v2 — dashboard peserta multi-event */
document.addEventListener("DOMContentLoaded", () => {
  const s = requireRole("peserta", "../");
  if (!s) return;
  headerAuth("../");
  render();
});
function render(){
  const s = getSession();
  const list = loadPeserta().filter(p => p.email.toLowerCase() === s.email.toLowerCase());
  const box = document.getElementById("listBox");
  if (!list.length) {
    box.innerHTML = '<div class="card"><p class="muted">Kamu belum mendaftar event apa pun.</p><p><a class="btn" href="../daftar.html">Daftar Event →</a></p></div>';
    return;
  }
  box.innerHTML = list.map(p => {
    const ev = getEvent(p.eventId);
    const steps = [
      { t:"Daftar di web", done:true },
      { t:"Bayar (" + formatRupiah(p.harga) + ")", done:p.paymentStatus === "lunas", now:p.paymentStatus !== "lunas" },
      { t:"Daftar ulang", done:p.daftarUlang === "sudah", now:p.paymentStatus === "lunas" && p.daftarUlang !== "sudah" },
      { t:"Ambil race pack (BIB + totebag + air minum)", done:p.racepack === "sudah" },
      { t:"Finish", done:p.finish === "finish", now:p.racepack === "sudah" && p.finish === "belum" },
      { t:"Medali + sertifikat", done:p.medali === "sudah" },
    ];
    return '<section class="card" style="margin-bottom:16px">'
      + '<h2 style="margin:0">' + esc(ev ? ev.nama : p.eventId) + ' — ' + esc(p.kategoriNama) + '</h2>'
      + '<p class="muted">' + esc(p.bib) + ' • Invoice ' + esc(p.invoice) + ' • ' + formatRupiah(p.harga) + ' • Kaos ' + esc(p.kaos) + '</p>'
      + '<p>' + badgeBayar(p) + ' ' + badgeDaftarUlang(p) + ' ' + badgeRacepack(p) + ' ' + badgeFinish(p) + ' ' + badgeMedali(p) + ' ' + badgeJuara(p) + ' ' + badgeKostum(p) + '</p>'
      + (p.paymentStatus !== "lunas" ? '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:end;margin:12px 0"><div><label style="margin:0 0 4px">Metode bayar (simulasi)</label><select id="pay-' + esc(p.id) + '"><option>QRIS</option><option>VA BCA</option><option>GoPay</option><option>OVO</option><option>Transfer Bank</option></select></div><button class="btn green" onclick="aksiBayar(\'' + esc(p.id) + '\')">💳 Simulasikan Pembayaran Berhasil</button></div><p class="small muted">Simulasi prototipe — tidak ada uang asli yang bergerak.</p>' : '<p class="small muted">Pembayaran lunas via ' + esc(p.paymentMethod || "-") + '. Tunjukkan QR di bawah ke meja pendaftaran & race pack.</p>')
      + '<div class="grid grid2"><div><div class="qr-box" id="qr-' + esc(p.id) + '"></div><p class="small muted" style="text-align:center">Payload QR: <code>' + esc(qrPayload(p)) + '</code></p><button class="btn ghost small" onclick="window.print()">🖨️ Cetak QR</button></div>'
      + '<div><h3>Jejak alur</h3><ul class="timeline">' + steps.map(st => '<li><span class="dot ' + (st.done ? 'done' : st.now ? 'now' : '') + '">' + (st.done ? '✓' : '•') + '</span><span>' + st.t + '</span></li>').join("") + '</ul></div></div>'
      + '</section>';
  }).join("");
  list.forEach(p => { const el = document.getElementById("qr-" + p.id); if (el) renderQRCode(el, qrPayload(p)); });
}
function aksiBayar(id){
  const method = document.getElementById("pay-" + id).value;
  updatePeserta(id, { paymentStatus:"lunas", paymentMethod: method });
  document.getElementById("msg").innerHTML = '<div class="alert ok">✅ Pembayaran (simulasi) berhasil via ' + esc(method) + '. Status sekarang: Lunas — kamu sudah resmi terdaftar.</div>';
  render();
}
