import express from "express";
import db from "./config/Database.js";
import router from "./routes/index.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import Produk from "./models/ProdukModel.js";
import Customer from "./models/CustomerModel.js";
import Users from "./models/UserModel.js";
import Role from "./models/RoleModel.js";
import Transaksi from "./models/TransaksiModel.js";

dotenv.config();
const app = express();

try {
    await db.authenticate();
    console.log('Database Connected');
    await Produk.sync();
    await Users.sync();
    await Role.sync();
    await Customer.sync();
    await Transaksi.sync();
} catch (error) {
    console.log(error);
}

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
//app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(5000,()=>console.log("Server running at port 5000"));
