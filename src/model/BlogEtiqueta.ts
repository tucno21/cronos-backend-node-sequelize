// import { DataTypes } from "sequelize";
import db from "../database/sequelize"
import Etiqueta from "./Etiqueta";
import Blog from "./Blog";

const BlogEtiqueta = db.define('blog_etiqueta', {});

// BlogEtiqueta.belongsTo(Etiqueta, { foreignKey: 'etiqueta_id', onDelete: 'CASCADE' }); // belongsTo 
// BlogEtiqueta.belongsTo(Blog, { foreignKey: 'blog_id', onDelete: 'CASCADE' });

//relacion de muchos a muchos
//belongsToMany es para relacionar muchos a muchos
//through es para indicar que tabla se va a crear para relacionar
Blog.belongsToMany(Etiqueta, { through: BlogEtiqueta });
Etiqueta.belongsToMany(Blog, { through: BlogEtiqueta });

export default BlogEtiqueta;
