FROM node:8.11.3

COPY . /app/
WORKDIR /app

RUN npm install

ENV HOST 127.0.0.1
ENV PORT 8000

EXPOSE 8000

CMD ["npm", "start"]
