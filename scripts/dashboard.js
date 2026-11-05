/* dashboard.js v2 — admin, per event */
document.addEventListener("DOMContentLoaded", () => {
  const s = requireRole("admin", "../");
  if (!s) return;
  headerAuth("../");
  const sel = document.getElementById("eventSelect");
  fillEventSelect(sel, getCurrentEventId());
  sel.addEventListener("change", () => { setCurrentEventId(sel.value); render(); });
  ["fKategori","fBayar","fStatus"].forEach(id => document.getElementById(id).addEventListener("change", render));
  document.getElementById("fCari").addEventListener("input", render);
  document.getElementById("btnReset").addEventListener("click", () => {
    if (confirm("Reset semua data demo v2 ke kondisi awal? Pendaftaran akan kembali ke data seed, tapi akun login yang sudah dibuat tetap ada.")) {
      resetAll(); localStorage.removeItem("RF2_STARTS"); location.reload();
    }
  });
  render();
});
function render(){
  const eventId = getCurrentEventId();
  const list = loadPeserta().filter(p => p.eventId === eventId);
  const resmi = list.filter(p => p.paymentStatus === "lunas");
  const katSel = document.getElementById("fKategori");
  const curKat = katSel.value;
  katSel.innerHTML = '<option value="">Semua</option>' + getCategories(eventId).map(k => '<option value="'+k.id+'">'+esc(k.nama)+'</option>').join("");
  katSel.value = curKat;
  document.getElementById("sResmi").textContent = resmi.length;
  document.getElementById("sResmiNote").textContent = list.filter(p => p.paymentStatus !== "lunas").length + " belum bayar (tidak dihitung resmi)";
  document.getElementById("sRacepack").textContent = resmi.filter(p => p.racepack === "sudah").length;
  document.getElementById("sFinish").textContent = resmi.filter(p => p.finish === "finish").length;
  document.getElementById("sMedali").textContent = resmi.filter(p => p.medali === "sudah").length;
  document.getElementById("sTotal").textContent = list.length;
  document.getElementById("sPending").textContent = list.filter(p => p.paymentStatus !== "lunas").length;
  document.getElementById("sRevenue").textContent = formatRupiah(resmi.reduce((a,p) => a + Number(p.harga||0), 0));
  const pct = (a,b) => b ? Math.round(a/b*100) : 0;
  document.getElementById("barLunas").style.width = pct(resmi.length, list.length) + "%";
  document.getElementById("tLunas").textContent = pct(resmi.length, list.length) + "%";
  document.getElementById("barRacepack").style.width = pct(resmi.filter(p=>p.racepack==="sudah").length, resmi.length) + "%";
  document.getElementById("tRacepack").textContent = pct(resmi.filter(p=>p.racepack==="sudah").length, resmi.length) + "%";
  document.getElementById("barMedali").style.width = pct(resmi.filter(p=>p.medali==="sudah").length, resmi.length) + "%";
  document.getElementById("tMedali").textContent = pct(resmi.filter(p=>p.medali==="sudah").length, resmi.length) + "%";
  const kat = katSel.value, bayar = document.getElementById("fBayar").value, st = document.getElementById("fStatus").value;
  const q = document.getElementById("fCari").value.trim().toLowerCase();
  const rows = list.filter(p =>
    (!kat || p.kategoriId === kat) &&
    (!bayar || p.paymentStatus === bayar) &&
    (!st || (st==="belum-daftarulang" ? p.daftarUlang!=="sudah" : st==="racepack" ? p.racepack==="sudah" : st==="finish" ? p.finish==="finish" : st==="medali" ? p.medali==="sudah" : true)) &&
    (!q || (p.nama+" "+p.bib+" "+p.invoice+" "+p.email).toLowerCase().includes(q))
  );
  document.getElementById("tbody").innerHTML = rows.map(p => '<tr><td><b>' + esc(p.bib) + '</b><br>' + esc(p.nama) + '</td><td>' + esc(p.kategoriNama) + '</td><td>' + formatRupiah(p.harga) + '<br><span class="small muted">' + esc(p.invoice) + '</span></td><td>' + badgeBayar(p) + '</td><td>' + badgeDaftarUlang(p) + '</td><td>' + badgeRacepack(p) + '</td><td>' + badgeFinish(p) + '</td><td>' + badgeMedali(p) + '</td><td>' + badgeJuara(p) + ' ' + badgeKostum(p) + '</td></tr>').join("")
    || '<tr><td colspan="9" class="muted">Tidak ada peserta yang cocok dengan filter.</td></tr>';
  document.getElementById("countRow").textContent = rows.length + " peserta ditampilkan";
}
