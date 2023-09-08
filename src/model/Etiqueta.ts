import { DataTypes } from "sequelize";
import db from "../database/sequelize"

const Etiqueta = db.define('etiquetas', {
    nombre: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
});

export default Etiqueta;


