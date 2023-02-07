FROM node:18.13.0

EXPOSE 80

RUN mkdir /app
RUN npm root -g
RUN npm install npm@9.1.3 -g --force
RUN npm install npx@10.2.2 -g --force
RUN npm install watcher@2.2.0 -g

RUN apt-get update
RUN apt install lsof

COPY ./start.js /start.mjs

ENTRYPOINT node /start.mjs