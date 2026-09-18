# Food Rescat - Documentación del Frontend

Guía técnica para el equipo de backend. Describe cómo el frontend funciona, qué consume, qué格式 espera y cómo fluye la información entre las partes.

---

## 1. Descripción General

**Food Rescat** es una plataforma de rescate de alimentos que conecta comercios (restaurantes, panaderías, etc.) con clientes que pueden adquirir paquetes de alimentos a descuento o donarlos.

- **Framework**: Angular 21.2 (arquitectura standalone, sin NgModules)
- **Estilo**: Tailwind CSS v4
- **Estado**: Angular Signals (sin librería externa de state management)
- **Moneda**: Quetzales (Q) - Guatemala

---

## 2. Conexión con el Backend

### URL base

Todas las peticiones HTTP pasan por `ApiService` (`src/app/core/services/api.service.ts`), que antepone la URL base a cada ruta:

| Entorno | URL base | Archivo |
|---------|----------|---------|
| Desarrollo | `/api` | `src/environments/environment.ts` |
| Producción | `https://API_BACKEND_PENDIENTE/api` | `src/environments/environment.prod.ts` |

> **Nota**: `API_BACKEND_PENDIENTE` es un placeholder. Debe reemplazarse con la URL real del backend antes de producción.

### Proxy en desarrollo

En `proxy.conf.json`, todas las peticiones a `/api` se redirigen al backend:

```json
{
  "/api": {
    "target": "https://API_BACKEND_PENDIENTE",
    "secure": false,
    "changeOrigin": true
  }
}
```

Esto significa que en desarrollo, el frontend llama a `http://localhost:4200/api/...` y el proxy las redirige al backend.

---

## 3. Autenticación

### Estrategia de token

- **Tipo**: JWT Bearer Token
- **Almacenamiento**: `localStorage` con key `access_token`
- **Envío automático**: El interceptor `auth.interceptor.ts` agrega `Authorization: Bearer <token>` a todas las peticiones HTTP, excepto a `/api/auth/login` y `/api/auth/register`.

### flujo de Login

```
POST /api/auth/login
Body: { email, password }
Response: { accessToken, usuario }
```

1. El frontend envía credenciales al endpoint.
2. El backend retorna `accessToken` (JWT) y el objeto `usuario`.
3. El frontend almacena el token en `localStorage` bajo la key `access_token`.
4. Se establece el usuario actual en memoria (Angular Signal).
5. Se redirige según el rol del usuario.

### flujo de Registro

```
POST /api/auth/register
Body: { nombre, email, password, rol }
Response: { accessToken, usuario }
```

Mismo comportamiento que login: se guarda el token, se establece el usuario y se redirige por rol.

### Redirect post-login por rol

| Rol | Ruta destino |
|-----|-------------|
| `CLIENTE` | `/cliente/feed` |
| `COMERCIO` | `/comercio/inicio` |
| `ADMIN` | `/admin` |

### Persistencia de sesión

Al iniciar la aplicación (`app.ts`), el frontend llama a:

```
GET /api/auth/me
Header: Authorization: Bearer <token>
Response: Usuario
```

- Si el token es válido, se carga el usuario y se mantiene la sesión.
- Si falla (401 o token expirado), se ejecuta logout automático: se elimina el token de localStorage y se redirige a `/auth/login`.

### Logout

No se llama a un endpoint. Simplemente se elimina el token de `localStorage`, se limpia el usuario en memoria y se redirige a `/auth/login`.

### Manejo de errores de sesión

El interceptor `http-error.interceptor.ts` detecta respuestas **401** (excepto en login/register) y ejecuta logout automático con el mensaje "Tu sesión expiró. Inicia sesión de nuevo."

---

## 4. Roles y Rutas Protegidas

El sistema tiene 3 roles. Cada uno tiene su propio layout, rutas y guard de protección.

### Guards

- **authGuard**: Verifica que exista un usuario autenticado. Si no, redirige a `/auth/login`.
- **roleGuard**: Verifica que el rol del usuario coincida con el `expectedRole` definido en la ruta. Si no coincide, redirige al usuario a su sección correspondiente.

