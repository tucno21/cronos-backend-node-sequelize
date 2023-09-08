import { DataTypes } from "sequelize";
import db from "../database/sequelize"

const Categoria = db.define('categorias', {
    nombre: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
});

export default Categoria;