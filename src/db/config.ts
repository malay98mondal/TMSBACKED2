import { Dialect, Sequelize } from 'sequelize';
import dotenv from 'dotenv'
dotenv.config()

// Define the type for the environment variable
type Environment = 'development' | 'production';

const environment: Environment = (process.env.NODE_ENV as Environment) || 'production';
const dbHost = process.env.RDS_HOSTNAME;
const dbPort = process.env.RDS_PORT;
const dbName = process.env.RDS_DB_NAME as string;
const dbUser = process.env.RDS_USERNAME as string;
const dbDriver = process.env.DB_DRIVER as Dialect;
const dbPassword = process.env.RDS_PASSWORD as string;

//dev
const ddbHost = process.env.DRDS_HOSTNAME;
const ddbPort = process.env.DRDS_PORT;
const ddbName = process.env.DRDS_DB_NAME as string;
const ddbUser = process.env.DRDS_USERNAME as string;
const ddbDriver = process.env.DDB_DRIVER as Dialect;
const ddbPassword = process.env.DRDS_PASSWORD as string;

function getConnection() {
  if (environment === 'production') {
    // Production configuration
    return new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      port: parseInt(dbPort || '6543' ),
      dialect: 'postgres',
    });
  } else {
    // Development configuration
    return new Sequelize(ddbName, ddbUser, ddbPassword, {
      host: ddbHost,
      port: parseInt(ddbPort || '6543' ),
      dialect: 'postgres',
    });
  }
}

console.log('Connecting to the database...');

// Create the Sequelize connection
const sequelizeConnection = getConnection();

export default sequelizeConnection;

