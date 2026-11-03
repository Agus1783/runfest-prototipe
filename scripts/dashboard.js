/* dashboard.js — dashboard PANITIA */
let session;
document.addEventListener("DOMContentLoaded", () => {
  session = requireRole("panitia", "../");
  if (!session) return;
  headerAuth("../");
  // Terima filter dari kartu beranda: ?status=racepack&sumber=gform
  const params = new URLSearchParams(location.search);
  if (params.get("status") && params.get("status") !== "all")
    document.getElementById("fStatus").value = params.get("status");
  if (params.get("sumber"))
    document.getElementById("fSumber").value = params.get("sumber");
  // Kartu statistik di dashboard ini juga bisa diklik untuk memfilter tabel
  document.querySelectorAll(".card.clickable").forEach((card) => {
    card.addEventListener("click", () => {
      const f = card.dataset.filter;
      document.getElementById("fStatus").value = f === "all" ? "" : f;
      document.getElementById("fSumber").value = "gform";
      render();
      document
        .getElementById("tbody")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  render();
  document.getElementById("fKategori").addEventListener("change", render);
  document.getElementById("fStatus").addEventListener("change", render);
  document.getElementById("fSumber").addEventListener("change", render);
  document.getElementById("fCari").addEventListener("input", render);
  document.getElementById("btnReset").addEventListener("click", () => {
    if (confirm("Reset semua data demo ke kondisi awal?")) {
      resetPeserta();
      render();
    }
  });
});
function render() {
  const list = loadPeserta();
  // Angka dashboard = peserta resmi via GForm saja (akun web saja tidak dihitung)
  const resmi = list.filter(isGform);
  const webSaja = list.filter((p) => !isGform(p));
  const n = (fn) => resmi.filter(fn).length;
  document.getElementById("sTotal").textContent = resmi.length;
  document.getElementById("sTotalNote").textContent = webSaja.length
    ? "+" +
      webSaja.length +
      " akun web belum isi GForm — ubah filter Sumber ke 'Register web saja' untuk melihatnya"
    : "Semua akun sudah via GForm";
  document.getElementById("sRacepack").textContent = n(
    (p) => p.racepack === "sudah",
  );
  document.getElementById("sFinish").textContent = n(
    (p) => p.finish === "finish",
  );
  document.getElementById("sMedali").textContent = n(
    (p) => p.medali === "sudah",
  );
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  document.getElementById("barRacepack").style.width =
    pct(
      n((p) => p.racepack === "sudah"),
      resmi.length,
    ) + "%";
  document.getElementById("barFinish").style.width =
    pct(
      n((p) => p.finish === "finish"),
      resmi.length,
    ) + "%";
  document.getElementById("barMedali").style.width =
    pct(
      n((p) => p.medali === "sudah"),
      resmi.length,
    ) + "%";
  document.getElementById("tRacepack").textContent =
    pct(
      n((p) => p.racepack === "sudah"),
      resmi.length,
    ) + "%";
  document.getElementById("tFinish").textContent =
    pct(
      n((p) => p.finish === "finish"),
      resmi.length,
    ) + "%";
  document.getElementById("tMedali").textContent =
    pct(
      n((p) => p.medali === "sudah"),
      resmi.length,
    ) + "%";
  const kat = document.getElementById("fKategori").value;
  const st = document.getElementById("fStatus").value;
  const sumber = document.getElementById("fSumber").value;
  const q = document.getElementById("fCari").value.trim().toLowerCase();
  const rows = list.filter(
    (p) =>
      (!kat || p.kategori === kat) &&
      (!sumber || p.sumber === sumber || (p.sumber || "gform") === sumber) &&
      (!st ||
        (st === "racepack"
          ? p.racepack === "sudah"
          : st === "belum-racepack"
            ? p.racepack !== "sudah"
            : st === "finish"
              ? p.finish === "finish"
              : st === "medali"
                ? p.medali === "sudah"
                : st === "belum-medali"
                  ? p.finish === "finish" && p.medali !== "sudah"
                  : true)) &&
      (!q || (p.nama + " " + p.bib + " " + p.email).toLowerCase().includes(q)),
  );
  document.getElementById("tbody").innerHTML =
    rows
      .map(
        (p) =>
          "<tr><td><b>" +
          esc(p.bib) +
          "</b><br>" +
          esc(p.nama) +
          "</td><td>" +
          esc(p.kategori) +
          " • " +
          esc(p.jarak) +
          "</td><td>" +
          badgeSumber(p) +
          "</td><td>" +
          badgeRacepack(p) +
          "</td><td>" +
          badgeFinish(p) +
          "</td><td>" +
          badgeMedali(p) +
          "</td><td>" +
          (p.juara
            ? '<span class="badge gold">Juara ' + p.juara + "</span>"
            : "-") +
          " " +
          (p.kostum !== "-"
            ? '<span class="badge info">' + esc(p.kostum) + "</span>"
            : "") +
          '</td><td><a class="btn small blue" href="scan.html?bib=' +
          esc(p.bib) +
          '">Proses →</a></td></tr>',
      )
      .join("") ||
    '<tr><td colspan="8" class="muted">Tidak ada peserta yang cocok dengan filter.</td></tr>';
  document.getElementById("countRow").textContent =
    rows.length +
    " peserta ditampilkan (filter sumber: " +
    (sumber === "gform"
      ? "Via GForm"
      : sumber === "web"
        ? "Register web saja"
        : "Semua") +
    ")";
}
