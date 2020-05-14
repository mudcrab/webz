import dotenv from 'dotenv';
import 'reflect-metadata';
import { useContainer } from 'routing-controllers';
import Container from 'typedi';
import { server } from './config.koa';
import { startDb } from './config.db';
import { isDbEnabled } from '../knexfile';

dotenv.config();

useContainer(Container);

if (isDbEnabled()) {
  startDb();
}

server().listen(Number(process.env.PORT || 3000), process.env.HOST || '127.0.0.1', () => {
  console.info(`Server running at http://${process.env.HOST || '127.0.0.1'}:${process.env.PORT || 3000}`);
});
