# 🛡️ Backend IoT Security System

Bienvenido al repositorio del **Backend IoT Security System**. Este proyecto es una solución robusta y escalable construida con **NestJS** para gestionar, analizar y alertar sobre datos provenientes de sensores IoT en tiempo real. Integra inteligencia artificial avanzada mediante **Google Gemini** y notificaciones SMS a través de **Twilio**.

---

## 🚀 Características Principales

- **Gestión de Sensores**: Recepción y almacenamiento de datos de temperatura, humedad, niveles de gas y detección de presencia.
- **Análisis Inteligente (AI)**: Integración con **Google Gemini 2.5 Pro** para analizar patrones de datos y determinar niveles de amenaza o anomalías en el entorno.
- **Sistema de Alertas**: Notificaciones inmediatas vía SMS utilizando **Twilio** en casos de emergencia o detección de intrusos.
- **Base de Datos Relacional**: Persistencia de datos histórica y fiable utilizando **PostgreSQL** y **TypeORM**.
- **API RESTful**: Endpoints bien definidos para la interacción con dispositivos IoT y clientes frontend.
- **Validación de Datos**: Aseguramiento de la integridad de los datos entrantes mediante DTOs y validaciones estrictas.

---

## 🛠️ Tecnologías Utilizadas

Este proyecto ha sido desarrollado utilizando las siguientes tecnologías y librerías:

- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Base de Datos**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [TypeORM](https://typeorm.io/)
- **Inteligencia Artificial**: [Google Generative AI (Gemini)](https://ai.google.dev/)
- **Notificaciones**: [Twilio](https://www.twilio.com/)
- **Validación**: `class-validator`, `class-transformer`

---

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu entorno local:

- [Node.js](https://nodejs.org/) (v18 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (Base de datos corriendo)

---

## ⚙️ Instalación y Configuración

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd backend-iot-esp
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crea un archivo `.env` en la raíz del proyecto basándote en las necesidades del sistema. Asegúrate de incluir las siguientes variables:

   ```env
   # Configuración de Base de Datos (Ejemplo)
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=usuario
   DB_PASSWORD=contraseña
   DB_DATABASE=nombre_base_datos

   # Google Gemini AI
   GEMINI_API_KEY=tu_api_key_de_gemini

   # Twilio
   TWILIO_ACCOUNT_SID=tu_account_sid
   TWILIO_AUTH_TOKEN=tu_auth_token
   TWILIO_SENDER_NUMBER=tu_numero_twilio
   MY_PHONE_NUMBER=tu_numero_personal
   ```

---

## ▶️ Ejecución

Para levantar el servidor en modo de desarrollo:

```bash
# Desarrollo (con watch mode)
npm run start:dev

# Producción
npm run start:prod
```

El servidor se iniciará por defecto en el puerto **3000**.

---

## 📡 Documentación de la API

### Lecturas de Sensores

#### 1. Crear una nueva lectura
Registra los datos capturados por los sensores.

- **Endpoint**: `POST /lecturas`
- **Body (JSON)**:
  ```json
  {
    "temperatura": 25.5,
    "humedad": 60,
    "nivel_gas": 120,
    "presencia": true,
    "estado_alerta": "NORMAL",
    "musica_sonando": "Jazz Suave" // Opcional
  }
  ```
- **Estados de Alerta Soportados**: `NORMAL`, `ADVERTENCIA`, `PELIGRO`, `POLICIA`.

#### 2. Obtener todas las lecturas
Recupera el historial completo de lecturas almacenadas.

- **Endpoint**: `GET /lecturas`

#### 3. Verificar Estado y Analizar (AI)
Obtiene la última lectura y solicita un análisis de seguridad a Google Gemini.

- **Endpoint**: `GET /lecturas/estado`
- **Respuesta**: Devuelve el análisis de la IA sobre la situación actual basada en los últimos datos.

---

## 📂 Estructura del Proyecto

```
src/
├── app.controlador.ts    # Controlador principal
├── app.modulo.ts         # Módulo raíz
├── main.ts               # Punto de entrada de la aplicación
└── sensor/               # Módulo de Sensores
    ├── dto/              # Objetos de Transferencia de Datos (DTOs)
    ├── entidades/        # Entidades de Base de Datos (TypeORM)
    ├── sensor.controlador.ts # Endpoints de la API
    ├── sensor.servicio.ts    # Lógica de negocio
    ├── gemini.servicio.ts    # Integración con Google Gemini
    └── twilio.servicio.ts    # Integración con Twilio
```

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request para mejoras y correcciones.

---

**Desarrollado para el Proyecto Final de Robótica II - COM520**
