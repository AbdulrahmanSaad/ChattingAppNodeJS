FROM node

WORKDIR /code

COPY package.json /code/package.json

RUN yarn

COPY . /code

EXPOSE 3000

CMD node App.js