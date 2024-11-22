import TerimaBarang from "../models/TerimaBarangModel.js";
import User from "../models/UserModel.js";
import BarangKeluar from "../models/BarangKeluarModel.js";
import { Op } from "sequelize";

export const getTerimaBarang = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await TerimaBarang.findAll({
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
            attributes: ["username"],
          },
        ],
      });
    } else {
      response = await TerimaBarang.findAll({
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
            attributes: ["username"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getTerimaBarangById = async (req, res) => {
  try {
    const terimaBarang = await TerimaBarang.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!terimaBarang)
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    let response;
    if (req.role === "admin") {
      response = await TerimaBarang.findAll({
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
          id: terimaBarang.id,
        },
        include: [
          {
            model: User,
            attributes: ["username"],
          },
        ],
      });
    } else {
      response = await TerimaBarang.findAll({
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
          [Op.and]: [{ id: terimaBarang.id }, { userId: req.userId }],
        },
        include: [
          {
            model: User,
            attributes: ["username"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createTerimaBarang = async (req, res) => {
  const { kodeBarang, tanggal, barang, jumlah, dari } = req.body;
  const gambar = req.file ? req.file.path : null;
  try {

    await TerimaBarang.create({
      kodeBarang: kodeBarang,
      tanggal: tanggal,
      barang: barang,
      jumlah: jumlah,
      dari: dari,
      gambar: gambar,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Data Created Successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateTerimaBarang = async (req, res) => {
  try {
    const terimaBarang = await TerimaBarang.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!terimaBarang)
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    const { kodeBarang, tanggal, barang, jumlah, dari } = req.body;
    const gambar = req.file ? req.file.path : terimaBarang.gambar;
    if (req.role === "admin") {
      await TerimaBarang.update(
        { kodeBarang, tanggal, barang, jumlah, dari, gambar },
        {
          where: {
            id: terimaBarang.id,
          },
        }
      );
    } else {
      if (req.userId !== terimaBarang.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await TerimaBarang.update(
        { kodeBarang, tanggal, barang, jumlah, dari, gambar },
        {
          where: {
            [Op.and]: [{ id: terimaBarang.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Data updated successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteTerimaBarang = async (req, res) => {
  try {
    const terimaBarang = await TerimaBarang.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!terimaBarang)
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    const { kodeBarang, tanggal, barang, jumlah, dari, gambar } = req.body;
    if (req.role === "admin") {
      await TerimaBarang.destroy({
        where: {
          id: terimaBarang.id,
        },
      });
    } else {
      if (req.userId !== terimaBarang.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await TerimaBarang.destroy({
        where: {
          [Op.and]: [{ id: terimaBarang.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Data deleted successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
