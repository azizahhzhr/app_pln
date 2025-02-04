"use client";

import useMouse from "@react-hook/mouse-position";
import Modal from "react-modal";
import { useRef, useState, useEffect } from "react";
import axios from "axios";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#f0f0f0",
  },
};

export default function TampilData() {
  const [modal, setModal] = useState(false);
  const [selectedData, setSelectedData] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    id: string;
    keterangan: string;
  } | null>(null);

  const [savedData, setSavedData] = useState<
    {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      id: string;
      keterangan: string;
    }[]
  >([]);

  const ref = useRef(null);
  const mouse = useMouse(ref, {
    enterDelay: 100,
    leaveDelay: 100,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/get");
        setSavedData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  function openModal() {
    setModal(true);
  }

  function closeModal() {
    setModal(false);
    setSelectedData(null);
  }

  function isWithinRectangle(
    x: number,
    y: number,
    rect: { x1: number; y1: number; x2: number; y2: number }
  ) {
    const minX = Math.min(rect.x1, rect.x2);
    const maxX = Math.max(rect.x1, rect.x2);
    const minY = Math.min(rect.y1, rect.y2);
    const maxY = Math.max(rect.y1, rect.y2);
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  }

  function findExistingRectangle(x: number, y: number) {
    return savedData.find((data) => isWithinRectangle(x, y, data));
  }

  function handleCanvasClick() {
    const x = mouse.x || 0;
    const y = mouse.y || 0;

    const existing = findExistingRectangle(x, y);
    if (existing) {
      setSelectedData(existing);
      openModal();
    }
  }

  return (
    <div
      ref={ref}
      className="min-h-screen text-black"
      style={{
        backgroundImage: "url('/background.JPG')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
      onClick={handleCanvasClick}
    >
      <Modal
        isOpen={modal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Data Modal"
        ariaHideApp={false}
      >
        <div className="flex flex-col text-black bg-white p-4 rounded-lg">
          <button
            type="button"
            onClick={closeModal}
            className="text-black ml-auto"
          >
            x
          </button>

          {/* Judul dengan Kotak Pink */}
          <div className="bg-green-500 text-white text-center font-bold py-2 px-4 rounded mb-4">
            DATA DITEMUKAN
          </div>

          {selectedData && (
            <div className="space-y-4">
              {/* Titik Koordinat dalam Satu Baris dan Ditenagahkan */}
              <div className="flex justify-center space-x-4">
                <p>
                  <strong>X1 =</strong> {selectedData.x1}
                </p>
                <p>
                  <strong>Y1 =</strong> {selectedData.y1}
                </p>
              </div>
              <div className="flex justify-center space-x-4">
                <p>
                  <strong>X2 =</strong> {selectedData.x2}
                </p>
                <p>
                  <strong>Y2 =</strong> {selectedData.y2}
                </p>
              </div>

              {/* Kotak ID */}
              <div className="bg-gray-200 p-3 rounded">
                <p>
                  <strong>ID:</strong> {selectedData.id}
                </p>
              </div>

              {/* Kotak Keterangan */}
              <div className="bg-gray-200 p-3 rounded">
                <p>
                  <strong>Keterangan:</strong> {selectedData.keterangan}
                </p>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
