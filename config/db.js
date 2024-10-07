import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
//env
dotenv.config();


const dbName = process.env.DB_NAME;
const dbPassword = process.env.DB_PASSWORD;
const dbUser=process.env.DB_USER;
const dbHost=process.env.DB_HOST;
const db = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: "mssql",
    logging: console.log,
    dialectOptions: {
      datefirst: 1
    },
    timezone: '+00:00'
  });

async function checkDatabaseConnection() {
    try {
        await db.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error.message);
        process.exit(1);
    }
}


checkDatabaseConnection();

export default db;