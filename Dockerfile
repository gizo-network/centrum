FROM node:carbon

COPY . /centrum
WORKDIR /centrum
RUN yarn install

CMD yarn run start

