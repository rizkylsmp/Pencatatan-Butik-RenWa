import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import BarangMasuk from "./BarangMasukModel.js";

const { DataTypes } = Sequelize;

const KembaliBarang = db.define(
  "kembalibarang",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    kodeBarang: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    tanggal: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    barang: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    jumlah: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    kepada: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    gambar: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true,
  }
);

KembaliBarang.belongsTo(Users, { foreignKey: "userId" });
Users.hasMany(KembaliBarang, { foreignKey: "userId" });

KembaliBarang.hasMany(BarangMasuk, { foreignKey: "kembaliBarangId" });
BarangMasuk.belongsTo(KembaliBarang, { foreignKey: "kembaliBarangId" });

export default KembaliBarang;
