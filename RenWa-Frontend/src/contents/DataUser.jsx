import React, { useState, useEffect } from "react";
import axios from "axios";
import FormAddUsers from "../functions/FormAddUsers";
import FormEditUsers from "../functions/FormEditUsers";
import { CaretUp, CaretDown } from "@phosphor-icons/react";
import { CSVLink } from "react-csv";
import CSVIcon from "../assets/csv.png";

const DataUser = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredItems = users.filter((user) =>
    user.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedItems = React.useMemo(() => {
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

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/users`
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setIsLoading(false);
  };

  const deleteUser = async (userId) => {
    setIsLoading(true);
    await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/users/${userId}`);
    getUsers();
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getIcon = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") {
        return <CaretUp />;
      } else {
        return <CaretDown />;
      }
    }
    return null;
  };

  const csvData = users.map((item, index) => ({
    No: index + 1,
    Username: item.username,
    Nama: item.nama,
    "Jenis Kelamin": item.jenisKelamin,
    Role: item.role,
  }));

  const currentDate = new Date();
  const filename = `data_user_${currentDate
    .toLocaleDateString()
    .replace(/\//g, "-")}.csv`;

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

      <h2 className="text-2xl font-bold pb-3">Data User</h2>

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
              max={users.length}
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
          placeholder="Cari user..."
          value={searchTerm}
          onChange={handleSearch}
          className="px-2 py-1 border border-gray-300 rounded-md text-color-1 w-full md:max-w-64"
        />
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-nowrap text-color-5">
          <thead>
            <tr className="border-b-2 border-color-5 text-left">
              <th className="px-6 py-3">No</th>
              <th className="px-6 py-3" onClick={() => requestSort("username")}>
                <div className="flex gap-2 items-center cursor-pointer">
                  Username {getIcon("username")}
                </div>
              </th>
              <th className="px-6 py-3" onClick={() => requestSort("nama")}>
                <div className="flex gap-2 items-center cursor-pointer">
                  Nama {getIcon("nama")}
                </div>
              </th>
              <th
                className="px-6 py-3"
                onClick={() => requestSort("jenisKelamin")}
              >
                <div className="flex gap-2 items-center cursor-pointer">
                  Jenis Kelamin {getIcon("jenisKelamin")}
                </div>
              </th>
              <th className="px-6 py-3" onClick={() => requestSort("role")}>
                <div className="flex gap-2 items-center cursor-pointer">
                  Role {getIcon("role")}
                </div>
              </th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((user, index) => (
              <tr key={user.uuid} className="border-b border-color-5">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{user.username}</td>
                <td className="px-6 py-4">{user.nama}</td>
                <td className="px-6 py-4">{user.jenisKelamin}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 text-center">
                    <button
                      onClick={() => {
                        setEditUser(user);
                        setShowEditForm(true);
                      }}
                      className="bg-color-2 hover:scale-105 py-1 px-2 rounded text-color-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUser(user.uuid)}
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

      <FormAddUsers
        show={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSave={getUsers}
      />

      <FormEditUsers
        show={showEditForm}
        data={editUser}
        onClose={() => setShowEditForm(false)}
        onSave={getUsers}
      />
    </div>
  );
};

export default DataUser;
