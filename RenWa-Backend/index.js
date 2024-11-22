import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import PenjualanRoute from "./routes/PenjualanRoute.js";
import BarangMasukRoute from "./routes/BarangMasukRoute.js";
import BarangKeluarRoute from "./routes/BarangKeluarRoute.js";
import TerimaBarangRoute from "./routes/TerimaBarangRoute.js";
import KembaliBarangRoute from "./routes/KembaliBarangRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import StatsRoute from "./routes/StatsRoute.js";

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});

(async () => {
  await db.sync();
})();

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(
  cors({
    origin: ["http://localhost:3000", "https://butikrenwa.xyz"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/uploads", express.static("uploads"));

app.use(express.json());

app.use(AuthRoute);
app.use(UserRoute);
app.use(PenjualanRoute);
app.use(BarangMasukRoute);
app.use(BarangKeluarRoute);
app.use(TerimaBarangRoute);
app.use(KembaliBarangRoute);
app.use(StatsRoute);

store.sync();

app.listen(process.env.APP_PORT, () => {
  console.log(`Server running on port ${process.env.APP_PORT}`);
});

(async () => {
  try {
    await db.authenticate();
    console.log("Database connected...");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
