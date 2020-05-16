import dotenv from 'dotenv';
import Knex = require('knex');
import { Model } from 'objection';
import config from '../knexfile';

dotenv.config();

export const startDb = (c?: any) => {
  const knex = Knex((c || config)[process.env.NODE_ENV || 'development']);

  if (process.env.NODE_ENV === 'production') {
    knex.migrate
      .latest()
      .then(() => {
        console.log('Database migrated');
      })
      .catch((err) => {
        console.log('Databse migration error', err);
      });
  }

  Model.knex(knex);
};