### Mapa de rutas

| Ruta | Rol requerido | Componente | Descripción |
|------|---------------|------------|-------------|
| `/auth/login` | Ninguno | LoginComponent | Formulario de login |
| `/auth/register` | Ninguno | RegisterComponent | Formulario de registro |
| `/cliente/feed` | CLIENTE | FeedComponent | Listado de paquetes disponibles |
| `/cliente/historial` | CLIENTE | HistorialComponent | Historial de reservas del cliente + valoraciones |
| `/comercio/inicio` | COMERCIO | InicioComponent | Dashboard del comercio con KPIs |
| `/comercio/publicar` | COMERCIO | PublicarComponent | Formulario para publicar un paquete |
| `/comercio/pendientes` | COMERCIO | PendientesComponent | Verificación de código + tabla de entregas pendientes |
| `/comercio/historial` | COMERCIO | HistorialComponent | Historial del comercio (placeholder) |
| `/comercio/sucursales` | COMERCIO | SucursalesComponent | CRUD de sucursales |
| `/admin` | ADMIN | AdminDashboardComponent | Dashboard de administración |

---

## 5. Catálogo de Endpoints

Todos los endpoints usan la URL base `/api`. A continuación se lista cada endpoint, su método HTTP, el body que espera y la respuesta que retorna.

### 5.1 Autenticación

| Método | Endpoint | Body request | Response |
|--------|----------|-------------|----------|
| `POST` | `/auth/login` | `{ email: string, password: string }` | `{ accessToken: string, usuario: Usuario }` |
| `POST` | `/auth/register` | `{ nombre: string, email: string, password: string, rol: string }` | `{ accessToken: string, usuario: Usuario }` |
| `GET` | `/auth/me` | — | `Usuario` |

> Notas:
> - `rol` en register acepta: `"CLIENTE"`, `"COMERCIO"`, `"ADMIN"`
> - El token se envía como `Authorization: Bearer <token>` en el header (excepto en login y register)
> - `GET /auth/me` se usa para validar la sesión al cargar la app y para restaurar el estado del usuario

### 5.2 Paquetes

| Método | Endpoint | Body request | Response |
|--------|----------|-------------|----------|
| `GET` | `/paquetes?ciudad=&categoria=&estado=&skip=&take=` | — | `Paquete[]` |
| `GET` | `/paquetes/{id}` | — | `Paquete` |
| `POST` | `/paquetes` | `PaqueteRequest` | `Paquete` |

> Parámetros de query (todos opcionales):
> - `ciudad`: Filtrar por ciudad de la sucursal
> - `categoria`: Filtrar por nombre de categoría
> - `estado`: Filtrar por estado (`DISPONIBLE`, `RESERVADO`, `RECOGIDO`)
> - `skip`: Offset para paginación
> - `take`: Cantidad de resultados por página

### 5.3 Reservas

| Método | Endpoint | Body request | Response |
|--------|----------|-------------|----------|
| `POST` | `/paquetes/{id}/reservar` | `{}` | `ReservaResponse` |
| `POST` | `/reservas/verificar` | `{ codigoVerificacion: string }` | `Reserva` |
| `PATCH` | `/reserva/{id}/completar` | `{}` | `Reserva` |
| `GET` | `/reservas/pendientes` | — | `Reserva[]` |
| `GET` | `/clientes/me/reservas` | — | `Reserva[]` |

> Notas:
> - `/paquetes/{id}/reservar`: Crea una reserva para el paquete indicado. Retorna la reserva con su código de verificación.
> - `/reservas/verificar`: El comercio envía el código que el cliente presenta (QR o manual). Retorna la reserva verificada.
> - `/reserva/{id}/completar`: Marca la reserva como completada después de la verificación.
> - `/reservas/pendientes`: Reservas pendientes de verificación/completado para el comercio autenticado.
> - `/clientes/me/reservas`: Historial de reservas del cliente autenticado.

