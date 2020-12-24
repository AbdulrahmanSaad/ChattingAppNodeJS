FROM node

WORKDIR /code

COPY . /code

RUN yarn

EXPOSE 3000

CMD node App.js