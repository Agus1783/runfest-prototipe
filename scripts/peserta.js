/* peserta.js — dashboard PESERTA: profil, QR, timeline alur */
document.addEventListener("DOMContentLoaded", () => {
  const s = requireRole("peserta", "../");
  if (!s) return;
  headerAuth("../");
  let p = s.bib ? findPeserta(s.bib) : null;
  if (!p) {
    document.getElementById("pesertaBox").innerHTML =
      '<div class="alert err">Akun ini belum terhubung ke BIB peserta. Hubungi panitia atau daftar ulang lewat register.</div>';
    return;
  }
  const steps = [
    {
      t: "1. Daftar via Google Form",
      d: isGform(p)
        ? "Sudah terdaftar resmi via GForm."
        : "Kamu BARU register akun web — ini belum dihitung sebagai pendaftaran lomba. Isi GForm dulu, lalu panitia akan mengonfirmasimu.",
      done: isGform(p),
      now: !isGform(p),
    },
    {
      t: "2. Ambil Race Pack di Sekretariat",
      d: "Nomor peserta (BIB) + totebag + air minum. Tunjukkan QR di bawah.",
      done: p.racepack === "sudah",
      now: p.racepack !== "sudah",
    },
    {
      t: "3. Lomba & Finish",
      d:
        p.finish === "finish"
          ? "Selamat! Kamu finish dengan waktu " + esc(p.waktu) + "."
          : p.finish === "DNF"
            ? "Tercatat DNF — medali & sertifikat hanya untuk finisher."
            : "Tunggu aba-aba start, lalu selesaikan rute sesuai kategorimu.",
      done: p.finish === "finish",
      now: p.racepack === "sudah" && p.finish === "belum",
    },
    {
      t: "4. Ambil Medali + Sertifikat",
      d: "Hanya untuk peserta yang sampai finish. Tunjukkan QR ke panitia.",
      done: p.medali === "sudah",
      now: p.finish === "finish" && p.medali !== "sudah",
    },
    {
      t: "5. Podium & Kostum Terbaik",
      d: p.juara
        ? "Kamu Juara " +
          p.juara +
          " kategori " +
          esc(p.kategori) +
          " — ambil hadiah khusus di panggung utama."
        : p.kostum === "Pemenang"
          ? "Kostummu jadi pemenang Kostum Terbaik!"
          : "Juara 1–3 tiap kategori & pemenang kostum diumumkan di panggung.",
      done: !!p.juara || p.kostum === "Pemenang",
    },
  ];
  document.getElementById("pesertaBox").innerHTML =
    (!isGform(p)
      ? '<div class="alert" style="margin-bottom:14px">⚠️ <b>Belum terdaftar resmi.</b> Akun ini baru register di web dan <b>belum dihitung sebagai peserta</b>. Silakan isi Google Form dulu: <a href="' +
        GFORM_URL +
        '" target="_blank" rel="noopener">Daftar via Google Form →</a>. Setelah itu tunjukkan QR ini ke panitia agar statusmu dikonfirmasi.</div>'
      : "") +
    '<div class="grid grid2"><div><h2 style="margin:0">' +
    esc(p.nama) +
    '</h2><p class="muted">' +
    esc(p.bib) +
    " • " +
    esc(p.kategori) +
    " • " +
    esc(p.jarak) +
    " • Kaos " +
    esc(p.kaos) +
    "<br>" +
    esc(p.email) +
    " • " +
    esc(p.telepon) +
    "</p>" +
    "<p>" +
    badgeSumber(p) +
    " " +
    badgeRacepack(p) +
    " " +
    badgeFinish(p) +
    " " +
    badgeMedali(p) +
    "</p>" +
    (p.juara
      ? '<p><span class="badge gold">🏆 Juara ' +
        p.juara +
        " — " +
        esc(p.kategori) +
        "</span></p>"
      : "") +
    (p.kostum !== "-"
      ? '<p><span class="badge info">🎭 Kostum: ' +
        esc(p.kostum) +
        (p.kostumDesc ? " — " + esc(p.kostumDesc) : "") +
        "</span></p>"
      : "") +
    '<button class="btn" onclick="window.print()">🖨️ Cetak / Simpan QR</button></div>' +
    '<div><div class="qr-box" id="qrBox"></div><p class="small muted" style="text-align:center">Payload QR: <code>' +
    esc(qrPayload(p)) +
    "</code><br>Tunjukkan QR ini di sekretariat & loket medali.</p></div></div>";
  renderQRCode(document.getElementById("qrBox"), qrPayload(p));
  document.getElementById("timeline").innerHTML = steps
    .map(
      (s2) =>
        '<li><span class="dot ' +
        (s2.done ? "done" : s2.now ? "now" : "") +
        '">' +
        (s2.done ? "✓" : "•") +
        "</span><span><b>" +
        s2.t +
        '</b><br><span class="muted small">' +
        s2.d +
        "</span></span></li>",
    )
    .join("");
});
