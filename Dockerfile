FROM node:current-alpine3.10
RUN mkdir -p /home/node/app

COPY package.json /home/node/app/package.json
COPY . /home/node/app
WORKDIR /home/node/app

RUN yarn install
RUN yarn build

EXPOSE 3000

CMD ["yarn", "pm2"]
