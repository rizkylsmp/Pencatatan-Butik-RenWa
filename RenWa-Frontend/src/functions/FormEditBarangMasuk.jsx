import React, { useState, useEffect } from "react";
import axios from "axios";

const FormEditBarangMasuk = ({ show, onClose, onSave, data }) => {
  const [formData, setFormData] = useState({
    kodeBarang: "",
    tanggal: "",
    barang: "",
    jumlah: "",
    dari: "",
    gambar: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (show && data) {
      setFormData({
        kodeBarang: data.kodeBarang,
        tanggal: data.tanggal,
        barang: data.barang,
        jumlah: data.jumlah,
        dari: data.dari,
        gambar: data.gambar,
      });
    }
  }, [show, data]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/users`,
          {
            params: { role: "karyawan" },
          }
        );
        setUsers(response.data.filter((user) => user.role === "karyawan"));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("kodeBarang", formData.kodeBarang);
    formDataToSend.append("tanggal", formData.tanggal);
    formDataToSend.append("barang", formData.barang);
    formDataToSend.append("jumlah", formData.jumlah);
    formDataToSend.append("dari", formData.dari);
    if (formData.gambar) {
      formDataToSend.append("gambar", formData.gambar);
    }

    try {
      await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/barang-masuk/${data.uuid}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      onSave(formData);
      onClose();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        window.alert(error.response.data.msg);
      } else {
        window.alert("Terjadi kesalahan saat mengubah data.");
      }
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center text-color-1 text-nowrap">
      {/* LOADING */}
      {isLoading && (
        <div className="fixed inset-0 bg-color-1 bg-opacity-50 flex justify-center items-center z-50 text-color-1">
          <div className="p-4 rounded-md">
            <span className="loading loading-dots loading-lg text-color-3"></span>
          </div>
        </div>
      )}

      <div className="bg-color-3 p-5 rounded shadow-lg w-4/5 max-h-[80vh] overflow-y-auto">
        <h2 className="font-bold text-xl mb-4">Edit Data Barang Masuk</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1" htmlFor="kodeBarang">
              Kode Barang
            </label>
            <input
              type="text"
              id="kodeBarang"
              name="kodeBarang"
              value={formData.kodeBarang}
              onChange={(e) =>
                setFormData({ ...formData, kodeBarang: e.target.value })
              }
              className="w-full px-2 py-1 border border-color-4 rounded"
            />
          </div>
          <div>
            <label className="block mb-1" htmlFor="tanggal">
              Tanggal
            </label>
            <input
              type="date"
              id="tanggal"
              name="tanggal"
              value={formData.tanggal}
              onChange={(e) =>
                setFormData({ ...formData, tanggal: e.target.value })
              }
              className="w-full px-2 py-1 border border-color-4 rounded"
            />
          </div>
          <div>
            <label className="block mb-1" htmlFor="barang">
              Nama Barang
            </label>
            <input
              type="text"
              id="barang"
              name="barang"
              value={formData.barang}
              onChange={(e) =>
                setFormData({ ...formData, barang: e.target.value })
              }
              className="w-full px-2 py-1 border border-color-4 rounded"
            />
          </div>
          <div>
            <label className="block mb-1" htmlFor="jumlah">
              Jumlah
            </label>
            <input
              type="number"
              id="jumlah"
              name="jumlah"
              value={formData.jumlah}
              onChange={(e) =>
                setFormData({ ...formData, jumlah: e.target.value })
              }
              className="w-full px-2 py-1 border border-color-4 rounded"
            />
          </div>
          <div>
            <label className="block mb-1" htmlFor="dari">
              Dari
            </label>
            <select
              id="dari"
              name="dari"
              value={formData.dari}
              onChange={(e) =>
                setFormData({ ...formData, dari: e.target.value })
              }
              className="w-full px-2 py-1 border border-color-4 rounded"
            >
              <option value="" disabled>
                Pilih pengirim
              </option>
              <option value="supplier">Supplier</option>
              {users.map((user) => (
                <option key={user.id} value={user.username}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1" htmlFor="gambar">
              Gambar Barang
            </label>
            <input
              type="file"
              id="gambar"
              name="gambar"
              accept="image/*"
              onChange={(e) =>
                setFormData({ ...formData, gambar: e.target.files[0] })
              }
              className="w-full px-2 py-1 border border-color-4 rounded"
            />
          </div>

          {/* BUTTON */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-color-5 hover:scale-105 py-2 px-4 rounded text-color-3 mr-2"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-color-2 hover:scale-105 py-2 px-4 rounded text-color-3"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormEditBarangMasuk;
