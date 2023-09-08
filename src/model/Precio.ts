import { DataTypes } from "sequelize";
import db from "../database/sequelize"

const Precio = db.define('precios', {
    nombre: {
        type: DataTypes.STRING(40),
        allowNull: false,
    },
});

export default Precio;