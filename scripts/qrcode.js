/* qrcode.js — render QR peserta.
   Prioritas: library QRCode (CDN qrcodejs) -> fallback gambar dari
   api.qrserver.com -> fallback teks payload, supaya halaman tetap
   berguna walau offline / CDN diblokir. */
function renderQRCode(el, text) {
  if (!el) return;
  el.innerHTML = "";
  try {
    if (window.QRCode) {
      new QRCode(el, {
        text: text,
        width: 200,
        height: 200,
        correctLevel: QRCode.CorrectLevel.M,
      });
      return;
    }
  } catch (e) {}
  const img = document.createElement("img");
  img.alt = "QR Code " + text;
  img.src =
    "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
    encodeURIComponent(text);
  img.onerror = function () {
    el.innerHTML =
      '<div style="font-family:monospace;word-break:break-all;text-align:center">' +
      esc(text) +
      '</div><p class="small muted">QR gagal dimuat (offline). Tunjukkan kode ini ke panitia.</p>';
  };
  el.appendChild(img);
}
function downloadQR(el) {
  const img = el.querySelector("img");
  if (img) {
    window.open(img.src, "_blank");
    return;
  }
  window.print();
}