### 5.4 Sucursales

| Método | Endpoint | Body request | Response |
|--------|----------|-------------|----------|
| `GET` | `/sucursales` | — | `Sucursal[]` |
| `POST` | `/sucursales` | `SucursalRequest` | `Sucursal` |
| `PUT` | `/sucursales/{id}` | `SucursalRequest` | `Sucursal` |

> Notas:
> - El backend debe filtrar las sucursales según el comercio autenticado.
> - Las sucursales se usan al publicar paquetes y en el feed de clientes.

### 5.5 Favoritos

| Método | Endpoint | Body request | Response |
|--------|----------|-------------|----------|
| `GET` | `/favoritos` | — | `Favorito[]` |
| `POST` | `/favoritos/{sucursalId}` | `{}` | `Favorito` |
| `DELETE` | `/favoritos/{sucursalId}` | — | — |

> Notas:
> - Solo el rol CLIENTE usa favoritos.
> - El frontend usa `DELETE` para eliminar y `POST` para agregar, con la misma ruta `/favoritos/{sucursalId}`.
> - El backend debe filtrar favoritos según el cliente autenticado.

### 5.6 Notificaciones

| Método | Endpoint | Body request | Response |
|--------|----------|-------------|----------|
| `GET` | `/notificaciones` | — | `Notificacion[]` |
| `PATCH` | `/notificaciones/{id}/leido` | `{}` | `Notificacion` |

> Notas:
> - El frontend consulta notificaciones cada 30 segundos (polling).
> - El campo `leido` se actualiza con PATCH cuando el usuario lee la notificación.
> - El frontend calcula el conteo de no leídas localmente con un `computed` signal.

### 5.7 Valoraciones

| Método | Endpoint | Body request | Response |
|--------|----------|-------------|----------|
| `POST` | `/valoraciones` | `ValoracionRequest` | `Valoracion` |
| `GET` | `/valoraciones/reserva/{reservaId}` | — | `Valoracion` |

> Notas:
> - Solo el rol CLIENTE crea valoraciones.
> - `puntuacion` es un número (se asume escala 1-5).
> - `comentario` es opcional.

### 5.8 Categorías

| Método | Endpoint | Body request | Response |
|--------|----------|-------------|----------|
| `GET` | `/categorias` | — | `Categoria[]` |

> Se usa para filtrar paquetes en el feed y para el formulario de publicación.

### 5.9 Estadísticas del Comercio

| Método | Endpoint | Body request | Response |
|--------|----------|-------------|----------|
| `GET` | `/comercios/me/estadisticas/hoy` | — | `EstadisticasHoy` |
| `GET` | `/comercios/me/estadisticas/kpis` | — | `EstadisticasKpis` |

> Ambos endpoints deben retornar estadísticas filtradas por el comercio autenticado.

### 5.10 Estadísticas del Cliente

| Método | Endpoint | Body request | Response |
|--------|----------|-------------|----------|
| `GET` | `/clientes/me/estadisticas` | — | `EstadisticasCliente` |

> Debe retornar las estadísticas del cliente autenticado (total de rescates, kg evitados, total ahorrado).

### 5.11 Administración

| Método | Endpoint | Body request | Response |
|--------|----------|-------------|----------|
| `GET` | `/admin/usuarios` | — | `Usuario[]` |
| `GET` | `/admin/estadisticas` | — | `AdminEstadisticas` |
| `PATCH` | `/admin/usuarios/{id}/suspender` | `{}` | `Usuario` |
| `PATCH` | `/admin/usuarios/{id}/activar` | `{}` | `Usuario` |

> Notas:
> - Solo el rol ADMIN accede a estos endpoints.
> - Suspender/activar cambia el campo `activo` del usuario.
> - `AdminEstadisticas` incluye datos de los últimos 7 días para gráficas.

---

## 6. Modelos de Datos

### Enums

#### Rol
```
CLIENTE | COMERCIO | ADMIN
```

#### EstadoPaquete
```
DISPONIBLE | RESERVADO | RECOGIDO
```

