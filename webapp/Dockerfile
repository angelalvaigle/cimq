FROM node:20

COPY . /app
WORKDIR /app

#Install the dependencies
RUN npm install

ARG API_URI="http://localhost:8000"
ENV REACT_APP_API_ENDPOINT=$API_URI

#Create an optimized version of the webapp
RUN npm run build
RUN npm install -g serve

# Exponemos el puerto 3000 para acceder desde fuera del contenedor
EXPOSE 3000

# Iniciamos el servidor, escuchando en todas las interfaces
CMD ["serve", "-s", "build", "-l", "tcp://0.0.0.0:3000"]

#Execute npm run prod to run the server
#CMD [ "npm", "run", "prod" ]
#CMD ["npm", "start"]