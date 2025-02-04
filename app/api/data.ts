import { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";

// Buat koneksi ke database
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password", // Ganti dengan password MySQL Anda
  database: "your_database", // Ganti dengan nama database Anda
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const [rows] = await db.query("SELECT * FROM coordinates");
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ message: "Gagal mengambil data", error });
    }
  } else if (req.method === "POST") {
    const { x1, y1, x2, y2, id, ket } = req.body;
    try {
      await db.query(
        "INSERT INTO coordinates (id, x1, y1, x2, y2, ket) VALUES (?, ?, ?, ?, ?, ?)",
        [id, x1, y1, x2, y2, ket]
      );
      res.status(201).json({ message: "Data berhasil disimpan" });
    } catch (error) {
      res.status(500).json({ message: "Gagal menyimpan data", error });
    }
  } else if (req.method === "PUT") {
    const { x1, y1, x2, y2, id, ket } = req.body;
    try {
      await db.query(
        "UPDATE coordinates SET x1 = ?, y1 = ?, x2 = ?, y2 = ?, ket = ? WHERE id = ?",
        [x1, y1, x2, y2, ket, id]
      );
      res.status(200).json({ message: "Data berhasil diperbarui" });
    } catch (error) {
      res.status(500).json({ message: "Gagal memperbarui data", error });
    }
  } else {
    res.status(405).json({ message: "Metode tidak diizinkan" });
  }
}
