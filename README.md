# WEBZ

__WEBS__ is a simplistic [Koa 2](https://koajs.com/) starter with Objection.js and Typescript.

## Features

- [Koa 2](https://koajs.com/)
- [Objection.js](https://vincit.github.io/objection.js/)
- [Typescript](https://www.typescriptlang.org/)
- [routing-controllers](https://github.com/typestack/routing-controllers)

## Development

- `yarn`
- `cp .sample.env .env`
- `yarn dev`

## Production

### Standalone

- `yarn`
- `yarn pm2`

### Docker

#### CLI

- `docker build . -t appname`
- `docker run --expose 3000 appname`

#### Docker Compose

- `docker-compose up -d`
