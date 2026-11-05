/* daftar.js v2 — pendaftaran langsung (tanpa GForm) */
document.addEventListener("DOMContentLoaded", () => {
  headerAuth("");
  const evSel = document.getElementById("eventSelect");
  const katSel = document.getElementById("kategoriSelect");
  fillEventSelect(evSel, getCurrentEventId());
  const s = getSession();
  if (s && s.role === "peserta") {
    const me = allUsers().find(u => u.email === s.email);
    if (me) { document.getElementById("email").value = me.email; document.getElementById("nama").value = me.nama; }
  }
  function refreshKategori(){
    const kats = getCategories(evSel.value);
    katSel.innerHTML = kats.map(k => '<option value="'+k.id+'">'+esc(k.nama)+' — '+formatRupiah(k.harga)+'</option>').join("");
    updateHarga();
  }
  function updateHarga(){
    const k = getCategory(katSel.value);
    document.getElementById("hargaBox").innerHTML = k
      ? '<b>' + esc(k.nama) + ' (' + esc(k.jarak) + ')</b> — Biaya pendaftaran: <b>' + formatRupiah(k.harga) + '</b><br><span class="small muted">Kuota: ' + k.kuota + ' • Pembayaran dilakukan setelah daftar (status awal: Belum bayar).</span>'
      : 'Belum ada kategori untuk event ini.';
  }
  evSel.addEventListener("change", refreshKategori);
  katSel.addEventListener("change", updateHarga);
  refreshKategori();
  document.getElementById("formDaftar").addEventListener("submit", e => {
    e.preventDefault();
    const eventId = evSel.value;
    const kat = getCategory(katSel.value);
    if (!kat) { document.getElementById("msg").innerHTML = '<div class="alert err">Pilih kategori dulu.</div>'; return; }
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("pass").value;
    const existing = allUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      if (existing.role !== "peserta") { document.getElementById("msg").innerHTML = '<div class="alert err">Email ini adalah akun petugas, bukan peserta.</div>'; return; }
      if (existing.pass !== pass) { document.getElementById("msg").innerHTML = '<div class="alert err">Email sudah punya akun, tapi password tidak cocok. Masuk dulu atau pakai password akun tersebut.</div>'; return; }
    }
    const list = loadPeserta();
    if (list.some(p => p.eventId === eventId && p.kategoriId === kat.id && p.email.toLowerCase() === email.toLowerCase())) {
      document.getElementById("msg").innerHTML = '<div class="alert err">Email ini sudah terdaftar di event & kategori yang sama.</div>'; return;
    }
    const nama = document.getElementById("nama").value.trim();
    if (!existing) {
      const users = extraUsers();
      users.push({ email, pass, role:"peserta", nama });
      localStorage.setItem("RF2_USERS", JSON.stringify(users));
    }
    const bib = nextBib(eventId);
    const invoice = nextInvoice(eventId);
    const p = {
      id: eventId + ":" + bib, eventId, bib, nama, email,
      telepon: document.getElementById("telp").value.trim(),
      kaos: document.getElementById("kaos").value,
      kategoriId: kat.id, kategoriNama: kat.nama, jarak: kat.jarak, harga: kat.harga,
      invoice, paymentStatus:"pending", paymentMethod:"",
      daftarUlang:"belum", racepack:"belum", finish:"belum", waktu:"",
      medali:"belum", sertifikat:"belum", juara:0, kostum:"-", kostumDesc:"",
    };
    list.push(p); savePeserta(list);
    setSession({ email, role:"peserta", nama });
    setCurrentEventId(eventId);
    document.getElementById("msg").innerHTML = '<div class="alert ok">✅ Pendaftaran berhasil! BIB: <b>' + esc(bib) + '</b> • Invoice: <b>' + esc(invoice) + '</b> • Tagihan: <b>' + formatRupiah(kat.harga) + '</b> (Belum bayar). Kamu diarahkan ke dashboard peserta untuk membayar.</div>';
    setTimeout(() => { location.href = "pages/peserta.html"; }, 1800);
  });
});
