"use client";

import useMouse from "@react-hook/mouse-position";
import Modal from "react-modal";
import { FormEvent, useRef, useState, useEffect } from "react";
import axios from "axios";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export default function Home() {
  const [coorX1, setCoorX1] = useState<number | null>(null);
  const [coorY1, setCoorY1] = useState<number | null>(null);
  const [coorX2, setCoorX2] = useState<number | null>(null);
  const [coorY2, setCoorY2] = useState<number | null>(null);
  const [modal, setModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const [id, setId] = useState("");
  const [ket, setKet] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [savedData, setSavedData] = useState<
    {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      id: string;
      keterangan: string; // Pastikan ini sesuai dengan field di database
    }[]
  >([]);

  const ref = useRef(null);
  const mouse = useMouse(ref, {
    enterDelay: 100,
    leaveDelay: 100,
  });

  // Fetch data from database when component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/get");
        setSavedData(response.data.data); // Set saved data
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
    setCoorX1(null);
    setCoorY1(null);
    setCoorX2(null);
    setCoorY2(null);
    setId("");
    setKet("");
    setIsUpdate(false);
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

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!ket.trim()) {
      alert("Keterangan tidak boleh kosong!");
      return;
    }

    if (
      coorX1 !== null &&
      coorY1 !== null &&
      coorX2 !== null &&
      coorY2 !== null
    ) {
      try {
        const payload = {
          x1: coorX1,
          y1: coorY1,
          x2: coorX2,
          y2: coorY2,
          id,
          keterangan: ket, // Pastikan ini sesuai dengan field di database
        };

        if (isUpdate) {
          await axios.put(`/api/update/${id}`, payload, {
            headers: {
              "Content-Type": "application/json",
            },
          });

          setSavedData((prevData) =>
            prevData.map((data) =>
              data.id === id
                ? {
                    ...data,
                    id,
                    keterangan: ket, // Pastikan ini sesuai dengan field di database
                    x1: coorX1,
                    y1: coorY1,
                    x2: coorX2,
                    y2: coorY2,
                  }
                : data
            )
          );

          setSuccessMessage("Update data berhasil!");
        } else {
          await axios.post("/api/tambah", payload, {
            headers: {
              "Content-Type": "application/json",
            },
          });

          setSavedData((prevData) => [...prevData, payload]);
          setSuccessMessage("Data berhasil disimpan!");
        }

        closeModal();
      } catch (e) {
        console.error(e);
      }
    } else {
      alert("Titik tidak lengkap!");
    }
  }

  function handleCanvasClick() {
    const x = mouse.x || 0;
    const y = mouse.y || 0;

    const existing = findExistingRectangle(x, y);
    if (existing) {
      setCoorX1(existing.x1);
      setCoorY1(existing.y1);
      setCoorX2(existing.x2);
      setCoorY2(existing.y2);
      setId(existing.id);
      setKet(existing.keterangan); // Pastikan ini sesuai dengan field di database
      setIsUpdate(true);
      openModal();
    } else if (coorX1 === null || coorY1 === null) {
      setCoorX1(x);
      setCoorY1(y);
    } else if (coorX2 === null || coorY2 === null) {
      setCoorX2(x);
      setCoorY2(y);
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
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <form
          className="flex flex-col text-black bg-white"
          onSubmit={handleSubmit}
        >
          <button
            type="button"
            onClick={closeModal}
            className="text-black ml-auto"
          >
            x
          </button>

          <p className="text-center">
            X1: {coorX1} | Y1: {coorY1}
          </p>
          <p className="text-center">
            X2: {coorX2} | Y2: {coorY2}
          </p>

          <label htmlFor="id">ID</label>
          <input
            type="text"
            className="border"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />

          <label htmlFor="ket">Keterangan</label>
          <textarea
            className="border h-20"
            value={ket}
            onChange={(e) => setKet(e.target.value)}
            required
          />

          <button type="submit" className="bg-blue-500 mt-4 rounded">
            {isUpdate ? "Update Data" : "Simpan Data"}
          </button>
        </form>
      </Modal>

      <div className="text-black h-screen">
        <p>
          X1: {coorX1 ?? "Belum"} | Y1: {coorY1 ?? "Belum"}
        </p>
        <p>
          X2: {coorX2 ?? "Belum"} | Y2: {coorY2 ?? "Belum"}
        </p>
        {successMessage && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded shadow-lg">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}
