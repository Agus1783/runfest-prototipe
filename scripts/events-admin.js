/* events-admin.js v2 — admin: CRUD event + kategori */
document.addEventListener("DOMContentLoaded", () => {
  const s = requireRole("admin", "../");
  if (!s) return;
  headerAuth("../");
  fillEventSelect(document.getElementById("katEventSelect"), getCurrentEventId());
  fillEventSelect(document.getElementById("katListEventSelect"), getCurrentEventId());
  document.getElementById("katListEventSelect").addEventListener("change", render);
  document.getElementById("formEvent").addEventListener("submit", e => {
    e.preventDefault();
    const events = loadEvents();
    const id = "EVT-" + Date.now().toString().slice(-6);
    events.push({ id, nama: document.getElementById("evNama").value.trim(), tanggal: document.getElementById("evTanggal").value, lokasi: document.getElementById("evLokasi").value.trim(), status: document.getElementById("evStatus").value });
    saveEvents(events);
    fillEventSelect(document.getElementById("katEventSelect"), id);
    fillEventSelect(document.getElementById("katListEventSelect"), id);
    document.getElementById("msg").innerHTML = '<div class="alert ok">✅ Event dibuat. Sekarang tambahkan kategorinya di formulir di atas.</div>';
    render();
  });
  document.getElementById("formKategori").addEventListener("submit", e => {
    e.preventDefault();
    const cats = loadCategories();
    cats.push({ id: "CAT" + Date.now(), eventId: document.getElementById("katEventSelect").value, nama: document.getElementById("katNama").value.trim(), jarak: document.getElementById("katJarak").value.trim(), harga: parseInt(document.getElementById("katHarga").value, 10) || 0, kuota: parseInt(document.getElementById("katKuota").value, 10) || 0 });
    saveCategories(cats);
    document.getElementById("katListEventSelect").value = document.getElementById("katEventSelect").value;
    document.getElementById("msg").innerHTML = '<div class="alert ok">✅ Kategori ditambahkan.</div>';
    render();
  });
  render();
});
function render(){
  const events = loadEvents();
  const parts = loadPeserta();
  document.getElementById("eventTbody").innerHTML = events.map(ev => {
    const n = parts.filter(p => p.eventId === ev.id).length;
    return '<tr><td><b>' + esc(ev.nama) + '</b><br><span class="small muted">' + esc(ev.id) + '</span></td><td>' + esc(formatTanggal(ev.tanggal)) + '<br>' + esc(ev.lokasi) + '</td><td><select onchange="ubahStatus(\'' + ev.id + '\', this.value)"><option value="draft"' + (ev.status==="draft"?" selected":"") + '>Draft</option><option value="aktif"' + (ev.status==="aktif"?" selected":"") + '>Aktif</option><option value="selesai"' + (ev.status==="selesai"?" selected":"") + '>Selesai</option></select></td><td>' + n + '</td><td><button class="btn ghost small" onclick="hapusEvent(\'' + ev.id + '\')">Hapus</button></td></tr>';
  }).join("");
  const katEvent = document.getElementById("katListEventSelect").value;
  document.getElementById("katTbody").innerHTML = getCategories(katEvent).map(k => {
    const n = parts.filter(p => p.kategoriId === k.id).length;
    return '<tr><td><b>' + esc(k.nama) + '</b></td><td>' + esc(k.jarak) + '</td><td><input type="number" id="harga-' + k.id + '" value="' + k.harga + '" style="width:140px"></td><td>' + k.kuota + '</td><td>' + n + '</td><td><button class="btn small blue" onclick="simpanHarga(\'' + k.id + '\')">Simpan Harga</button> <button class="btn ghost small" onclick="hapusKategori(\'' + k.id + '\')">Hapus</button></td></tr>';
  }).join("") || '<tr><td colspan="6" class="muted">Belum ada kategori untuk event ini.</td></tr>';
}
function ubahStatus(id, status){
  const events = loadEvents();
  const ev = events.find(e => e.id === id);
  if (ev) { ev.status = status; saveEvents(events); }
  render();
}
function hapusEvent(id){
  if (loadPeserta().some(p => p.eventId === id)) { alert("Event ini tidak bisa dihapus karena sudah ada peserta terdaftar."); return; }
  if (!confirm("Hapus event ini beserta kategorinya?")) return;
  saveEvents(loadEvents().filter(e => e.id !== id));
  saveCategories(loadCategories().filter(c => c.eventId !== id));
  render();
}
function simpanHarga(id){
  const v = parseInt(document.getElementById("harga-" + id).value, 10);
  if (Number.isNaN(v) || v < 0) { alert("Harga tidak valid."); return; }
  const cats = loadCategories();
  const k = cats.find(c => c.id === id);
  if (k) { k.harga = v; saveCategories(cats); }
  document.getElementById("msg").innerHTML = '<div class="alert ok">✅ Harga kategori diperbarui (hanya untuk pendaftar baru).</div>';
  render();
}
function hapusKategori(id){
  if (loadPeserta().some(p => p.kategoriId === id)) { alert("Kategori ini tidak bisa dihapus karena sudah ada peserta terdaftar di kategori ini."); return; }
  if (!confirm("Hapus kategori ini?")) return;
  saveCategories(loadCategories().filter(c => c.id !== id));
  render();
}
