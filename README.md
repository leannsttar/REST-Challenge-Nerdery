# Store App API 🚀

Una API RESTful para gestión de usuarios y autenticación, construida con Node.js, Express, TypeScript y PostgreSQL. Este proyecto implementa las mejores prácticas de seguridad, arquitectura modular y validación de datos.

## 🛠️ Tech Stack

- **Runtime:** Node.js (v22.13.0)
- **Framework:** Express
- **Lenguaje:** TypeScript
- **ORM:** Prisma
- **Base de Datos:** PostgreSQL 17
- **Contenedor:** Docker & Docker Compose
- **Validación:** Class Validator & Class Transformer
- **Seguridad:** BCrypt & JWT

## 📂 Estructura del Proyecto

La arquitectura está diseñada para ser modular y escalable:

```bash
src/
├── controllers/  
├── services/     
├── middlewares/  
├── dtos/         
├── types/        
├── routes/       
├── utils/        
└── app.ts        
```

## 📋 Requisitos Previos

- [Node.js](https://nodejs.org/) (v22.13.0 o superior)
- [Docker Desktop](https://www.docker.com/) (Requerido para la base de datos)
- [Git](https://git-scm.com/)

---

## 🚀 Guía de Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone "https://github.com/leannsttar/REST-Challenge-Nerdery"
cd REST-Challenge-Nerdery
```

### 2. Configurar Variables de Entorno

Copia el archivo de ejemplo para crear tu configuración local:

```bash
cp .env.example .env
```


Asegúrate de que tu `DATABASE_URL` en el `.env` apunte al puerto correcto:

```env
# Fíjate en el puerto 5434
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/app_db"

JWT_SECRET="tusecretoseguro"
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Levantar la Base de Datos (Docker)

No necesitas instalar Postgres manualmente. Levanta el contenedor con la configuración del proyecto:

```bash
docker-compose up -d
```



### 5. Sincronizar Base de Datos y Seed

Una vez que el contenedor esté corriendo, inicializa la base de datos y carga los datos de prueba:

```bash
# 1. Crear las tablas
npx prisma migrate dev

# 2. Poblar con usuarios de prueba
npx prisma db seed
```

**Usuarios de prueba generados (Password: `123456`):**

| Nombre | Email | Rol |
| :--- | :--- | :--- |
| Lelouch Vi Britannia | `lelouch@gmail.com` | **ADMIN** |
| Edward Elric | `edward@gmail.com` | **CLIENT** |
| Kenzo Tenma | `tenma@gmail.com` | **CLIENT** |

## 📡 Endpoints de la API

Base URL: `http://localhost:3000/api/v1/auth`

| Método | Endpoint | Descripción | Body Requerido (JSON) | Auth Header |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/signup` | Registrar un nuevo usuario | `{ "email": "...", "password": "...", "name": "..." }` | ❌ No |
| `POST` | `/signin` | Iniciar sesión y obtener Token | `{ "email": "...", "password": "..." }` | ❌ No |
| `POST` | `/signout` | Cerrar sesión (Revocar Token) | N/A | ✅ Bearer Token |
| `POST` | `/forgot-password` | Solicitar link de recuperación | `{ "email": "..." }` | ❌ No |
| `POST` | `/reset-password` | Establecer nueva contraseña | `{ "token": "...", "newPassword": "..." }` | ❌ No |

---

## ⚡ Ejecutar la Aplicación

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

El servidor iniciará en `http://localhost:3000`.

---

## ✨ Mejoras y Refactorización (Changelog)

Durante el desarrollo de este reto, se realizaron varias mejoras clave respecto a una implementación base para asegurar calidad y seguridad:

### 🔒 Seguridad
- **Password Hashing:** Se implementó `bcrypt` para no guardar contraseñas en texto plano.
- **DTO Safety:** Se eliminó el decorador `@Expose()` del campo password en los DTOs de respuesta para evitar fugas de información sensible.
- **Role Protection:** Se eliminó el campo `role` del DTO de registro (`signup`) para prevenir escalada de privilegios (nadie puede registrarse como ADMIN directamente).

### 🏗️ Arquitectura y Código (DRY)
- **Validación Modular:** Se creó un utilitario genérico de validación para evitar repetir bloques `try/catch` y lógica de `class-validator` en cada controlador.
- **Global Error Handling:** Implementación de un Middleware de Errores centralizado.
- **Custom Types:** Definición de `AuthenticatedRequest` en `/types` para extender la interfaz de Express de manera segura.

### 🛠️ Funcionalidad y Estándares
- **HTTP Status Codes:** Corrección de códigos de estado (ej. usar `201 Created` en lugar de `200 OK` para registros exitosos).
- **Email Mocking:** Simulación del servicio de envío de correos (vía `console.log`) para el flujo de recuperación de contraseña.
- **Validaciones Extra:** Reglas más estrictas en los DTOs para asegurar la integridad de los datos de entrada.