#### EstadoReserva
```
PENDIENTE | COMPLETADA | EXPIRADA | CANCELADA
```

### Interfaces

#### Usuario
```typescript
{
  id: string;
  nombre: string;
  email: string;
  rol: Rol;          // "CLIENTE" | "COMERCIO" | "ADMIN"
  activo?: boolean;  // Solo usado en panel admin
}
```

#### AuthResponse
```typescript
{
  accessToken: string;
  usuario: Usuario;
}
```

#### LoginRequest
```typescript
{
  email: string;
  password: string;
}
```

#### RegisterRequest
```typescript
{
  nombre: string;
  email: string;
  password: string;
  rol: string;  // "CLIENTE" | "COMERCIO" | "ADMIN"
}
```

#### Paquete
```typescript
{
  id: string;
  nombre: string;
  categoria: { id: string; nombre: string } | null;
  sucursal: {
    id: string;
    nombre: string;
    direccion: string;
    ciudad?: string;
  } | null;
  cantidadStock: number;
  horaLimiteRecogida: string;    // ISO date string
  esDonacion: boolean;
  precioOriginal: number | null;
  precioDescuento: number | null;
  pesoEstimadoKg: number;
  estado: EstadoPaquete;         // "DISPONIBLE" | "RESERVADO" | "RECOGIDO"
  urgente: boolean;
  porcentajeDescuento: number | null;
}
```

#### PaqueteRequest (body para crear paquete)
```typescript
{
  producto: string;
  categoriaId: string;
  sucursalId: string;
  cantidadStock: number;
  horaLimiteRecogida: string;    // ISO date string
  esDonacion: boolean;
  precioOriginal?: number;
  precioDescuento?: number;
  pesoEstimadoKg: number;
}
```

#### Reserva
```typescript
{
  id: string;
  codigoVerificacion: string;
  estado: EstadoReserva;         // "PENDIENTE" | "COMPLETADA" | "EXPIRADA" | "CANCELADA"
  clienteId: string;
  clienteNombre?: string;
  paqueteId: string;
  paqueteNombre?: string;
  sucursalId: string;
  sucursalNombre?: string;
  sucursalCiudad?: string;
  sucursalDireccion?: string;
  horaLimiteRecogida?: string;   // ISO date string
  createdAt?: string;            // ISO date string
  completadaEn?: string;         // ISO date string
  valorada?: boolean;
}
```

#### ReservaResponse
```typescript
{
  reserva: Reserva;
  mensaje?: string;
}
```

#### Sucursal
```typescript
{
  id: string;
  comercioId: string;
  nombreSucursal: string;
  direccion: string;
  latitud: number;
  longitud: number;
}
```

#### SucursalRequest (body para crear/actualizar sucursal)
```typescript
{
  nombreSucursal: string;
  direccion: string;
  latitud: number;    // -90 a 90
  longitud: number;   // -180 a 180
}
```

#### Notificacion
```typescript
{
  id: string;
  tipo: string;
  mensaje: string;
  leido: boolean;
  createdAt: string;  // ISO date string
}
```

#### Favorito
```typescript
{
  id: string;
  sucursal: Sucursal;
}
```

#### Valoracion
```typescript
{
  id: string;
  reservaId: string;
  clienteId: string;
  sucursalId: string;
  puntuacion: number;    // Se asume escala 1-5
  comentario?: string;
  createdAt: string;     // ISO date string
}
```

#### ValoracionRequest (body para crear valoración)
```typescript
{
  reservaId: string;
  puntuacion: number;
  comentario?: string;
}
```

#### Categoria
```typescript
{
  id: string;
  nombre: string;
}
```

#### EstadisticasHoy (comercio)
```typescript
{
  kgRescatadosHoy: number;
  pedidosCompletadosHoy: number;
  ingresosHoy: number;
}
```

#### EstadisticasKpis (comercio)
```typescript
{
  paquetesActivos: number;
  pendientesHoy: number;
  kgRescatadosHoy: number;
  ingresosSemana: number;
}
```

