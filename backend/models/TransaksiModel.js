import { DataTypes, Sequelize } from "sequelize";
import db from "../config/Database.js";

const Transaksi=db.define('transaksi',{
    tgl:{
        type: DataTypes.DATE
    },
    nama_customer:{
        type: DataTypes.STRING
    },
    produk:{
        type: DataTypes.STRING
    },
    harga:{
        type: DataTypes.FLOAT
    },
    qty:{
        type: DataTypes.INTEGER
    }
},{
    freezeTableName:true
});

export default Transaksi;