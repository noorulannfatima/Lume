// At the top of lib/database.ts
console.log('DATABASE_URL:', process.env.DATABASE_URL);

import { Sequelize } from 'sequelize';

let sequelize: Sequelize | null = null;

export const getSequelize = () => {
  if (!sequelize) {
    sequelize = new Sequelize(
      process.env.DATABASE_URL || '',
      {
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      }
    );
  }
  return sequelize;
};

export default getSequelize();
