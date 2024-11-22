import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import FormAddData from "../functions/FormAddBarangMasuk.jsx";
import FormEditData from "../functions/FormEditBarangMasuk.jsx";
import { CaretUp, CaretDown } from "@phosphor-icons/react";
import { CSVLink } from "react-csv";
import CSVIcon from "../assets/csv.png";

const BarangMasuk = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [selectedImage, setSelectedImage] = useState(null);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredItems = useMemo(() => {
    return data.filter((item) =>
      item.barang.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const sortedItems = useMemo(() => {
    let sortableItems = [...filteredItems];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredItems, sortConfig]);

  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleItemsPerPageChange = (e) => {
    const { value } = e.target;
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/barang-masuk`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  const deleteData = async (dataId) => {
    setIsLoading(true);
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/barang-masuk/${dataId}`
      );
      getData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
    setIsLoading(false);
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? <CaretUp /> : <CaretDown />;
    }
    return null;
  };

  const csvData = data.map((item, index) => ({
    No: index + 1,
    "Kode Barang": item.kodeBarang,
    Tanggal: item.tanggal,
    Barang: item.barang,
    Jumlah: item.jumlah,
    Dari: item.dari,
    Gambar: item.gambar,
  }));

  const currentDate = new Date();
  const filename = `data_barang_masuk_${currentDate
    .toLocaleDateString()
    .replace(/\//g, "-")}.csv`;

  const openImageOverlay = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageOverlay = () => {
    setSelectedImage(null);
  };

  return (
    <div className="p-5 h-fit bg-color-5 rounded shadow-xl md:text-base text-sm text-color-3">
      {/* LOADING */}
      {isLoading && (
        <div className="fixed inset-0 bg-color-1 bg-opacity-50 flex justify-center items-center z-50 text-color-1">
          <div className="p-4 rounded-md">
            <span className="loading loading-dots loading-lg text-color-3"></span>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold pb-3">Data Barang Masuk</h2>

      {/* Input Entri */}
      <div className="mb-4 flex md:flex-row flex-col gap-3 justify-between">
        <div className="flex justify-between gap-5 items-center">
          {/* Button Input */}
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-color-2 hover:scale-105 font-semibold py-2 px-4 rounded text-color-3"
          >
            Tambah Data
          </button>

          <CSVLink data={csvData} filename={filename}>
            <button className="flex items-center gap-3 bg-color-2 hover:scale-105 font-semibold py-2 px-4 rounded text-color-3">
              CSV
              <div className="w-5 ">
                <img src={CSVIcon} alt="CSV Icon" />
              </div>
            </button>
          </CSVLink>

          {/* Entri */}
          <div>
            <label htmlFor="itemsPerPage" className="mr-2">
              Tampilkan&nbsp;
            </label>
            <input
              id="itemsPerPage"
              type="number"
              min="1"
              max={data.length}
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="px-2 py-1 bg-color-3 text-color-1 font-bold rounded-md"
            />
            <label htmlFor="itemsPerPage" className="ml-2">
              &nbsp;Entri
            </label>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Cari nama barang..."
          value={searchTerm}
          onChange={handleSearch}
          className="px-2 py-1 border border-gray-300 rounded-md text-color-1 w-full md:max-w-64"
        />
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto font-semibold">
        <table className="bg-white min-w-full text-nowrap text-color-5">
          <thead>
            <tr className="border-b-2 border-color-5 text-left">
              <th className="px-6 py-3">No</th>
              <th
                className="px-6 py-3"
                onClick={() => requestSort("kodeBarang")}
              >
                <div className="flex gap-2 items-center cursor-pointer">
                  Kode Barang {getIcon("kodeBarang")}
                </div>
              </th>
              <th className="px-6 py-3" onClick={() => requestSort("tanggal")}>
                <div className="flex gap-2 items-center cursor-pointer">
                  Tanggal {getIcon("tanggal")}
                </div>
              </th>
              <th className="px-6 py-3" onClick={() => requestSort("barang")}>
                <div className="flex gap-2 items-center cursor-pointer">
                  Barang {getIcon("barang")}
                </div>
              </th>
              <th className="px-6 py-3" onClick={() => requestSort("jumlah")}>
                <div className="flex gap-2 items-center cursor-pointer">
                  Jumlah {getIcon("jumlah")}
                </div>
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("dari")}
              >
                <div className="flex gap-2 items-center">
                  Dari {getIcon("dari")}
                </div>
              </th>
              <th className="px-6 py-3">Gambar</th>
              <th className="px-6 py-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item.uuid} className="border-b border-color-5">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{item.kodeBarang}</td>
                <td className="px-6 py-4">{item.tanggal}</td>
                <td className="px-6 py-4">{item.barang}</td>
                <td className="px-6 py-4">{item.jumlah}</td>
                <td className="px-6 py-4">{item.dari}</td>
                <td className="px-6 py-4">
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}/${item.gambar}`}
                    alt={item.barang}
                    className="w-16 h-16 object-cover rounded-md cursor-pointer hover:scale-110 transition-transform duration-200"
                    onClick={() =>
                      openImageOverlay(
                        `${process.env.REACT_APP_API_BASE_URL}/${item.gambar}`
                      )
                    }
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 text-center">
                    <button
                      onClick={() => {
                        setEditData(item);
                        setShowEditForm(true);
                      }}
                      className="bg-color-2 hover:scale-105 py-1 px-2 rounded text-color-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteData(item.uuid)}
                      className="bg-color-6 hover:scale-105 py-1 px-2 rounded text-color-5"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* OVERLAY GAMBAR */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 ">
          <div className="relative">
            <img
              src={selectedImage}
              alt="Enlarged"
              className="w-full h-fit object-cover rounded-md"
            />
            <button
              onClick={closeImageOverlay}
              className="absolute top-5 right-8 text-white bg-color-2 rounded-full px-2 py-1"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}

      {/* Previous & Next Button */}
      <div className="mt-6 flex justify-end items-center">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className={`bg-color-4 text-color-5 font-semibold text-sm py-2 px-4 hover:text-md rounded-l ${
            currentPage === 1 ? "cursor-not-allowed" : ""
          }`}
        >
          &lt;&lt;
        </button>
        <div className="bg-color-6 text-color-5 font-semibold py-2 px-4">
          {currentPage}
        </div>
        <button
          onClick={goToNextPage}
          disabled={
            currentItems.length < itemsPerPage || currentItems.length === 0
          }
          className={`bg-color-4 text-color-5 font-semibold py-2 px-4 text-sm hover:text-md rounded-r ${
            currentItems.length < itemsPerPage || currentItems.length === 0
              ? "cursor-not-allowed"
              : ""
          }`}
        >
          &gt;&gt;
        </button>
      </div>

      {/* Forms for Adding and Editing Data */}
      <FormAddData
        show={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSave={getData}
      />
      <FormEditData
        show={showEditForm}
        data={editData}
        onClose={() => setShowEditForm(false)}
        onSave={getData}
      />
    </div>
  );
};

export default BarangMasuk;
