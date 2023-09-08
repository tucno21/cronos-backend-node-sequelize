import { exit } from "node:process";

import categorias from "./categorias";
import precios from "./precios";
import Categoria from "../model/Categorias";
import Precio from "../model/Precio";
import db from "../database/sequelize";

const importarDatos = async () => {
    try {
        //autenticar
        await db.authenticate();
        //generar tabla y columnas
        await db.sync();

        //insertar datos
        //si uno depende de otro, primero se ejecuta el depende
        // await Categoria.bulkCreate(categorias);
        // await Precio.bulkCreate(precios);

        //si no dependem usamos Promise.all
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios)
        ]);

        // cerrar conexion
        // await db.close();

        //terminar proceso
        console.log("Datos importados correctamente");
        exit(0);
    } catch (error) {
        console.log(error);
        exit(1);
    }
}

const eliminarDatos = async () => {
    try {
        await Promise.all([
            Categoria.destroy({ where: {}, truncate: true }),
            Precio.destroy({ where: {}, truncate: true })
        ]);

        // await db.sync({force: true}); //resetea todas las tablas

        console.log("Datos eliminados correctamente");
        exit(0);
    } catch (error) {
        console.log(error);
        exit(1);
    }
}


//"db:seed": "ts-node ./src/seed/seed.ts -i"
//"db:seed" es el comando que se ejecuta para importar los datos
//si se ejecuta con -i, importa los datos
if (process.argv[2] === "-i") {
    eliminarDatos();
    importarDatos();
}