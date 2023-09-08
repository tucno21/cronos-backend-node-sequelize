import { DataTypes } from "sequelize";
import db from "../database/sequelize";
import Usuario from "./Usario";

const Blog = db.define('blogs', {
    titulo: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    contenido: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
});

//blog se relaciona con usuario y dentro de blog se crea un campo que la relacione
//belongsTo realacion de uno a uno donde blog pertenece a un usuario
Blog.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'autor' });

export default Blog;


