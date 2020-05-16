import dotenv from 'dotenv';
import Koa from 'koa';
import serve from 'koa-static';
import mount from 'koa-mount';
import { useKoaServer, Action } from 'routing-controllers';
import { JwtUser } from '../src/entities';
import { verify } from 'jsonwebtoken';
import { readdirSync } from 'fs';
import { join } from 'path';

dotenv.config();

const asyncVerify = (token) =>
  new Promise((resolve, reject) => {
    verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });

export const config = (app: Koa) => {
  app
    .use(async (ctx, next) => {
      try {
        const n = await next();
      } catch (err) {
        const statusCode = err.httpCode || err.statusCode || err.status || err.code || 500;

        ctx.status = isNaN(Number(statusCode)) ? 500 : Number(statusCode);

        ctx.body = JSON.stringify({
          status: false,
          code: ctx.status || 500,
          payload: {
            message: err.message || ''
          }
        });

        ctx.app.emit('error', err, ctx);
      }
    })
    .use(async (ctx, next) => {
      const start = Date.now();
      await next();
      const ms = Date.now() - start;
      ctx.set('X-Response-Time', `${ms}ms`);
    })
    .on('error', (err, ctx) => {
      console.log(err);
    });

  if (!!process.env.STATIC_DIR) {
    app.use(mount('/public', serve(process.env.STATIC_PATH)));
  }
};

export const server = (controllersPath?: string) => {
  const controllers = [join(__dirname, 'controllers', '*')];

  if (controllersPath) {
    controllers.push(join(controllersPath, '*'));
  }

  console.log(controllers);

  const app = new Koa();

  config(app);

  useKoaServer(app, {
    controllers,
    currentUserChecker: async (action: Action) => {
      const token = action.request.headers.authorization.replace(/^Bearer\s/, '');

      try {
        const jwtUser: JwtUser = (await asyncVerify(token)) as JwtUser;

        return jwtUser;
      } catch (e) {
        return {};
      }
    },

    authorizationChecker: async (action: Action, roles?: any) => {
      if (
        action.request.headers.authorization === undefined ||
        action.request.headers.authorization === null ||
        action.request.headers.authorization.length < 10
      ) {
        return false;
      }

      const token = action.request.headers.authorization.replace(/^Bearer\s/, '');

      try {
        const jwtUser: JwtUser = (await asyncVerify(token)) as JwtUser;

        return !!jwtUser.id;
      } catch (err) {
        return false;
      }
    },
    validation: false,
    defaultErrorHandler: false
  });

  return app;
};
