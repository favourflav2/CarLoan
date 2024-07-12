FROM node:22-bookworm-slim

RUN npm install -g nodemon


# Work Directory
WORKDIR /server_Docker

# This is for caching ... if we make a change to our app when we build we wont have to keep running npm install since it wont be changed.. everthing above will be cached
COPY package*.json ./


RUN npm install

EXPOSE 5001

CMD ["npm", "run", "docker"]