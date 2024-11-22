import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import FormAddPenjualan from "../functions/FormAddPenjualan.jsx";
import FormEditPenjualan from "../functions/FormEditPenjualan.jsx";
import { CaretUp, CaretDown } from "@phosphor-icons/react";
import CSVIcon from "../assets/csv.png";

const DataPenjualan = () => {
  const [penjualan, setPenjualan] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editPenjualan, setEditPenjualan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredItems = useMemo(() => {
    return penjualan.filter((item) =>
      item.noTransaksi.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [penjualan, searchTerm]);

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

  const goToPreviousPage = () => setCurrentPage((prevPage) => prevPage - 1);
  const goToNextPage = () => setCurrentPage((prevPage) => prevPage + 1);
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    getPenjualan();
  }, []);

  const getPenjualan = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/penjualan`
      );
      setPenjualan(response.data);
    } catch (error) {
      console.error("Error fetching penjualan:", error);
    }
    setIsLoading(false);
  };

  const deletePenjualan = async (penjualanId) => {
    setIsLoading(true);
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/penjualan/${penjualanId}`
      );
      getPenjualan();
    } catch (error) {
      console.error("Error deleting penjualan:", error);
    }
    setIsLoading(false);
  };

  const getIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? <CaretUp /> : <CaretDown />;
    }
    return null;
  };

  const csvData = penjualan.map((item, index) => ({
    No: index + 1,
    "No Transaksi": item.noTransaksi,
    Username: item.user.username,
    Tanggal: item.tanggal,
    Barang: item.barang,
    Total: item.total,
  }));

  const currentDate = new Date();
  const filename = `data_penjualan_${currentDate
    .toLocaleDateString()
    .replace(/\//g, "-")}.csv`;

  return (
    <div className="p-5 h-fit bg-color-5 rounded shadow-xl md:text-base text-sm text-color-3">
      {isLoading && (
        <div className="fixed inset-0 bg-color-1 bg-opacity-50 flex justify-center items-center z-50 text-color-1">
          <div className="p-4 rounded-md">
            <span className="loading loading-dots loading-lg text-color-3"></span>
          </div>
        </div>
      )}

      <h2 className="md:text-2xl text-xl font-bold pb-3">Data Penjualan</h2>

      <div className="mb-4 flex md:flex-row flex-col gap-3 justify-between">
        <div className="flex justify-between gap-5 items-center">
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

          <div>
            <label htmlFor="itemsPerPage" className="mr-2">
              Tampilkan&nbsp;
            </label>
            <input
              id="itemsPerPage"
              type="number"
              min="1"
              max={penjualan.length}
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="px-2 py-1 bg-color-3 text-color-1 font-bold rounded-md"
            />
            <label htmlFor="itemsPerPage" className="ml-2">
              &nbsp;Entri
            </label>
          </div>
        </div>

        <input
          type="text"
          placeholder="Cari no transaksi..."
          value={searchTerm}
          onChange={handleSearch}
          className="px-2 py-1 border border-gray-300 rounded-md text-color-1 w-full md:max-w-64"
        />
      </div>

      <div className="overflow-x-auto font-semibold">
        <table className="bg-white min-w-full text-nowrap text-color-5">
          <thead>
            <tr className="border-b-2 border-color-5 text-left">
              <th className="px-6 py-3">No</th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("noTransaksi")}
              >
                <div className="flex items-center gap-2">
                  No Transaksi {getIcon("noTransaksi")}
                </div>
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("user.username")}
              >
                <div className="flex items-center gap-2">
                  Username {getIcon("user.username")}
                </div>
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("tanggal")}
              >
                <div className="flex items-center gap-2">
                  Tanggal {getIcon("tanggal")}
                </div>
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("barang")}
              >
                <div className="flex items-center gap-2">
                  Barang {getIcon("barang")}
                </div>
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("total")}
              >
                <div className="flex items-center gap-2">
                  Total {getIcon("total")}
                </div>
              </th>
              <th className="px-6 py-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item.uuid} className="border border-color-5">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{item.noTransaksi}</td>
                <td className="px-6 py-4">{item.user.username}</td>
                <td className="px-6 py-4">{item.tanggal}</td>
                <td className="px-6 py-4">{item.barang}</td>
                <td className="px-6 py-4">Rp {item.total}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 text-center">
                    <button
                      onClick={() => {
                        setEditPenjualan(item);
                        setShowEditForm(true);
                      }}
                      className="bg-color-2 hover:scale-105 py-1 px-2 rounded text-color-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePenjualan(item.uuid)}
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

      <FormAddPenjualan
        show={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSave={getPenjualan}
      />
      <FormEditPenjualan
        show={showEditForm}
        data={editPenjualan}
        onClose={() => setShowEditForm(false)}
        onSave={getPenjualan}
      />
    </div>
  );
};

export default DataPenjualan;
