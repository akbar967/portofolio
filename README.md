# Portfolio Web Akbar Barokah ✨

Website portfolio modern & interaktif dengan kartu identitas **3D Lanyard Card** yang responsif dan dapat digerakkan secara interaktif, terinspirasi dari video TikTok showcase.

---

## 👨‍💻 Profil Singkat
- **Nama**: Akbar Barokah
- **Institusi / Kampus**: Politeknik IDN Bogor
- **Email**: b4r0k4h2007@gmail.com
- **WhatsApp / No HP**: +62 895-7110-61800
- **Bidang**: Software Engineering & Web Development
- **Tech Stack & Tools**:
  - **Frontend**: HTML5, CSS3, Tailwind CSS, JavaScript
  - **Backend**: PHP, Laravel, Livewire
  - **Database**: MySQL
  - **Tools & Environment**: GitHub, VS Code, Laravel Herd, FlyEnv, Antigravity

---

## 🚀 Fitur Unggulan

1. **Interactive 3D Lanyard & ID Card**:
   - Kartu identitas 3D dengan tali lanyard berbahan kain realistis berbasis **Three.js** dan simulasi fisika pegas (*Verlet physics*).
   - Tali bertuliskan `AKBAR BAROKAH • PORTFOLIO • 3D CARD` yang fleksibel.
   - Kartu memuat foto resmi jas almamater Politeknik IDN Bogor (`assets/images/foto-profil.jpg`).
   - Dapat di-drag, diayunkan, dan bergoyang mengikuti kursor mouse dan sentuhan layar ponsel.
   - Efek kemilau holografis dan pencahayaan dinamis mengikuti gerakan kursor.

2. **Desain Modern Cyber-Glassmorphism**:
   - Skema warna gelap futuristik (`#050816`) dengan aksen neon ungu (`#6C63FF`) dan cyan (`#00E5FF`).
   - Kartu efek kaca blur (*glassmorphism*), garis gradasi pembatas, dan latar belakang grid ambient.
   - Indikator progres scroll halaman di bagian atas layar.

3. **Struktur Bagian Lengkap**:
   - **Hero**: Sambutan, nama **Akbar Barokah**, status mahasiswa Politeknik IDN Bogor, ringkasan bio, tombol Download CV, GitHub, LinkedIn, dan Hubungi Saya.
   - **About Me**: Latar belakang pendidikan di Politeknik IDN Bogor, riwayat pelatihan SantriKoding, dan kartu minat.
   - **Skills & Tech Stack**: Tampilan simpel & modern untuk 13 keahlian: HTML, CSS, Tailwind CSS, JavaScript, PHP, Laravel, Livewire, MySQL, GitHub, VS Code, Laravel Herd, FlyEnv, dan Antigravity.
   - **Featured Projects**: Showcase 3 proyek nyata dengan gambar:
     1. **Kopi & Roti Kenangan** (Landing & pemesanan UMKM kuliner)
     2. **KaryaNusantara** (Etalase e-commerce produk UMKM Halal & BPOM)
     3. **E-Report** (Ruang aspirasi & pengaduan lingkungan warga)
   - **Journey Timeline**: Linimasa vertikal interaktif dengan node bercahaya untuk perjalanan akademik dan sertifikasi.
   - **Certificates**: Galeri sertifikat resmi SantriKoding dengan modal lightbox preview saat diklik:
     1. FullStack Developer Dengan Rust dan Vue (`SK-7SKBPRIYA6EZAGW`)
     2. FullStack JavaScript Developer Dengan Bun, Hono dan React TypeScript (`SK-CTIVS8WCIO9HSPI`)
     3. FullStack JavaScript Developer Dengan Bun, Hono dan VueTypeScript (`SK-BNB6XTLCAT07X0H`)
   - **Contact Me**: Informasi kontak langsung (Email, WhatsApp, Lokasi, Sosial Media) serta formulir pesan interaktif.

---

## 📁 Struktur Folder

```text
portofolio/
├── index.html                   # Halaman utama portfolio
├── README.md                    # Dokumentasi ini
├── css/
│   ├── style.css                # Style utama (Tailwind CSS terkompilasi)
│   └── custom.css               # Penyesuaian efek visual, animasi, dan modal
├── js/
│   ├── lanyard.js               # Logika 3D Lanyard physics & canvas Three.js
│   └── main.js                  # Interaktivitas navigasi, filter proyek, modal & form
└── assets/
    ├── cv/
    │   └── CV-Akbar-Barokah.pdf # File CV / Resume Anda
    └── images/                  # Aset gambar asli
        ├── foto-profil.jpg      # Foto profil jas almamater Politeknik IDN
        ├── project-1.jpg        # Screenshot Kopi & Roti Kenangan
        ├── project-2.jpg        # Screenshot KaryaNusantara
        ├── project-3.jpg        # Screenshot E-Report
        ├── cert-1.jpg           # Sertifikat Rust & Vue
        ├── cert-2.jpg           # Sertifikat Bun, Hono & React TS
        └── cert-3.jpg           # Sertifikat Bun, Hono & Vue TS
```

---

## 💻 Cara Menjalankan Website

1. Klik dua kali pada file `index.html` untuk langsung membukanya di browser apa pun (Google Chrome, Edge, Firefox, Safari).
2. Atau jika menggunakan **VS Code**, klik kanan pada `index.html` dan pilih **Open with Live Server**.

---

## 🌐 Cara Publikasi / Deploy Online (Gratis)

1. **Vercel**:
   - Upload folder ini ke repository GitHub Anda.
   - Buka [vercel.com](https://vercel.com), login dengan GitHub, pilih repository, dan klik **Deploy**.
2. **GitHub Pages**:
   - Buka Settings di repository GitHub Anda -> **Pages** -> pilih branch `main` -> Save.
3. **Netlify**:
   - Drag and drop folder portfolio langsung ke dashboard [netlify.com/drop](https://app.netlify.com/drop).
