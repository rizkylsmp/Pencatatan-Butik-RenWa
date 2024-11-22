import express from "express";
import {
  getPenjualan,
  getPenjualanById,
  createPenjualan,
  updatePenjualan,
  deletePenjualan,
} from "../controllers/Penjualan.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/penjualan", verifyUser, getPenjualan);
router.get("/penjualan/:id", verifyUser, getPenjualanById);
router.post("/penjualan", verifyUser, createPenjualan);
router.patch("/penjualan/:id", verifyUser, updatePenjualan);
router.delete("/penjualan/:id", verifyUser, deletePenjualan);

export default router;
