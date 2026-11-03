# Run Festival 2026 — Prototipe Sistem Manajemen Event Lomba Lari

Prototipe statis HTML + CSS + JavaScript, modular (tidak menumpuk di satu file).
Data demo disimpan di `localStorage` browser, jadi perubahan di halaman Scan
langsung terlihat di Dashboard, Peserta, dan Podium selama dibuka dari server
yang sama.

## Struktur

```
index.html                 Beranda + alur + podium ringkas
login.html                 Login statis
register.html              Register peserta statis (otomatis dapat BIB baru)
pages/
  dashboard.html           Dashboard panitia: statistik, progres, filter peserta
  peserta.html             Dashboard peserta: profil, QR, jejak alur
  scan.html                Verifikasi panitia (sekretariat & loket medali)
  podium.html              Juara 1-3 per kategori + kostum terbaik
styles/
  style.css                Global (layout, kartu, tombol, tabel, badge)
  home.css                 Khusus beranda
  dashboard.css            Khusus dashboard / podium
  auth.css                 Khusus login & register
scripts/
  data.js                  Data seed + GFORM_URL + aturan badge + localStorage
  auth.js                  User statis, session, guard role
  qrcode.js                Render QR (library CDN + fallback)
  script.js                Logika beranda
  dashboard.js             Logika dashboard panitia
  peserta.js               Logika dashboard peserta
  scan.js                  Logika verifikasi + aturan alur
  podium.js                Logika halaman podium
```

## Cara menjalankan (disarankan pakai server lokal, bukan double-click file)

```bash
cd runfest
python3 -m http.server 8000
# buka http://localhost:8000
```

> Dibuka langsung via `file://` tetap bisa tampil, tapi `localStorage`
> antar folder kadang tidak konsisten di beberapa browser. Pakai server lokal
> supaya Dashboard ↔ Scan ↔ QR peserta sinkron.

## Akun demo

| Role    | Email                | Password   | Tujuan              |
|---------|----------------------|------------|---------------------|
| Panitia | panitia@runfest.id   | panitia123 | Dashboard + Scan    |
| Peserta | budi@runfest.id      | peserta123 | QR + status (RF-101) |

## Alur yang diprototipekan

1. **Daftar via Google Form** — tombol di beranda mengarah ke `GFORM_URL`
   di `scripts/data.js`. Ganti nilainya dengan link GForm asli panitia.
2. **Ambil Race Pack di sekretariat** — panitia di `scan.html` memverifikasi
   QR/BIB, lalu menekan "Ambil Race Pack" (BIB + totebag + air minum).
3. **Lomba & Finish** — panitia menandai Finish (+ waktu) atau DNF.
4. **Ambil Medali + Sertifikat** — tombol ini hanya aktif untuk finisher;
   sistem menolak jika peserta belum finish / DNF.
5. **Podium & Kostum** — juara 1–3 per kategori Dewasa & Anak-Anak
   (1 peringkat tidak bisa dobel), plus 1 Pemenang Kostum Terbaik
   (suvenir/hadiah khusus). Hasilnya tampil di `podium.html` & beranda.

## Menu di tiap kartu statistik (baru)

Keempat kartu di beranda DAN di dashboard panitia sekarang bisa diklik:

- **Total peserta** → daftar peserta resmi (via GForm)
- **Sudah ambil race pack** → daftar yang sudah ambil race pack
- **Sudah finish** → daftar finisher
- **Sudah ambil medali** → daftar yang sudah ambil medali + sertifikat

Di dashboard, kartu yang diklik otomatis mengisi filter Status & Sumber, dan
tabel di bawahnya ikut terfilter. Filter bisa diubah manual lewat dropdown
Kategori / Status / Sumber Pendaftaran / pencarian nama-BIB-email.

## GForm vs register web saja (perbaikan dari temuan kamu)

Dulu, akun yang baru register di web langsung terhitung sebagai peserta.
Sekarang dibedakan dengan field `sumber`:

| Sumber | Artinya | Dihitung peserta? | Boleh ambil race pack? |
|--------|---------|-------------------|------------------------|
| `gform` | Sudah isi Google Form panitia (semua data seed) | Ya | Ya |
| `web` | Baru register akun web, belum isi GForm | **Tidak** | **Tidak, sampai dikonfirmasi** |

- **Beranda & dashboard:** angka utama hanya menghitung `gform`. Di bawah
  angka total ada catatan "+N akun web belum isi GForm (tidak dihitung)".
- **Tabel dashboard:** ada kolom **Sumber** (badge hijau "Via GForm" / kuning
  "Web saja — belum isi GForm") dan filter Sumber Pendaftaran.
- **Halaman peserta:** akun `web` melihat banner peringatan + link GForm,
  dan langkah 1 di jejak alurnya belum centang.
- **Halaman Scan (panitia):** akun `web` menampilkan tombol
  **"Konfirmasi: Sudah Isi GForm"** — setelah diklik, sumbernya berubah jadi
  `gform`, ia resmi dihitung peserta, dan baru boleh ambil race pack.
- **Migrasi data lama:** kalau kamu sudah sempat register sebelum update ini,
  data lamamu tanpa field `sumber` akan otomatis dikenali sebagai `web`
  (karena emailnya ada di daftar akun register-web), jadi angka totalmu
  sekarang akan turun 1 dan akun itu muncul di filter "Register web saja".

## Uji cepat di halaman Scan (login panitia dulu)

- `RF-106` — belum ambil race pack → coba ambil medali dulu, sistem menolak.
- `RF-105` — sudah race pack, belum finish → tandai finish, lalu ambil medali.
- `RF-103` — sudah finish, belum medali → langsung ambil medali + sertifikat.

## Yang belum ada (sengaja, karena ini prototipe statis)

- Backend / database asli, kamera scan QR (saat ini simulasi tempel payload
  QR atau pilih peserta), dan cetak sertifikat PDF. Ketiganya bisa ditambahkan
  tanpa mengubah struktur file: ganti `scripts/data.js` dengan pemanggilan API
  dan `scripts/qrcode.js` dengan library scanner.
