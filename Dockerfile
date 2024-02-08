FROM node:21

RUN mkdir -p /home/app

COPY ./src/app /home/app

WORKDIR /home/app

RUN npm ci

CMD ["npm", "start"]