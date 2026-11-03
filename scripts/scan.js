/* scan.js — VERIFIKASI PANITIA di sekretariat / loket medali.
   Aturan alur yang ditegakkan:
   0) Harus via GForm dulu — akun register-web saja TIDAK boleh ambil
      race pack sampai panitia mengonfirmasi ia sudah isi GForm.
   1) Race pack dulu (BIB + totebag + air minum)
   2) Baru bisa ditandai finish (atau DNF)
   3) Medali + sertifikat hanya jika finish
   4) Juara 1–3 hanya untuk finisher, per kategori
   5) Kostum terbaik bisa ditandai kapan saja, pemenang cukup 1 orang */
let current = null;
document.addEventListener("DOMContentLoaded", () => {
  const s = requireRole("panitia", "../");
  if (!s) return;
  headerAuth("../");
  renderRaceStart();
  setInterval(() => {
    const el = document.getElementById("raceElapsed");
    const st = getRaceStart();
    if (el && st) el.textContent = formatElapsed(Date.now() - st);
  }, 1000);

  const sel = document.getElementById("pilihPeserta");
  loadPeserta().forEach((p) => {
    const o = document.createElement("option");
    o.value = p.bib;
    o.textContent = p.bib + " — " + p.nama + " (" + p.kategori + ")";
    sel.appendChild(o);
  });
  document.getElementById("btnCari").addEventListener("click", cari);
  document.getElementById("btnPilih").addEventListener("click", () => {
    document.getElementById("inputQR").value = sel.value;
    cari();
  });
  document.getElementById("inputQR").addEventListener("keydown", (e) => {
    if (e.key === "Enter") cari();
  });
  const bib = new URLSearchParams(location.search).get("bib");
  if (bib) {
    document.getElementById("inputQR").value = bib;
    cari();
  }
});
/* START LOMBA GLOBAL — satu tombol untuk semua peserta & kategori.
   Disimpan di localStorage (RF_RACE_START) supaya tahan refresh halaman. */
function getRaceStart() {
  const v = parseInt(localStorage.getItem("RF_RACE_START") || "", 10);
  return Number.isNaN(v) ? null : v;
}
function formatClock(ts) {
  const d = new Date(ts);
  const p = (n) => String(n).padStart(2, "0");
  return p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
}
function formatElapsed(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const p = (n) => String(n).padStart(2, "0");
  return h > 0 ? h + ":" + p(m) + ":" + p(sec) : m + ":" + p(sec);
}
function renderRaceStart() {
  const box = document.getElementById("raceStartBox");
  if (!box) return;
  const start = getRaceStart();
  if (!start) {
    box.innerHTML =
      '<div style="display:flex;gap:12px;justify-content:space-between;align-items:center;flex-wrap:wrap">' +
      '<div><b>🏁 Start Lomba</b><br><span class="muted small">Lomba belum dimulai. Tekan sekali saja — berlaku untuk semua peserta.</span></div>' +
      '<button class="btn" onclick="aksiStartRace()">▶ Mulai Lomba</button></div>';
  } else {
    box.innerHTML =
      '<div style="display:flex;gap:12px;justify-content:space-between;align-items:center;flex-wrap:wrap">' +
      '<div><b>🏁 Lomba sedang berjalan</b><br><span class="muted small">Dimulai pukul ' +
      formatClock(start) +
      ' • Berjalan: <b id="raceElapsed">' +
      formatElapsed(Date.now() - start) +
      "</b></span></div>" +
      '<button class="btn ghost small" onclick="aksiResetRace()">Reset Start</button></div>';
  }
}
function aksiStartRace() {
  if (getRaceStart())
    return msg(
      "Lomba sudah dimulai. Tombol Start tidak bisa ditekan dua kali supaya hitungan tidak ke-reset.",
      false,
    );
  localStorage.setItem("RF_RACE_START", String(Date.now()));
  renderRaceStart();
  msg(
    "🏁 Lomba <b>DIMULAI</b> pukul " +
      formatClock(getRaceStart()) +
      ". Tombol Finish akan menghitung dari waktu start ditekan.",
    true,
  );
}
function aksiResetRace() {
  if (
    !confirm(
      "Reset waktu start? Waktu finish yang sudah tercatat tidak berubah, tapi finish berikutnya akan dihitung dari start yang baru.",
    )
  )
    return;
  localStorage.removeItem("RF_RACE_START");
  renderRaceStart();
  msg(
    "Waktu start direset. Tekan ▶ Mulai Lomba lagi sebelum mencatat finish berikutnya.",
    true,
  );
}

