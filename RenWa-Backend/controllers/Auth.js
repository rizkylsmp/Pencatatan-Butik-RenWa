import User from "../models/UserModel.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }
    const match = await argon2.verify(user.password, req.body.password);
    if (!match) {
      return res.status(400).json({ msg: "Wrong Password" });
    }
    req.session.userId = user.uuid;

    return res.json({
      uuid: user.uuid,
      username: user.username,
      nama: user.nama,
      jenisKelamin: user.jenisKelamin,
      role: user.role,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const Me = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
  }
  const user = await User.findOne({
    attributes: ["uuid", "username", "nama", "jenisKelamin", "role"],
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  res.status(200).json(user);
};

export const logOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "Tidak dapat logout" });
    res.status(200).json({ msg: "Anda telah logout" });
  });
};
