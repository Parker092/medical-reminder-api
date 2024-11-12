# Dockerfile

# Usar la imagen oficial de Node.js versión 16 o superior como base
FROM node:16

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Instalar nodemon globalmente para cambios en caliente
RUN npm install -g nodemon

# Copiar el resto de la aplicación
COPY . .

# Exponer el puerto en el que la aplicación se ejecuta
EXPOSE 5002

# Comando para ejecutar la aplicación usando nodemon
CMD ["nodemon", "app.js"]