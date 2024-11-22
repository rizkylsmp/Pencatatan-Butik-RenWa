import React, { useState, useEffect } from "react";
import axios from "axios";

const FormAddPenjualan = ({ show, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    noTransaksi: "",
    tanggal: "",
    selectedItemsString: "",
    total: 0,
    newItemNama: "",
    newItemHarga: "",
  });
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e, itemIndex) => {
    const updatedItems = [...items];
    updatedItems[itemIndex].selected = e.target.checked;
    setItems(updatedItems);
    updateSelectedItemsString(updatedItems);
  };

  const handleJumlahChange = (e, itemIndex) => {
    const updatedItems = [...items];
    updatedItems[itemIndex].jumlah = Number(e.target.value);
    setItems(updatedItems);
    updateSelectedItemsString(updatedItems);
  };

  const handleDeleteItem = (itemIndex) => {
    const updatedItems = [...items];
    updatedItems.splice(itemIndex, 1);
    setItems(updatedItems);
    updateSelectedItemsString(updatedItems);
  };

  const handleAddNewItem = () => {
    const { newItemNama, newItemHarga } = formData;
    if (newItemNama.trim() === "" || newItemHarga.trim() === "") {
      window.alert("Nama dan harga barang baru tidak boleh kosong.");
      return;
    }
    const newItem = {
      nama: newItemNama,
      harga: Number(newItemHarga),
      jumlah: 1,
      selected: true,
    };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    setFormData({ ...formData, newItemNama: "", newItemHarga: "" });
    updateSelectedItemsString(updatedItems);
  };

  const updateSelectedItemsString = (updatedItems) => {
    const selectedItemsString = updatedItems
      .filter((item) => item.selected)
      .map((item) => `${item.nama} (${item.jumlah}x Rp ${item.harga})`)
      .join(", ");
    setFormData({ ...formData, selectedItemsString });
  };

  const calculateTotal = () => {
    let total = 0;
    items.forEach((item) => {
      if (item.selected) {
        total += item.jumlah * item.harga;
      }
    });
    return total;
  };

  useEffect(() => {
    if (show) {
      setFormData({
        noTransaksi: "",
        tanggal: "",
        selectedItemsString: "",
        total: 0,
        newItemNama: "",
        newItemHarga: "",
      });
      setItems([]);
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/penjualan`, {
        noTransaksi: formData.noTransaksi,
        tanggal: formData.tanggal,
        barang: formData.selectedItemsString,
        total: calculateTotal(),
      });
      onSave(formData);
      onClose();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        window.alert(error.response.data.msg);
      }
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-40 text-color-1 text-nowrap">
      {/* LOADING */}
      {isLoading && (
        <div className="fixed inset-0 bg-color-1 bg-opacity-50 flex justify-center items-center z-50 text-color-1">
          <div className="p-4 rounded-md">
            <span className="loading loading-dots loading-lg text-color-3"></span>
          </div>
        </div>
      )}

      <div className="bg-color-3 p-5 rounded shadow-lg w-4/5 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Tambah Data Penjualan</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1" htmlFor="noTransaksi">
              No Transaksi
            </label>
            <input
              type="text"
              id="noTransaksi"
              name="noTransaksi"
              value={formData.noTransaksi}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              className="w-full px-2 py-1 border border-color-4 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Barang</label>
            <div className="flex gap-5 md:flex-row flex-col">
              <div className="p-2 md:w-fit h-fit text-sm rounded border border-color-4">
                <div className="mb-4">
                  <label className="block mb-1" htmlFor="newItemNama">
                    Nama Barang Baru
                  </label>
                  <input
                    type="text"
                    id="newItemNama"
                    name="newItemNama"
                    value={formData.newItemNama}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 border border-color-4 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1" htmlFor="newItemHarga">
                    Harga Barang Baru (Rp)
                  </label>
                  <input
                    type="text"
                    id="newItemHarga"
                    name="newItemHarga"
                    value={formData.newItemHarga}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 border border-color-4 rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddNewItem}
                  className="bg-color-2 hover:scale-105 py-1 w-full rounded text-color-3"
                >
                  + Tambah Barang
                </button>
              </div>
              <div className="flex flex-col gap-3 p-2 w-fit h-fit text-sm rounded border border-color-4">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <input
                      type="checkbox"
                      id={`item-${index}`}
                      checked={item.selected}
                      onChange={(e) => handleCheckboxChange(e, index)}
                    />
                    <label htmlFor={`item-${index}`}>{item.nama}</label>
                    <input
                      type="number"
                      min="1"
                      value={item.jumlah}
                      onChange={(e) => handleJumlahChange(e, index)}
                      className="px-2 py-1 border border-color-4 rounded w-14"
                    />
                    <span>x Rp {item.harga}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(index)}
                      className="bg-color-5 hover:scale-105 py-1 px-2 rounded text-sm text-color-3"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <input
                disabled
                id="barang"
                name="barang"
                value={formData.selectedItemsString}
                className="w-full px-2 py-1 border border-color-4 rounded mt-4"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1" htmlFor="total">
              Total Harga
            </label>
            <input
              disabled
              type="text"
              id="total"
              name="total"
              value={calculateTotal()}
              readOnly
              className="w-full px-2 py-1 border border-color-4 rounded"
            />
          </div>
          <div className="flex justify-end gap-2 text-color-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-color-5 hover:scale-105 py-2 px-4 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-color-2 hover:scale-105 py-2 px-4 rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormAddPenjualan;
