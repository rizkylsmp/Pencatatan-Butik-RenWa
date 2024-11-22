import express from "express";
import {
  getBarangKeluar,
  getBarangKeluarById,
  createBarangKeluar,
  updateBarangKeluar,
  deleteBarangKeluar,
} from "../controllers/BarangKeluar.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
import upload from "../config/Multer.js";

const router = express.Router();

router.get("/barang-keluar", verifyUser, adminOnly, getBarangKeluar);
router.get("/barang-keluar/:id", verifyUser, adminOnly, getBarangKeluarById);
router.post(
  "/barang-keluar",
  verifyUser,
  adminOnly,
  upload,
  createBarangKeluar
);
router.patch(
  "/barang-keluar/:id",
  verifyUser,
  adminOnly,
  upload,
  updateBarangKeluar
);
router.delete("/barang-keluar/:id", verifyUser, adminOnly, deleteBarangKeluar);

export default router;
