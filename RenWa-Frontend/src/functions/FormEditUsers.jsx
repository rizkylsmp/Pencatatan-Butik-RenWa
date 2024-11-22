import React, { useState, useEffect } from "react";
import axios from "axios";

const FormEditUser = ({ show, onClose, onSave, data }) => {
  const [formData, setFormData] = useState({
    username: "",
    nama: "",
    jenisKelamin: "",
    password: "",
    confPassword: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show && data) {
      setFormData({
        username: data.username,
        nama: data.nama,
        jenisKelamin: data.jenisKelamin,
        password: "",
        confPassword: "",
        role: data.role,
      });
    }
  }, [show, data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/users/${data.uuid}`,
        {
          username: formData.username,
          nama: formData.nama,
          jenisKelamin: formData.jenisKelamin,
          password: formData.password,
          confPassword: formData.confPassword,
          role: formData.role,
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
        <h2 className="font-bold text-xl mb-4">Edit Data User</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1" htmlFor="username">
              Username
            </label>
            <input
              disabled
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-2 py-1 border border-color-4 rounded"
            />
          </div>
          <div>
            <label className="block mb-1" htmlFor="nama">
              Nama
            </label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={(e) =>
                setFormData({ ...formData, nama: e.target.value })
              }
              className="w-full px-2 py-1 border border-color-4 rounded"
            />
          </div>
          <div>
            <label className="block mb-1" htmlFor="jenisKelamin">
              Jenis Kelamin
            </label>
            <select
              id="jenisKelamin"
              name="jenisKelamin"
              value={formData.jenisKelamin}
              onChange={(e) =>
                setFormData({ ...formData, jenisKelamin: e.target.value })
              }
              className="w-full px-2 py-1 border border-color-4 rounded"
            >
              <option value="" disabled>
                Pilih jenis kelamin
              </option>
              <option value="Pria">Pria</option>
              <option value="Wanita">Wanita</option>
            </select>
          </div>
          <div>
            <label className="block mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Kosongkan jika tidak ingin mengubah password"
              className="w-full px-2 py-1 border border-color-4 rounded"
            />
          </div>
          <div>
            <label className="block mb-1" htmlFor="confPassword">
              Konfirmasi Password
            </label>
            <input
              type="password"
              id="confPassword"
              name="confPassword"
              value={formData.confPassword}
              onChange={(e) =>
                setFormData({ ...formData, confPassword: e.target.value })
              }
              placeholder="Kosongkan jika tidak ingin mengubah password"
              className="w-full px-2 py-1 border border-color-4 rounded"
            />
          </div>
          <div>
            <label className="block mb-1" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-2 py-1 border border-color-4 rounded"
            >
              <option value="" disabled>
                Pilih role
              </option>
              <option value="admin">admin</option>
              <option value="karyawan">karyawan</option>
            </select>
          </div>

          {/* BUTTON */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-color-5 hover:scale-105 py-2 px-4 rounded text-color-3"
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

export default FormEditUser;
