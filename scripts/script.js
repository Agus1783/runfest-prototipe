/* script.js — halaman beranda (index.html) */
document.addEventListener("DOMContentLoaded", () => {
  headerAuth("");
  document.getElementById("gformBtn").href = GFORM_URL;
  document.getElementById("gformBtn2").href = GFORM_URL;
  document.getElementById("eventDate").textContent = EVENT_DATE;
  const list = loadPeserta();
  // PERBAIKAN: hanya peserta via GForm yang dihitung. Akun register-web
  // saja (belum isi GForm) ditampilkan terpisah, tidak masuk angka utama.
  const resmi = list.filter(isGform);
  const webSaja = list.filter((p) => !isGform(p));
  const n = (fn) => resmi.filter(fn).length;
  document.getElementById("statTotal").textContent = resmi.length;
  document.getElementById("statTotalNote").textContent = webSaja.length
    ? "+" + webSaja.length + " akun web belum isi GForm (tidak dihitung)"
    : "Semua akun sudah via GForm";
  document.getElementById("statRacepack").textContent = n(
    (p) => p.racepack === "sudah",
  );
  document.getElementById("statFinish").textContent = n(
    (p) => p.finish === "finish",
  );
  document.getElementById("statMedali").textContent = n(
    (p) => p.medali === "sudah",
  );
  const podium = (kat) =>
    list
      .filter((p) => p.kategori === kat && p.juara > 0)
      .sort((a, b) => a.juara - b.juara);
  const medals = ["🥇", "🥈", "🥉"];
  const renderPodium = (kat, elId) => {
    const rows = podium(kat);
    document.getElementById(elId).innerHTML = rows.length
      ? rows
          .map(
            (p) =>
              '<div class="' +
              (p.juara === 1 ? "first" : p.juara === 2 ? "second" : "third") +
              '">' +
              '<div class="podium-rank">' +
              medals[p.juara - 1] +
              " Juara " +
              p.juara +
              "</div>" +
              '<div class="podium-name">' +
              esc(p.nama) +
              "</div>" +
              '<div class="podium-meta">' +
              esc(p.bib) +
              " • " +
              esc(p.jarak) +
              (p.waktu ? " • ⏱ " + esc(p.waktu) : "") +
              "</div>" +
              "</div>",
          )
          .join("")
      : '<p class="muted">Juara belum diumumkan.</p>';
  };

  renderPodium("Dewasa", "podiumDewasa");
  renderPodium("Anak-Anak", "podiumAnak");
  const win = list.find((p) => p.kostum === "Pemenang");
  document.getElementById("kostumWinner").innerHTML = win
    ? "<b>🏆 " +
      esc(win.nama) +
      " (" +
      esc(win.bib) +
      ")</b><br>" +
      esc(win.kostumDesc)
    : "Pemenang kostum terbaik belum diumumkan.";
});
