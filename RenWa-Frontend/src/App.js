import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/DashboardPage";
import BarangKeluar from "./pages/BarangKeluarPage";
import BarangMasuk from "./pages/BarangMasukPage";
import DataUser from "./pages/DataUserPage";
import DataPenjualan from "./pages/DataPenjualanPage";
import TerimaBarang from "./pages/TerimaBarangPage";
import KembaliBarang from "./pages/KembaliBarangPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/terima-barang" element={<TerimaBarang />} />
          <Route path="/kembali-barang" element={<KembaliBarang />} />
          <Route path="/data-penjualan" element={<DataPenjualan />} />
          <Route path="/barang-keluar" element={<BarangKeluar />} />
          <Route path="/barang-masuk" element={<BarangMasuk />} />
          <Route path="/data-user" element={<DataUser />} />
          <Route path="/data-penjualan" element={<DataPenjualan />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
