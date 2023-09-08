import { DataTypes } from "sequelize";
import db from "../database/sequelize";

const Usuario = db.define('usuarios', {
    nombre: {
        type: DataTypes.STRING(60),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(60),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(60),
        allowNull: false,
    },
    imagen: {
        type: DataTypes.STRING(120),
        allowNull: true,
    },
});

export default Usuario;