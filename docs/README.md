# StockFlow - Documentación Técnica

## 📋 Descripción del Proyecto

**StockFlow** es un sistema de gestión de inventario full-stack construido con el stack MERN (MongoDB, Express, React, Node.js). Permite gestionar productos, rastrear inventario, procesar órdenes y analizar transacciones.

---

## 🏗️ Arquitectura

| Tipo | Descripción |
|------|-------------|
| **Patrón Arquitectónico** | MVC (Model-View-Controller) |
| **Tipo de Arquitectura** | Cliente-Servidor de 3 Capas |
| **Base de Datos** | NoSQL (MongoDB) |

### Capas de la Arquitectura

1. **Capa de Presentación (Frontend)**: React con TailwindCSS
2. **Capa de Lógica de Negocio (Backend)**: Node.js + Express.js
3. **Capa de Datos**: MongoDB con Mongoose ODM

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 18.x | Librería UI |
| TailwindCSS | 3.4 | Framework CSS |
| React Router | 6.x | Navegación SPA |
| Axios | 1.x | Cliente HTTP |
| Chart.js | 4.x | Visualización de datos |

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | 18+ | Runtime JavaScript |
| Express.js | 4.x | Framework web |
| Mongoose | 8.x | ODM para MongoDB |
| JWT | 9.x | Autenticación |
| bcryptjs | 3.x | Encriptación passwords |
| express-validator | 7.x | Validación de datos |

### Base de Datos
| Tecnología | Tipo | Propósito |
|------------|------|-----------|
| MongoDB | NoSQL/Documentos | Almacenamiento de datos |

---

## 📁 Estructura del Proyecto

```
StockFlow/
├── backend/
│   ├── config/          # Configuración de BD
│   ├── controllers/     # Controladores (lógica de negocio)
│   ├── middleware/      # Autenticación y validación
│   ├── models/          # Esquemas Mongoose
│   ├── routes/          # Rutas API REST
│   └── index.js         # Punto de entrada
├── frontend/
│   └── src/
│       ├── components/  # Componentes reutilizables
│       ├── pages/       # Páginas de la aplicación
│       └── services/    # Capa de comunicación API
└── docs/                # Documentación y diagramas
```

---

## 🔐 Características de Seguridad

- **Autenticación JWT**: Tokens firmados con expiración configurable
- **Hashing de Contraseñas**: bcrypt con salt de 10 rondas
- **Control de Acceso por Roles**: Admin, Manager, Staff
- **Validación de Entradas**: express-validator en todas las rutas

---

