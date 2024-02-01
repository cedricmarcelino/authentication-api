FROM node:21

COPY package*.json ./

RUN npm ci

COPY . .

ENV PORT=4000

EXPOSE 4000

CMD ["npm", "start"]