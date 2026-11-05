# RunFest v2 — Multi-Event, Daftar Langsung, Bayar, dan Role Terpisah

Prototipe statis HTML + CSS + JavaScript, modular, data di `localStorage`
dengan key `RF2_*` (tidak bentrok dengan v1). **Pembayaran adalah simulasi
prototipe, bukan gateway asli — tidak ada uang asli yang bergerak.**

## Jalankan

```bash
cd runfest-v2
python3 -m http.server 8000
# buka http://localhost:8000
```

Pakai server lokal, jangan double-click file, supaya `localStorage` dan
halaman-halaman sinkron.

## Struktur

```
index.html                 Beranda multi-event + kategori & harga + podium
login.html                 Login semua role
register.html              Buat akun peserta saja (belum daftar lomba)
daftar.html                Pendaftaran langsung: event → kategori → invoice
pages/
  dashboard.html           Dashboard Admin (per event, pendapatan, filter)
  events.html              Kelola Event & Kategori (admin saja)
  pendaftaran.html         Meja Pendaftaran: bayar + daftar ulang
  racepack.html            Meja Race Pack: BIB + totebag + air minum
  medali.html              Meja Medali/Sertifikat + kostum manual (+ souvenir)
  lomba.html               Admin: Start per event + Finish/DNF + juara otomatis
  peserta.html             Dashboard peserta multi-event + bayar + QR
  podium.html              Podium per event, per kategori
styles/                    style.css, home.css, dashboard.css, auth.css
scripts/
  data.js                  Event, kategori, peserta, start, juara otomatis, QR payload
  auth.js                  User statis + role + guard halaman
  qrcode.js                Render QR (CDN + fallback)
  script.js, daftar.js, peserta.js, podium.js
  dashboard.js, events-admin.js, pendaftaran.js, racepack.js, medali.js, lomba.js
```

## Akun demo

| Role | Email | Password | Halaman utama |
|------|-------|----------|---------------|
| Admin | admin@runfest.id | admin123 | Dashboard, Kelola Event, Lomba |
| Admin (alias lama) | panitia@runfest.id | panitia123 | sama seperti admin |
| Pendaftaran | daftar@runfest.id | daftar123 | Pendaftaran |
| Race Pack | racepack@runfest.id | racepack123 | Race Pack |
| Medali | medali@runfest.id | medali123 | Medali |
| Peserta | budi@runfest.id | peserta123 | Dashboard peserta (RF-101, 2026) |

Halaman yang bukan rolemu akan mengarahkanmu kembali ke halaman rolemu.

## Alur v2 (tanpa GForm)

1. **Daftar di web** (`daftar.html`): pilih event → kategori (harga tampil
   otomatis) → isi data → dapat BIB + invoice, status `Belum bayar`.
2. **Bayar di web** (simulasi): peserta di dashboardnya pilih metode
   (QRIS / VA BCA / GoPay / OVO / Transfer Bank) lalu
   “Simulasikan Pembayaran Berhasil”, atau petugas Pendaftaran menekan
   “Konfirmasi Lunas”. Hanya yang `lunas` yang dihitung peserta resmi.
3. **Daftar ulang**: meja Pendaftaran menandai peserta lunas yang datang.
4. **Race Pack**: meja Race Pack hanya melayani yang lunas + sudah daftar
   ulang. Isi: BIB + totebag + air minum.
5. **Start & Finish**: admin di halaman Lomba menekan Start **per event**
   (satu tombol per event). Waktu finish = elapsed sejak Start event itu.
6. **Medali + sertifikat**: meja Medali hanya untuk finisher. Pemenang
   kostum mendapat souvenir.
7. **Juara otomatis**: setiap finish/DNF menghitung ulang Juara 1–3
   **per event + per kategori** dari waktu tercepat (seri diputus BIB
   terkecil). Kostum tetap manual.

## Multi-event & kategori

- Seed: RunFest 2026 (selesai, peserta lama), RunFest 2027 (aktif,
  kategori 5K/10K/HM/FM/Anak 3K), RunFest 2028 (draft, kategori template).
- Admin di `events.html` bisa buat event baru (misal RunFest 2029),
  mengubah status event, menambah/menghapus kategori, dan mengubah harga
  kategori. Harga yang diubah hanya berlaku untuk pendaftar baru —
  harga peserta lama tersimpan di pendaftarannya sendiri.
- Karena juara kini per kategori (bukan per label Dewasa/Anak),
  anomali v1 selesai: Sari 5K (29:18) jadi Juara 1 kategori 5K,
  tidak lagi menggeser podium 10K.

## Uji cepat (RunFest 2027)

1. Login sebagai peserta baru: daftar lewat `daftar.html` → event 2027 →
   kategori HM → cek invoice & tagihan Rp375.000, status Belum bayar.
2. Di dashboard peserta, pilih QRIS → Simulasikan Pembayaran → status Lunas.
3. Login sebagai `daftar@runfest.id` → cari BIB baru → Tandai Daftar Ulang.
4. Login sebagai `racepack@runfest.id` → cari BIB baru → Serahkan Race Pack.
5. Login sebagai `admin@runfest.id` → halaman Lomba → pilih 2027 →
   Start → cari BIB baru → Tandai Finish (waktu elapsed, misal 0:12).
6. Login sebagai `medali@runfest.id` → cari BIB baru →
   Serahkan Medali + Sertifikat.
7. Cek Podium 2027: peserta tadi masuk juara kategorinya jika termasuk
   3 tercepat di kategorinya.

## Yang belum ada (sengaja, prototipe statis)

- Backend / database asli, gateway pembayaran asli (Midtrans/Xendit),
  kamera scan QR (meja kerja memakai tempel payload QR / pilih BIB /
  ketik nama), dan cetak sertifikat PDF. Semua bisa ditambahkan tanpa
  mengubah struktur file: ganti `scripts/data.js` dengan pemanggilan API
  dan `scripts/qrcode.js` dengan library scanner.
