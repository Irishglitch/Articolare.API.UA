FROM alpine
RUN apk add --update nodejs npm
COPY . .
WORKDIR /src
RUN npm install
EXPOSE 3000
ENTRYPOINT ["npm", "start"]