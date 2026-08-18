# Nadia Kayla Dhinita — Portfolio

Static site (HTML/CSS/JS, no build step). Design: coral/pink + navy,
card-based, matches the reference UI provided.

Files:
- `index.html`
- `styles.css`
- `script.js` (skills filter, active-nav-on-scroll, reveal animation)
- `vercel.json` (optional, cleans up URLs)
- `images/` — profile photo, achievement/organization photos, project screenshots
- `certificates/` — certificate images
- `assets/` — put your CV PDF here

This site loads two external resources at runtime (from the visitor's
browser, not from your computer) — normal and free:
- Google Fonts (Poppins + Inter)
- Devicon (tech-stack icons) via cdnjs

## Deploy ke Vercel (gratis) — tanpa GitHub

1. Buka https://vercel.com → sign up / login (bisa pakai email).
2. Di dashboard, klik **Add New → Project**.
3. Pilih tab **"Deploy without Git"** (atau drag-and-drop) lalu seret folder ini
   (semua file & folder: `index.html`, `styles.css`, `script.js`, `images/`,
   `certificates/`, `assets/`, `vercel.json`).
4. Framework preset pilih **"Other"** — tidak perlu build command, tidak perlu
   output directory (biarkan kosong / root).
5. Klik **Deploy**. Selesai dalam ~30 detik, dapat URL gratis seperti
   `nama-kamu.vercel.app`.

## Deploy via GitHub (kalau mau auto-update tiap push)

1. Push folder ini ke repo GitHub baru.
2. Di Vercel: **Add New → Project → Import Git Repository** → pilih repo itu.
3. Framework preset: **Other**. Build command & output directory: kosongkan.
4. Deploy.

## Alternatif gratis lain

- **Netlify** — drag-and-drop folder ke https://app.netlify.com/drop, langsung live.
- **GitHub Pages** — push ke repo, aktifkan Pages di Settings → Pages, pilih branch `main` / folder root.
- **Cloudflare Pages** — sama seperti Vercel, connect repo atau upload langsung.

## Ganti foto, sertifikat & CV (penting!)

Semua gambar masih placeholder abu-abu/pink. Timpa file dengan nama yang
sama persis (boleh ganti ekstensi asal update juga path-nya di `index.html`):

**Folder `images/`**
- `profile.jpg` — foto profil (dipakai di hero, rasio ~4:4.6, potrait)
- `achievement-innopa.jpg` — foto pas terima Silver Medal INNOPA 2025 (dipakai untuk link sertifikat)
- `org-oase.jpg`, `org-pkpr.jpg` — foto kegiatan organisasi (belum dipakai di halaman saat ini, siap kalau mau ditambahkan lagi)
- `project-dormi.jpg`, `project-filmly.jpg`, `project-attendance.jpg` — screenshot masing-masing project (rasio 16:10.5)

**Folder `certificates/`**
- `cert-celerates.jpg`, `cert-cisco.jpg`, `cert-ibm-granite.jpg`, `cert-codeorg.jpg`

Kalau sertifikat aslinya PDF, screenshot/convert halaman pertamanya jadi jpg
dengan nama yang sama, atau simpan PDF-nya lalu ganti `href="certificates/cert-xxx.jpg"`
di `index.html` jadi `href="certificates/cert-xxx.pdf"`.

**Folder `assets/`**
- Simpan CV PDF kamu sebagai `CV-Nadia-Kayla-Dhinita.pdf` — tombol "Download CV" di nav sudah mengarah ke sini.

## Link yang masih perlu kamu isi

- Tombol **GitHub** di 3 project card (Dormi, Filmly, Attendance System)
  masih `href="#"` — ganti dengan link repo asli kamu di `index.html`
  (cari `class="pl-link muted"`).
- Tombol **Live Demo** di 3 project card juga masih `href="#"` — isi kalau
  ada link live-nya.

## Update konten teks

Semua teks ada langsung di `index.html`, tinggal edit manual: experience di
`#experience`, project di `#projects`, skill di `#skills`.