function msg(html, ok) {
  const el = document.getElementById("scanMsg");
  el.className = "alert " + (ok ? "ok" : "err");
  el.innerHTML = html;
}
function cari() {
  const bib = bibFromQr(document.getElementById("inputQR").value);
  const p = findPeserta(bib);
  if (!p) {
    current = null;
    document.getElementById("hasil").innerHTML =
      '<div class="alert err">Peserta tidak ditemukan. Coba BIB contoh: <b>RF-101</b>, atau tempel payload QR lengkap.</div>';
    return;
  }
  current = p;
  document.getElementById("scanMsg").innerHTML = "";
  document.getElementById("hasil").innerHTML =
    '<h3 style="margin:0">' +
    esc(p.nama) +
    ' <span class="muted">(' +
    esc(p.bib) +
    ")</span></h3>" +
    '<p class="muted">' +
    esc(p.kategori) +
    " • " +
    esc(p.jarak) +
    " • Kaos " +
    esc(p.kaos) +
    " • " +
    esc(p.email) +
    "</p>" +
    "<p>" +
    badgeSumber(p) +
    " " +
    badgeRacepack(p) +
    " " +
    badgeFinish(p) +
    " " +
    badgeMedali(p) +
    (p.juara
      ? ' <span class="badge gold">🏆 Juara ' + p.juara + "</span>"
      : "") +
    (p.kostum && p.kostum !== "-"
      ? ' <span class="badge info">🎭 Kostum: ' + esc(p.kostum) + "</span>"
      : "") +
    "</p>" +
    (!isGform(p)
      ? '<div class="alert">⚠️ Akun ini <b>baru register di web, belum isi GForm</b> — belum dihitung sebagai peserta resmi dan belum boleh ambil race pack. Jika ia sudah mengisi GForm, klik tombol di bawah untuk mengonfirmasinya.<br><br><button class="btn" onclick="aksiKonfirmasiGform()">✅ Konfirmasi: Sudah Isi GForm</button></div>'
      : "") +
    '<div class="grid grid2">' +
    '<button class="btn" onclick="aksiRacepack()">🎒 Ambil Race Pack<br><span style="font-weight:400;font-size:12px">BIB + totebag + air minum</span></button>' +
    '<button class="btn blue" onclick="aksiFinish()">🏁 Tandai Finish</button>' +
    '<button class="btn" onclick="aksiDNF()">Tandai DNF</button>' +
    '<button class="btn green" onclick="aksiMedali()">🏅 Ambil Medali + Sertifikat</button>' +
    "</div>" +
    '<div style="margin-top:14px"><label>Kostum</label><select id="setKostum"><option value="-">Biasa</option><option value="Nominasi">Nominasi Kostum Terbaik</option><option value="Pemenang">Pemenang Kostum Terbaik</option></select></div>' +
    '<div style="margin-top:12px"><button class="btn dark" onclick="aksiKostum()">Simpan Kostum</button></div>' +
    '<p class="small muted">Juara 1–3 dihitung otomatis dari waktu finish tercepat di kategori ' +
    esc(p.kategori) +
    " — tidak diisi manual.</p>";
  // document.getElementById("setJuara").value = String(p.juara || 0);
  document.getElementById("setKostum").value = p.kostum || "-";
}
function refresh() {
  if (current) {
    document.getElementById("inputQR").value = current.bib;
    cari();
  }
}
function aksiKonfirmasiGform() {
  current = updatePeserta(current.bib, { sumber: "gform" });
  msg(
    "✅ <b>" +
      esc(current.nama) +
      "</b> sekarang tercatat sebagai peserta resmi via GForm dan sudah boleh ambil race pack.",
    true,
  );
  refresh();
}
function aksiRacepack() {
  if (!isGform(current))
    return msg(
      "Belum boleh ambil race pack: peserta ini <b>baru register di web, belum isi GForm</b>. Konfirmasi dulu lewat tombol di atas jika ia sudah mengisi GForm.",
      false,
    );
  if (current.racepack === "sudah")
    return msg(
      "Race pack <b>" +
        esc(current.bib) +
        "</b> sudah pernah diambil — tidak bisa diambil dua kali.",
      false,
    );
  current = updatePeserta(current.bib, { racepack: "sudah" });
  msg(
    "✅ Race pack diserahkan: nomor peserta <b>" +
      esc(current.bib) +
      "</b> + totebag + air minum.",
    true,
  );
  refresh();
}
function parseWaktuKeDetik(w) {
  if (!w) return Infinity;
  const parts = String(w).trim().split(":").map(Number);
  if (parts.some((n) => Number.isNaN(n))) return Infinity;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return Infinity;
}
function hitungJuaraOtomatis() {
  const list = loadPeserta();
  list.forEach((p) => {
    p.juara = 0;
  }); // reset dulu, supaya peringkat lama tidak nyangkut
  const kategoriList = [...new Set(list.map((p) => p.kategori))];
  kategoriList.forEach((kat) => {
    const finisher = list
      .filter((p) => p.kategori === kat && p.finish === "finish")
      .sort(
        (a, b) =>
          parseWaktuKeDetik(a.waktu) - parseWaktuKeDetik(b.waktu) ||
          a.bib.localeCompare(b.bib),
      );
    finisher.slice(0, 3).forEach((p, i) => {
      p.juara = i + 1;
    });
  });
  savePeserta(list);
}

