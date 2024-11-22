import express from "express";
import Penjualan from "../models/PenjualanModel.js";
import User from "../models/UserModel.js";
import { verifyUser } from "../middleware/AuthUser.js";
import { Op } from "sequelize";

const router = express.Router();

router.get("/stats", verifyUser, async (req, res) => {
  try {
    const jumlahTerjual = await Penjualan.count();
    const jumlahPengguna = await User.count();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const terjualHariIni = await Penjualan.count({
      where: {
        createdAt: {
          [Op.gte]: today,
        },
      },
    });

    res.json({
      jumlahTerjual,
      jumlahPengguna,
      terjualHariIni,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

export default router;
