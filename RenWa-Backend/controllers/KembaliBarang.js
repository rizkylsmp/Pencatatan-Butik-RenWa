import KembaliBarang from "../models/KembaliBarangModel.js";
import BarangMasuk from "../models/BarangMasukModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getKembaliBarang = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await KembaliBarang.findAll({
        attributes: [
          "uuid",
          "kodeBarang",
          "tanggal",
          "barang",
          "jumlah",
          "kepada",
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
      response = await KembaliBarang.findAll({
        attributes: [
          "uuid",
          "kodeBarang",
          "tanggal",
          "barang",
          "jumlah",
          "kepada",
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

export const getKembaliBarangById = async (req, res) => {
  try {
    const kembaliBarang = await KembaliBarang.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!kembaliBarang)
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    let response;
    if (req.role === "admin") {
      response = await KembaliBarang.findOne({
        attributes: [
          "uuid",
          "kodeBarang",
          "tanggal",
          "barang",
          "jumlah",
          "kepada",
          "gambar",
        ],
        where: {
          id: kembaliBarang.id,
        },
        include: [
          {
            model: User,
            attributes: ["nama", "username"],
          },
        ],
      });
    } else {
      response = await KembaliBarang.findOne({
        attributes: [
          "uuid",
          "kodeBarang",
          "tanggal",
          "barang",
          "jumlah",
          "kepada",
          "gambar",
        ],
        where: {
          [Op.and]: [{ id: kembaliBarang.id }, { userId: req.userId }],
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

export const createKembaliBarang = async (req, res) => {
  const { kodeBarang, tanggal, barang, jumlah, kepada } = req.body;
  const gambar = req.file ? req.file.path : null;
  try {
    const userPengirim = await User.findOne({
      where: {
        id: req.userId,
      },
    });

    if (!userPengirim) {
      return res.status(404).json({ msg: "User pengirim tidak ditemukan" });
    }

    const userTujuan = await User.findOne({
      where: {
        username: kepada,
      },
    });

    if (!userTujuan) {
      return res.status(404).json({ msg: "User tujuan tidak ditemukan" });
    }

    const kembaliBarang = await KembaliBarang.create({
      kodeBarang: kodeBarang,
      tanggal: tanggal,
      barang: barang,
      jumlah: jumlah,
      kepada: kepada,
      gambar: gambar,
      userId: req.userId,
    });

    await BarangMasuk.create({
      kodeBarang: kembaliBarang.kodeBarang,
      tanggal: kembaliBarang.tanggal,
      barang: kembaliBarang.barang,
      jumlah: kembaliBarang.jumlah,
      dari: userPengirim.username,
      gambar: kembaliBarang.gambar,
      userId: userTujuan.id,
    });

    res.status(201).json({ msg: "Data Created Successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateKembaliBarang = async (req, res) => {
  try {
    const kembaliBarang = await KembaliBarang.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!kembaliBarang)
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    const { kodeBarang, tanggal, barang, jumlah, kepada } = req.body;
    const gambar = req.file ? req.file.path : kembaliBarang.gambar;
    if (req.role === "admin") {
      await KembaliBarang.update(
        { kodeBarang, tanggal, barang, jumlah, kepada, gambar },
        {
          where: {
            id: kembaliBarang.id,
          },
        }
      );
    } else {
      if (req.userId !== kembaliBarang.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await KembaliBarang.update(
        { kodeBarang, tanggal, barang, jumlah, kepada, gambar },
        {
          where: {
            [Op.and]: [{ id: kembaliBarang.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Data updated successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteKembaliBarang = async (req, res) => {
  try {
    const kembaliBarang = await KembaliBarang.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!kembaliBarang)
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    const { kodeBarang, tanggal, barang, jumlah, kepada, gambar } = req.body;
    if (req.role === "admin") {
      await KembaliBarang.destroy({
        where: {
          id: kembaliBarang.id,
        },
      });
    } else {
      if (req.userId !== kembaliBarang.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await KembaliBarang.destroy({
        where: {
          [Op.and]: [{ id: kembaliBarang.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Data deleted successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
