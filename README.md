# Medical Reminder App

## Descripción General
Medical Reminder App es una aplicación desarrollada para mejorar la adherencia a los tratamientos médicos. Permite a los médicos gestionar tratamientos y a los pacientes recibir recordatorios de medicamentos en horarios programados. La app se centra en dos tipos de usuarios: médicos y pacientes.

- **Pacientes**: Reciben notificaciones sobre sus medicamentos, pueden confirmar la toma y ver su historial de tratamiento.
- **Médicos**: Pueden registrar pacientes y prescribir medicamentos, personalizando el tratamiento de cada uno.

## Tecnologías Utilizadas
- **Frontend**: Swift, SwiftUI (para iOS)
- **Backend**: Node.js, Express
- **Base de Datos**: MongoDB
- **Notificaciones Push**: Firebase Cloud Messaging (FCM)
- **Autenticación**: JSON Web Tokens (JWT)

## Características del Proyecto
### Características del Paciente
- Recibir notificaciones sobre sus medicamentos en horarios predefinidos.
- Confirmar la toma de medicamentos, generando un registro revisable por el médico.
- Visualizar el historial de tratamientos y recetas.

### Características del Médico
- Registrar pacientes y gestionar sus tratamientos.
- Crear y gestionar recetas médicas, definiendo medicamentos, dosis y frecuencia.
- Visualizar un tablero con el estado de los tratamientos y la adherencia de los pacientes.

## Requisitos para Ejecutar el Proyecto
1. **Node.js** v14+ y **npm** instalados en el sistema.
2. **MongoDB** corriendo en local o configurado a través de un contenedor Docker.
3. **Xcode** instalado para desarrollar y probar la app iOS.

## Instrucciones para Configurar el Proyecto
### Backend (Node.js/Express)
1. **Clonar el Repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/medical-reminder-app.git
   cd medical-reminder-app
   ```
2. **Instalar Dependencias**:
   ```bash
   npm install
   ```
3. **Configurar Variables de Entorno**: Crea un archivo `.env` en la raíz del proyecto con los siguientes valores:
   ```env
   MONGO_URI=mongodb://mongo:27017/medical_reminders_db
   JWT_SECRET=your_secret_key_here
   PORT=5002
   ```
4. **Ejecutar el Servidor**:
   ```bash
   npm run dev
   ```

### Frontend (App iOS)
1. **Abrir Xcode** y abrir el proyecto de iOS.
2. **Configurar Firebase para Notificaciones Push** si está habilitado.
3. **Probar la Aplicación** en un simulador o dispositivo físico.

## Uso de Docker
Este proyecto está configurado para ser ejecutado con **Docker**.

1. **Construir e Iniciar los Contenedores**:
   ```bash
   docker-compose up --build
   ```
   Esto creará dos contenedores: uno para MongoDB y otro para la API.

2. **Detener los Contenedores**:
   ```bash
   docker-compose down
   ```

## Endpoints Principales
- **Autenticación**:
  - `POST /api/auth/register`: Registrar un usuario (paciente o médico).
  - `POST /api/auth/login`: Iniciar sesión.
- **Pacientes**:
  - `POST /api/patients`: Registrar un paciente (solo médicos).
  - `GET /api/patients/:dui`: Obtener información de un paciente.
  - `PUT /api/patients/:dui`: Actualizar información de un paciente (solo médicos).
  - `DELETE /api/patients/:dui`: Eliminar un paciente (solo médicos).
- **Recetas**:
  - `POST /api/patients/:dui/prescriptions`: Agregar una receta a un paciente (solo médicos).
  - `GET /api/patients/:dui/prescriptions`: Obtener las recetas de un paciente.

## Contribuciones
Las contribuciones son bienvenidas. Puedes crear un **pull request** o abrir un **issue** en GitHub.

1. **Fork** el repositorio.
2. Crea tu rama de característica (`git checkout -b feature/nueva-funcionalidad`).
3. **Commit** tus cambios (`git commit -m 'Agregar nueva funcionalidad'`).
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un **pull request**.

## Licencia
Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## Contacto
Si tienes preguntas o sugerencias, no dudes en contactarme:
- **Email**: tu-email@ejemplo.com
- **GitHub**: [tu-usuario](https://github.com/tu-usuario)

