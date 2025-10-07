## Deskripsi Proyek

Aplikasi ini merupakan proyek berbasis **Node.js + Express + PostgreSQL** yang dijalankan di platform **PaaS** (Platform as a Service) seperti **Railway** atau **Render**.
Fungsinya adalah:

* Menyimpan data pengguna (nama dan email),
* Mengunggah dan menampilkan foto profil,
* Menyimpan data ke **database PostgreSQL cloud**,
* Menyimpan file ke **persistent storage** (folder `uploads`).

---

## 1. Persiapan Awal

### a. Buat Folder Proyek

Buka terminal di Visual Studio Code, kemudian jalankan perintah berikut:

```bash
mkdir signup-app
cd signup-app
```

### b. Inisialisasi Proyek Node.js

```bash
npm init -y
```

### c. Tambahkan “type”: “module” di package.json

Agar bisa menggunakan `import`, buka file `package.json` dan ubah menjadi seperti berikut:

```json
{
  "name": "signup-app",
  "version": "1.0.0",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "dotenv": "^17.2.3",
    "ejs": "^3.1.10",
    "express": "^5.1.0",
    "multer": "^2.0.2",
    "pg": "^8.16.3"
  }
}
```

### d. Instalasi Dependensi

```bash
npm install express pg multer dotenv ejs
```

---

## 2. Struktur Folder Proyek

Pastikan struktur folder seperti berikut:

```
signup-app/
│
├── uploads/            # folder penyimpanan foto upload
├── server.js           # file utama aplikasi
├── .env                # konfigurasi environment variable
├── package.json
└── README.md
```

---

## 3. Konfigurasi Environment Variable

Buat file `.env` di folder utama proyek dan isi dengan URL database dari Railway. Contoh :
```
DATABASE_URL=postgresql://postgres:123456@containers.railway.app:6555/railway
```

---

## 4. Kode Aplikasi (server.js)

Gunakan kode yang telah dibuat sebelumnya.
File `server.js` berisi:

* Koneksi ke database PostgreSQL (Railway),
* Upload file menggunakan `multer`,
* Penyimpanan data ke database,
* Tampilan form input dan daftar pengguna.

---

## 5. Menjalankan Aplikasi Secara Lokal

### a. Jalankan Server

```bash
node server.js
```

Jika berhasil, akan muncul di terminal:

```
Server berjalan di port 3000
```

### b. Akses di Browser

Buka alamat berikut di browser:

```
http://localhost:3000
```

---

## 6. Database (Railway / Render)

Aplikasi secara otomatis akan membuat tabel jika belum tersedia:

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  photo VARCHAR(255)
);
```

Untuk memeriksa data di Railway:

1. Buka menu **Data** pada Railway.
2. Pilih tabel **users**.
3. Data pengguna akan tampil (nama, email, dan nama file foto).

---

## 7. Penyimpanan File (Persistent Storage)

* File foto pengguna akan disimpan otomatis di folder:

  ```
  /uploads
  ```
* Folder ini berfungsi sebagai **persistent storage** agar file tidak hilang meskipun aplikasi dijalankan ulang.

---

## 8. Deploy ke GitHub dan Railway

### a. Push Proyek ke GitHub

1. Masuk ke akun GitHub.
2. Buat repository baru (misalnya: `signup-cloud-app`).
3. Kembali ke terminal VS Code dan jalankan perintah berikut:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/serviaa/signup-app.git
git push -u origin main
```

> Ganti `username` dengan nama akun GitHub Anda.

### b. Deploy ke Railway

1. Masuk ke [https://railway.app](https://railway.app)
2. Klik **New Project** → **Deploy from GitHub Repo**
3. Pilih repository yang telah di-push ke GitHub
4. Tambahkan **Environment Variables**:

   * `DATABASE_URL` = URL database PostgreSQL dari Railway
   * `STORAGE_PATH` = uploads
   * `PORT` = 3000
5. Klik **Deploy**
6. Setelah proses selesai, klik **View Deployment** untuk membuka aplikasi di browser.

---

## 9. Pengujian Aplikasi

1. Buka halaman aplikasi di browser.
2. Isi form dengan:

   * Nama
   * Email
   * Foto profil
3. Klik tombol **Daftar**
4. Data pengguna akan langsung muncul di sisi kanan dan tersimpan ke database.

---

## 10. Tampilan Aplikasi

* Layout dua kolom:

  * Kiri: Form sign-up (tetap di tempat, tidak ikut scroll)
  * Kanan: Daftar pengguna (dapat di-scroll)
* Warna: Lembut, modern, dan profesional
* Tampilan responsif dan mudah digunakan.

---

## 11. Kesimpulan

Aplikasi ini menunjukkan implementasi:

* Koneksi **Node.js** ke **PostgreSQL Cloud** (Railway),
* Penggunaan **Environment Variable** untuk keamanan konfigurasi,
* Penyimpanan file di **Persistent Storage**,
* Proses **Deploy aplikasi berbasis Cloud** menggunakan platform **PaaS (Railway)**.

---

**Catatan:**
Proyek ini dibuat oleh **Nisa Nur Aini (NIS: 21188)** sebagai tugas **PTS** dengan tujuan memahami implementasi aplikasi berbasis cloud menggunakan layanan Platform as a Service (PaaS).