#### EstadisticasCliente
```typescript
{
  totalRescates: number;
  kgEvitados: number;
  totalAhorrado: number;
}
```

#### AdminEstadisticas
```typescript
{
  totalUsuarios: number;
  totalComercios: number;
  totalRescates: number;
  totalKgRescatados: number;
  rescatadosUltimos7Dias: RescateDiario[];
}

// Donde:
RescateDiario = {
  fecha: string;   // ISO date string
  kg: number;
}
```

---

## 7. Flujos de Negocio

### 7.1 Registro de usuario

```
1. Usuario completa formulario: nombre, email, password, rol
2. POST /auth/register con RegisterRequest
3. Backend retorna AuthResponse (accessToken + usuario)
4. Frontend guarda token en localStorage y establece usuario en memoria
5. Redirección automática según rol:
   - CLIENTE → /cliente/feed
   - COMERCIO → /comercio/inicio
   - ADMIN → /admin
```

### 7.2 Login de usuario

```
1. Usuario ingresa email y password
2. POST /auth/login con LoginRequest
3. Backend retorna AuthResponse (accessToken + usuario)
4. Frontend guarda token en localStorage y establece usuario en memoria
5. Redirección automática según rol (mismo esquema que registro)
```

### 7.3 Publicación de paquete (Comercio)

```
1. Comercio ingresa a /comercio/publicar
2. Frontend carga categorías: GET /categorias
3. Frontend carga sucursales del comercio: GET /sucursales
4. Comercio completa formulario: producto, categoría, sucursal, stock,
   hora límite, si es donación, precios, peso
5. POST /paquetes con PaqueteRequest
6. Backend crea el paquete con estado DISPONIBLE
7. Frontend agrega el paquete a la lista local y redirige a /comercio/inicio
```

### 7.4 Reserva de paquete (Cliente)

```
1. Cliente navega a /cliente/feed
2. Frontend carga paquetes: GET /paquetes?estado=DISPONIBLE
3. Frontend carga categorías para filtro: GET /categorias
4. Cliente selecciona un paquete y presiona "Rescatar"
5. POST /paquetes/{id}/reservar con body vacío {}
6. Backend crea reserva con código de verificación único
7. Backend retorna ReservaResponse { reserva, mensaje }
8. Frontend muestra modal con código QR generado a partir del codigoVerificacion
```

### 7.5 Verificación y completado (Comercio)

```
1. Comercio ingresa a /comercio/pendientes
2. Frontend carga reservas pendientes: GET /reservas/pendientes
3. Cliente presenta código QR o numérico al comercio
4. Comercio ingresa el código en el campo de verificación
5. POST /reservas/verificar con { codigoVerificacion }
6. Backend valida el código y retorna la Reserva verificada
7. Frontend muestra resultado y solicita confirmación
8. PATCH /reserva/{id}/completar con body vacío {}
9. Backend marca la reserva como COMPLETADA
10. Frontend actualiza la lista de pendientes
```

### 7.6 Valoración de reserva (Cliente)

```
1. Cliente navega a /cliente/historial
2. Frontend carga reservas: GET /clientes/me/reservas
3. Para cada reserva completada, se verifica si ya tiene valoración:
   GET /valoraciones/reserva/{reservaId}
4. Si no tiene valoración, cliente puede calificar:
   POST /valoraciones con { reservaId, puntuacion, comentario? }
5. Backend crea la valoración y retorna Valoracion
6. Frontend actualiza la UI para mostrar que ya está valorada
```

### 7.7 Gestión de favoritos (Cliente)

```
1. Cliente visualiza sucursales en el feed
2. GET /favoritos carga los favoritos del cliente
3. Cliente presiona botón de favorito en una sucursal
4. Si NO es favorito: POST /favoritos/{sucursalId}
5. Si YA es favorito: DELETE /favoritos/{sucursalId}
6. Frontend actualiza la lista local de favoritos
```

### 7.8 Persistencia de sesión

