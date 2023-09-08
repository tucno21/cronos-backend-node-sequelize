import { Sequelize } from 'sequelize';
import { paramConnect } from '../core/config';

const db = new Sequelize(paramConnect.database, paramConnect.user, paramConnect.password, {
    host: paramConnect.host,
    port: paramConnect.port,
    dialect: 'mysql',
    define: {
        timestamps: true
    },
    // logging: false
    pool: {
        max: 5, //numero de conexiones
        min: 0, // numero de conexiones 
        acquire: 30000, // tiempo de espera
        idle: 10000 // tiempo de espera
    },
})

export default db