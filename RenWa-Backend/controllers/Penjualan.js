import Penjualan from "../models/PenjualanModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getPenjualan = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Penjualan.findAll({
        attributes: ["uuid", "noTransaksi", "tanggal", "barang", "total"],
        include: [
          {
            model: User,
            attributes: ["nama", "username"],
          },
        ],
      });
    } else {
      response = await Penjualan.findAll({
        attributes: ["uuid", "noTransaksi", "tanggal", "barang", "total"],
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: User,
            attributes: ["nama", "username"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getPenjualanById = async (req, res) => {
  try {
    const penjualan = await Penjualan.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!penjualan)
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    let response;
    if (req.role === "admin") {
      response = await Penjualan.findOne({
        attributes: ["uuid", "noTransaksi", "tanggal", "barang", "total"],
        where: {
          id: penjualan.id,
        },
        include: [
          {
            model: User,
            attributes: ["nama", "username"],
          },
        ],
      });
    } else {
      response = await Penjualan.findOne({
        attributes: ["uuid", "noTransaksi", "tanggal", "barang", "total"],
        where: {
          [Op.and]: [{ id: penjualan.id }, { userId: req.userId }],
        },
        include: [
          {
            model: User,
            attributes: ["nama", "username"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createPenjualan = async (req, res) => {
  const { noTransaksi, tanggal, barang, total } = req.body;
  try {
    await Penjualan.create({
      noTransaksi: noTransaksi,
      tanggal: tanggal,
      barang: barang,
      total: total,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Penjualan Created Successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updatePenjualan = async (req, res) => {
  try {
    const penjualan = await Penjualan.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!penjualan)
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    const { noTransaksi, tanggal, barang, total } = req.body;
    if (req.role === "admin") {
      await Penjualan.update(
        { noTransaksi, tanggal, barang, total },
        {
          where: {
            id: penjualan.id,
          },
        }
      );
    } else {
      if (req.userId !== penjualan.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await Penjualan.update(
        { noTransaksi, tanggal, barang, total },
        {
          where: {
            [Op.and]: [{ id: penjualan.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Penjualan updated successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deletePenjualan = async (req, res) => {
  try {
    const penjualan = await Penjualan.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!penjualan)
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    const { noTransaksi, tanggal, barang, total } = req.body;
    if (req.role === "admin") {
      await Penjualan.destroy({
        where: {
          id: penjualan.id,
        },
      });
    } else {
      if (req.userId !== penjualan.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await Penjualan.destroy({
        where: {
          [Op.and]: [{ id: penjualan.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Penjualan deleted successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
