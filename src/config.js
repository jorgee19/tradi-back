import promise from 'bluebird';
import pgPromise from 'pg-promise';
import dotenv from 'dotenv';
// Cargar Variables de entorno de un archivo .env
dotenv.config();

const cn = {
  "host": (process.env.DATABASE_IP || '127.0.0.1'),
  "port": (process.env.DATABASE_PORT || 10000),
  "database": (process.env.DATABASE_NAME || 'tradidb'),
  "user": (process.env.DATABASE_USER || 'admin'),
  "password": (process.env.DATABASE_PASSWORD || 'admin')
}
console.log(cn);
const initOptions = {
  promiseLib: promise
}
const pgp = pgPromise(initOptions);
const db = pgp(cn);
export default db;
