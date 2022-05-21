import { DataTypes, Sequelize } from "sequelize";
import db from "../config/Database.js";

const Role = db.define('role', {
    role: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
});

export default Role;