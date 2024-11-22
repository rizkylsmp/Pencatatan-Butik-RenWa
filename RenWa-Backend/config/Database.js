import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const db_name = process.env.DB_NAME;
const db_usn = process.env.DB_USERNAME;
const db_pass = process.env.DB_PASSWORD;
const db_host = process.env.DB_HOST;

const db = new Sequelize(db_name, db_usn, db_pass, {
  host: db_host,
  dialect: "mysql",
});

export default db;
