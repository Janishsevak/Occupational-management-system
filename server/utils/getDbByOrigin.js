import { Sequelize } from "sequelize";

export const getDBByOrigin = (origin) => {
  console.log("🔍 Inside getDBByOrigin:", origin, "| typeof:", typeof origin);

  // 🧪 Check what you're actually receiving
  if (!origin || typeof origin !== 'string') {
    throw new Error("Missing or invalid origin");
  }


  const dbName = `ohc_${origin.toLowerCase()}`;
  console.log("Using DB:", dbName);

  return new Sequelize(dbName, 'root', 'jaygoga', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
  });
};