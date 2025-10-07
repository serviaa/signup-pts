import express from "express";
import multer from "multer";
import pkg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const { Pool } = pkg;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, process.env.STORAGE_PATH || path.join(__dirname, "uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    photo VARCHAR(255)
  )
`);

app.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM users ORDER BY id DESC");
  const users = result.rows;

  const html = `
  <html>
  <head>
    <title>Sign Up Page</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Poppins', sans-serif;
        background: linear-gradient(135deg, #f7f7f7, #f1ede9);
        height: 100vh;
        display: flex;
        color: #2f2f2f;
        overflow: hidden;
      }

      .container {
        display: flex;
        width: 100%;
        height: 100vh;
      }

      /* 🪶 Kiri: Form */
      .form-section {
        width: 35%;
        background: #ffffff;
        box-shadow: 4px 0 10px rgba(0, 0, 0, 0.05);
        padding: 50px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        z-index: 10;
        animation: slideIn 0.7s ease;
      }

      @keyframes slideIn {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
      }

      h2 {
        text-align: center;
        margin-bottom: 25px;
        color: #6e5e8e;
        font-weight: 600;
        font-size: 24px;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      input {
        padding: 12px;
        border-radius: 10px;
        border: 1px solid #d9d4cf;
        background-color: #fafafa;
        font-size: 14px;
        transition: 0.3s ease;
      }

      input:focus {
        outline: none;
        border-color: #a596c9;
        box-shadow: 0 0 4px rgba(165, 150, 201, 0.4);
      }

      button {
        background: linear-gradient(135deg, #a596c9, #d7c9b5);
        color: white;
        border: none;
        padding: 12px;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 500;
        font-size: 15px;
        transition: 0.3s ease;
      }

      button:hover {
        transform: scale(1.03);
        box-shadow: 0 4px 10px rgba(165, 150, 201, 0.3);
      }

      /* 🪞 Kanan: daftar pengguna */
      .users-section {
        margin-left: 35%;
        width: 65%;
        padding: 40px 50px;
        overflow-y: auto;
        height: 100vh;
      }

      .users-section h2 {
        font-size: 22px;
        color: #6e5e8e;
        margin-bottom: 25px;
        text-align: center;
        font-weight: 600;
      }

      .user-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
        gap: 25px;
      }

      .card {
        background: #ffffff;
        border-radius: 16px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
        padding: 20px;
        text-align: center;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        opacity: 0;
        animation: fadeIn 0.8s forwards;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .card:hover {
        transform: translateY(-6px);
        box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
      }

      img {
        border-radius: 50%;
        margin-top: 10px;
        width: 100px;
        height: 100px;
        object-fit: cover;
        border: 3px solid #cfc7df;
        transition: transform 0.3s;
      }

      img:hover {
        transform: scale(1.05);
      }

      h4 {
        margin-top: 12px;
        font-size: 16px;
        color: #403b3b;
        font-weight: 600;
      }

      p {
        font-size: 14px;
        color: #7a7474;
      }

      /* scrollbar halus */
      .users-section::-webkit-scrollbar {
        width: 8px;
      }
      .users-section::-webkit-scrollbar-thumb {
        background-color: #bdb3d0;
        border-radius: 5px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Kiri -->
      <div class="form-section">
        <h2>Form Sign Up</h2>
        <form action="/submit" method="post" enctype="multipart/form-data">
          <input type="text" name="name" placeholder="Nama Lengkap" required>
          <input type="email" name="email" placeholder="Email" required>
          <input type="file" name="photo" accept="image/*" required>
          <button type="submit">Daftar</button>
        </form>
      </div>

      <!-- Kanan -->
      <div class="users-section">
        <h2>Daftar Pengguna</h2>
        <div class="user-grid">
          ${users
            .map(
              (u) => `
              <div class="card">
                <img src="/uploads/${u.photo}" alt="${u.name}">
                <h4>${u.name}</h4>
                <p>${u.email}</p>
              </div>
            `
            )
            .join("")}
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
  res.send(html);
});

app.post("/submit", upload.single("photo"), async (req, res) => {
  const { name, email } = req.body;
  const photo = req.file.filename;

  await pool.query(
    "INSERT INTO users (name, email, photo) VALUES ($1, $2, $3)",
    [name, email, photo]
  );

  res.redirect("/");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server berjalan di port ${PORT}`));
