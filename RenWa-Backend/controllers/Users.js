import User from "../models/UserModel.js";
import argon2 from "argon2";

// Mengambil semua pengguna
export const getUsers = async (req, res) => {
  try {
    const response = await User.findAll({
      attributes: ["uuid", "username", "nama", "jenisKelamin", "role"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Mengambil pengguna berdasarkan ID
export const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      attributes: ["uuid", "username", "nama", "jenisKelamin", "role"],
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Membuat pengguna baru
export const createUser = async (req, res) => {
  const { username, nama, jenisKelamin, password, confPassword, role } =
    req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password tidak cocok" });
  const hashPassword = await argon2.hash(password);
  try {
    await User.create({
      username: username,
      nama: nama,
      jenisKelamin: jenisKelamin,
      password: hashPassword,
      role: role,
    });
    res.status(201).json({ msg: "Register Berhasil" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Mengupdate pengguna
export const updateUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  const { username, nama, jenisKelamin, password, confPassword, role } =
    req.body;
  let hashPassword;
  if (password === "" || password === null) {
    hashPassword = user.password;
  } else {
    hashPassword = await argon2.hash(password);
  }
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password tidak cocok" });
  try {
    await User.update(
      {
        nama: nama,
        username: username,
        jenisKelamin: jenisKelamin,
        password: hashPassword,
        role: role,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Menghapus pengguna
export const deleteUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  try {
    await User.destroy({
      where: {
        id: user.id,
      },
    });
    res.status(200).json({ msg: "User Deleted" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