function aksiFinish() {
  if (!isGform(current))
    return msg(
      "Belum bisa finish: peserta ini belum terdaftar via GForm.",
      false,
    );
  if (current.racepack !== "sudah")
    return msg(
      "Belum bisa finish: peserta belum mengambil race pack di sekretariat.",
      false,
    );
  if (current.finish === "finish")
    return msg("Peserta ini sudah tercatat finish.", false);
  const start = getRaceStart();
  if (!start)
    return msg(
      "Lomba belum dimulai. Tekan tombol ▶ Mulai Lomba di atas dulu, baru waktu finish bisa dihitung.",
      false,
    );
  const w = formatElapsed(Date.now() - start);
  current = updatePeserta(current.bib, { finish: "finish", waktu: w });
  hitungJuaraOtomatis();
  current = findPeserta(current.bib);
  msg(
    "🏁 <b>" +
      esc(current.nama) +
      "</b> tercatat FINISH (" +
      esc(w) +
      ", dihitung sejak start pukul " +
      formatClock(start) +
      "). Sekarang ia berhak mengambil medali + sertifikat.",
    true,
  );
  refresh();
}

function aksiDNF() {
  current = updatePeserta(current.bib, { finish: "DNF", waktu: "", juara: 0 });
  hitungJuaraOtomatis();
  current = findPeserta(current.bib);
  msg(
    "Peserta tercatat DNF. Medali & sertifikat tidak dapat diambil (khusus finisher).",
    true,
  );
  refresh();
}
function aksiMedali() {
  if (current.finish !== "finish")
    return msg(
      "Medali + sertifikat hanya untuk peserta yang sampai finish. Status saat ini: <b>" +
        esc(current.finish) +
        "</b>.",
      false,
    );
  if (current.medali === "sudah")
    return msg("Medali + sertifikat sudah pernah diambil.", false);
  current = updatePeserta(current.bib, {
    medali: "sudah",
    sertifikat: "sudah",
  });
  msg(
    "🏅 Medali + sertifikat diserahkan kepada <b>" +
      esc(current.nama) +
      "</b>.",
    true,
  );
  refresh();
}
function aksiKostum() {
  const kostum = document.getElementById("setKostum").value;
  if (kostum === "Pemenang") {
    const clash = loadPeserta().find(
      (p) => p.kostum === "Pemenang" && p.bib !== current.bib,
    );
    if (clash)
      return msg(
        "Pemenang Kostum Terbaik sudah ditempati " +
          esc(clash.nama) +
          " (" +
          esc(clash.bib) +
          ").",
        false,
      );
  }
  current = updatePeserta(current.bib, { kostum });
  refresh();
  msg("Tersimpan: Kostum: " + esc(kostum) + ".", true);
}
