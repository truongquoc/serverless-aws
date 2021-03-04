const Sequelize = require("sequelize");
const dbConfig = {
  database: 'Airmarket',
  username: 'admin',
  password: 'admin123',
  host: 'airmarket-sql.cgttjqufqb7j.us-west-2.rds.amazonaws.com',
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.pool,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.measurements = require("./measurements.js")(sequelize, Sequelize);

module.exports = db;