```
1. Al cargar la aplicación (app.component.ngOnInit):
   a. Se verifica si existe token en localStorage (key: access_token)
   b. Si NO existe: sesión no autenticada, usuario permanece null
   c. Si existe: GET /auth/me con header Authorization: Bearer <token>
2. Si /auth/me responde exitosamente: se establece el usuario en memoria
3. Si /auth/me falla (401, token expirado): se ejecuta logout automático
   - Se elimina token de localStorage
   - Se redirige a /auth/login
```

### 7.9 Polling de actualizaciones

El frontend realiza polling periódico para mantener datos actualizados:

| Componente | Intervalo | Endpoint consultado |
|------------|-----------|---------------------|
| Feed (cliente) | Cada 30 segundos | `GET /paquetes` |
| Layout del cliente | Cada 30 segundos | `GET /notificaciones` |

---

## 8. Resumen de Endpoints por Rol

### CLIENTE (10 endpoints)
```
POST   /auth/login
POST   /auth/register
GET    /auth/me
GET    /paquetes
GET    /paquetes/{id}
POST   /paquetes/{id}/reservar
GET    /clientes/me/reservas
GET    /categorias
GET    /favoritos
POST   /favoritos/{sucursalId}
DELETE /favoritos/{sucursalId}
GET    /notificaciones
PATCH  /notificaciones/{id}/leido
POST   /valoraciones
GET    /valoraciones/reserva/{reservaId}
GET    /clientes/me/estadisticas
```

### COMERCIO (10 endpoints)
```
POST   /auth/login
POST   /auth/register
GET    /auth/me
GET    /sucursales
POST   /sucursales
PUT    /sucursales/{id}
POST   /paquetes
GET    /paquetes
GET    /reservas/pendientes
POST   /reservas/verificar
PATCH  /reserva/{id}/completar
GET    /comercios/me/estadisticas/hoy
GET    /comercios/me/estadisticas/kpis
GET    /categorias
GET    /notificaciones
PATCH  /notificaciones/{id}/leido
```

### ADMIN (6 endpoints)
```
POST   /auth/login
POST   /auth/register
GET    /auth/me
GET    /admin/usuarios
GET    /admin/estadisticas
PATCH  /admin/usuarios/{id}/suspender
PATCH  /admin/usuarios/{id}/activar
```

---

## 9. Manejo de Errores del Backend

El frontend espera que los errores del backend sigan este formato:

```json
{
  "mensaje": "Descripción del error en español"
}
```

O alternativamente:

```json
{
  "message": "Error description"
}
```

Si el backend no retorna ninguno de esos campos, el frontend usa mensajes predeterminados según el código de estado:

| Código HTTP | Mensaje predeterminado |
|-------------|----------------------|
| 400 | Solicitud inválida. Revisa los datos. |
| 401 | No autorizado. |
| 403 | No tienes permiso para realizar esta acción. |
| 404 | El recurso solicitado no existe. |
| 409 | El registro ya existe. |
| 500 | Error interno del servidor. Intentar de nuevo. |

**Excepción**: Los códigos 401 en `/auth/login` y `/auth/register` no pasan por el interceptor de errores para permitir que el componente maneje el error de credenciales inválidas de forma específica.

---

## 10. Configuración del Backend Requerida

Para que el frontend funcione correctamente, el backend debe:

1. **Implementar los 22 endpoints** listados en la sección 5
2. **Aceptar y validar JWT Bearer tokens** en el header `Authorization`
3. **Retornar errores en formato** `{ "mensaje": string }` o `{ "message": string }`
4. **Retornar códigos HTTP apropiados**: 200 (éxito), 201 (creado), 400 (bad request), 401 (no autenticado), 403 (no autorizado), 404 (no encontrado), 409 (conflicto), 500 (error interno)
5. **Filtrar datos según el usuario autenticado**: sucursales del comercio, reservas del cliente, notificaciones del usuario, etc.
6. **Soportar query params** en `GET /paquetes`: `ciudad`, `categoria`, `estado`, `skip`, `take`
