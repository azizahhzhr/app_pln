"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState([]); // Data dari server
  const [clickedData, setClickedData] = useState([]); // Data yang sesuai dengan koordinat klik
  const [coorX, setCoorX] = useState(0); // Koordinat X klik
  const [coorY, setCoorY] = useState(0); // Koordinat Y klik
  const [showPopup, setShowPopup] = useState(false); // State untuk menampilkan popup

  // Fungsi untuk mengambil data dari server
  async function fetchData() {
    const res = await axios.get("/api/get");
    setData(res.data.data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi untuk menangani klik pada area dan mencari data yang cocok dengan koordinat
  const handleClick = (e) => {
    const x = e.clientX; // Koordinat X klik
    const y = e.clientY; // Koordinat Y klik

    setCoorX(x);
    setCoorY(y);

    // Cari data yang sesuai dengan koordinat
    const matchingData = data.filter(
      (item) => Math.abs(item.x - x) <= 10 && Math.abs(item.y - y) <= 10 // Toleransi 10px
    );
    setClickedData(matchingData);

    if (matchingData.length > 0) {
      setShowPopup(true);
    }
  };

  // Fungsi untuk menutup popup
  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div
      className="min-h-screen relative text-white"
      style={{
        backgroundImage: "url('background.JPG')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={handleClick}
    >
      <p className="absolute top-4 left-4 text-lg">
        Klik untuk melihat data pada area!
      </p>

      {/* Koordinat Klik */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 p-2 rounded">
        <p>X: {coorX}</p>
        <p>Y: {coorY}</p>
      </div>

      {/* Popup Data yang Sesuai */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-black p-6 rounded shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-xl font-bold"
              onClick={closePopup}
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-4">Data Ditemukan</h2>
            {clickedData.map((item, index) => (
              <div key={index} className="mb-2">
                <p>x: {item.x}</p>
                <p>y: {item.y}</p>
                <p>id: {item.id}</p>
                <p>keterangan: {item.keterangan}</p>
                <hr className="border-gray-500 mt-2" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
