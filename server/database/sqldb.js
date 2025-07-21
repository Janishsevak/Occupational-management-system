import { Sequelize } from 'sequelize';

// ✅ Sequelize instances for each database
const sequelize = new Sequelize('ohc', 'root', 'jaygoga', {
  host: 'localhost',
  dialect: 'mysql',
});
const ankleshwarDB = new Sequelize('ohc_ankleshwar', 'root', 'jaygoga', {
  host: 'localhost',
  dialect: 'mysql',
});

const dahejDB = new Sequelize('ohc_dahej', 'root', 'jaygoga', {
  host: 'localhost',
  dialect: 'mysql',
});

const kurkumbhDB = new Sequelize('ohc_kurkumbh', 'root', 'jaygoga', {
  host: 'localhost',
  dialect: 'mysql',
});

// ✅ Test connections
const connectAllDBs = async () => {
  try {
    await ankleshwarDB.authenticate();
    console.log('Ankleshwar DB connected');
    await dahejDB.authenticate();
    console.log('Dahej DB connected');
    await kurkumbhDB.authenticate();
    console.log('Kurkumbh DB connected');
  } catch (error) {
    console.error('Unable to connect to one or more DBs:', error.message);
  }
};

// ✅ Export the Sequelize instances
export { ankleshwarDB, dahejDB, kurkumbhDB, sequelize  };
export default connectAllDBs;


