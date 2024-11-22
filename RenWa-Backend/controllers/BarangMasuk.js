import BarangMasuk from "../models/BarangMasukModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getBarangMasuk = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await BarangMasuk.findAll({
        attributes: [
          "uuid",
          "kodeBarang",
          "tanggal",
          "barang",
          "jumlah",
          "dari",
          "gambar",
        ],
        include: [
          {
            model: User,
            attributes: ["nama", "username"],
          },
        ],
      });
    } else {
      response = await BarangMasuk.findAll({
        attributes: [
          "uuid",
          "kodeBarang",
          "tanggal",
          "barang",
          "jumlah",
          "dari",
          "gambar",
        ],
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

export const getBarangMasukById = async (req, res) => {
  try {
    const barangMasuk = await BarangMasuk.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!barangMasuk)
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    let response;
    if (req.role === "admin") {
      response = await BarangMasuk.findOne({
        attributes: [
          "uuid",
          "kodeBarang",
          "tanggal",
          "barang",
          "jumlah",
          "dari",
          "gambar",
        ],
        where: {
          id: barangMasuk.id,
        },
        include: [
          {
            model: User,
            attributes: ["nama", "username"],
          },
        ],
      });
    } else {
      response = await BarangMasuk.findOne({
        attributes: [
          "uuid",
          "kodeBarang",
          "tanggal",
          "barang",
          "jumlah",
          "dari",
          "gambar",
        ],
        where: {
          [Op.and]: [{ id: barangMasuk.id }, { userId: req.userId }],
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

export const createBarangMasuk = async (req, res) => {
  const { kodeBarang, tanggal, barang, jumlah, dari } = req.body;
  const gambar = req.file ? req.file.path : null;
  try {
    await BarangMasuk.create({
      kodeBarang,
      tanggal,
      barang,
      jumlah,
      dari,
      gambar,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Data Created Successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateBarangMasuk = async (req, res) => {
  try {
    const barangMasuk = await BarangMasuk.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!barangMasuk)
      return res.status(404).json({ msg: "Data tidak ditemukan" });

    const { kodeBarang, tanggal, barang, jumlah, dari } = req.body;
    const gambar = req.file ? req.file.path : barangMasuk.gambar;

    if (req.role === "admin") {
      await BarangMasuk.update(
        { kodeBarang, tanggal, barang, jumlah, dari, gambar },
        {
          where: {
            id: barangMasuk.id,
          },
        }
      );
    } else {
      if (req.userId !== barangMasuk.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await BarangMasuk.update(
        { kodeBarang, tanggal, barang, jumlah, dari, gambar },
        {
          where: {
            [Op.and]: [{ id: barangMasuk.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Data updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteBarangMasuk = async (req, res) => {
  try {
    const barangMasuk = await BarangMasuk.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!barangMasuk)
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    const { kodeBarang, tanggal, barang, jumlah, dari, gambar } = req.body;
    if (req.role === "admin") {
      await BarangMasuk.destroy({
        where: {
          id: barangMasuk.id,
        },
      });
    } else {
      if (req.userId !== barangMasuk.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await BarangMasuk.destroy({
        where: {
          [Op.and]: [{ id: barangMasuk.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Data deleted successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
