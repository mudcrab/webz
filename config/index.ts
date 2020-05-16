export * from './config.koa';
export * from './config.db';

import { server } from './config.koa';
import { isDbEnabled } from '../knexfile';
import { startDb } from './config.db';

export interface WebzOptions {
  controllers?: string;
  enableSystemController?: boolean;
  dbConfig: any;
}

export const init = ({ controllers, enableSystemController, dbConfig }: WebzOptions) => {
  server(controllers, enableSystemController).listen(
    Number(process.env.PORT || 3000),
    process.env.HOST || '127.0.0.1',
    () => {
      console.info(`Server running at http://${process.env.HOST || '127.0.0.1'}:${process.env.PORT || 3000}`);

      if (isDbEnabled() && dbConfig) {
        startDb(dbConfig);
      }
    }
  );
};
