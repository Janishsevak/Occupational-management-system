import { Sequelize } from "sequelize";


export const adminDB = new Sequelize("ohc", "root", "jaygoga", {
  host: "localhost",
  dialect: "mysql",
});

const dbconfig = {
   Ankleshwar : {
    database: "ohc_ankleshwar",
    username: "root",
    password: "jaygoga",
    host: "localhost",
    dialect: "mysql",
  },
   Dahej: {
    database: "ohc_dahej",
    username: "root",
    password: "jaygoga",
    host: "localhost",
    dialect: "mysql",
  },
  Kurkumbh: {
    database: "ohc_kurkumbh",
    username: "root",
    password: "jaygoga",
    host: "localhost",
    dialect: "mysql",
  },
};

const connection = {};

export const getDbByOrigin = (origin) =>{
    if (!origin || !dbconfig[origin]) {
    throw new Error("Invalid origin for DB connection");
  }
    if (!connection[origin]) {
        const config = dbconfig[origin];
        connection[origin] = new Sequelize(
            config.database,
            config.username,
            config.password,
            {
                host:config.host,
                dialect:config.dialect
            }
        );
    }
    return connection[origin];
}

export const connectAllUserDBs = async () => {
  for (const origin of Object.keys(dbconfig)) {
    try {
      const db = getDbByOrigin(origin);
      await db.authenticate();
      console.log(`✅ ${origin} DB connected`);
    } catch (error) {
      console.error(`❌ ${origin} DB connection failed:`, error.message);
    }
  }
};
