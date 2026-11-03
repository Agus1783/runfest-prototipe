/* podium.js — halaman publik hasil: juara 1–3 per kategori + kostum */
document.addEventListener("DOMContentLoaded", () => {
  headerAuth("../");
  const list = loadPeserta();
  const section = (kat, elId) => {
    const rows = list
      .filter((p) => p.kategori === kat && p.juara > 0)
      .sort((a, b) => a.juara - b.juara);
    document.getElementById(elId).innerHTML = rows.length
      ? rows
          .map(
            (p) =>
              '<div class="' +
              (p.juara === 1 ? "first" : p.juara === 2 ? "second" : "third") +
              '"><b>Juara ' +
              p.juara +
              '</b><div style="font-weight:800;font-size:18px">' +
              esc(p.nama) +
              '</div><div class="small muted">' +
              esc(p.bib) +
              " • " +
              esc(p.jarak) +
              (p.waktu ? " • ⏱ " + esc(p.waktu) : "") +
              '</div><div class="small">Hadiah khusus juara ' +
              p.juara +
              " kategori " +
              esc(kat) +
              "</div></div>",
          )
          .join("")
      : '<p class="muted">Belum diumumkan.</p>';
  };
  section("Dewasa", "podDewasa");
  section("Anak-Anak", "podAnak");
  const noms = list.filter((p) => p.kostum !== "-");
  document.getElementById("kostumList").innerHTML = noms.length
    ? noms
        .map(
          (p) =>
            "<tr><td><b>" +
            esc(p.nama) +
            "</b> (" +
            esc(p.bib) +
            ")</td><td>" +
            esc(p.kostumDesc || "—") +
            "</td><td>" +
            (p.kostum === "Pemenang"
              ? '<span class="badge gold">🏆 Pemenang</span>'
              : '<span class="badge info">Nominasi</span>') +
            "</td></tr>",
        )
        .join("")
    : '<tr><td colspan="3" class="muted">Belum ada nominasi kostum.</td></tr>';
});
