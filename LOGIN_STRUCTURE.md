# Estructura del Proyecto - Lógica de Inicio de Sesión

```
enigma-chat/
├── .env.example              # Plantilla para variables de entorno
│   ├── VITE_API_BASE_URL     # URL base de la API
│   └── VITE_APP_ENV          # Entorno de la aplicación (development/production)
├── src/
│   ├── scripts/
│   │   ├── services/
│   │   │   └── authService.js  # Servicio de autenticación (login, registro, 2FA)
│   │   └── ui/
│   │       └── pages/
│   │           ├── Login.js   # Página de inicio de sesión
│   │           ├── verify-2fa.js  # Verificación de doble factor
│   │           └── setup-2fa.js   # Configuración de 2FA
│   └── styles/
│       └── pages/
│           └── 2fa/
│               └── 2fa.css    # Estilos para flujos de autenticación
├── public/
│   └── two-factor-authentication-login.html  # Página HTML para verificación 2FA
├── two-factor-authentication.html  # Configuración de 2FA
├── messages.html            # Página principal después del login
└── vercel.json              # Configuración de rutas para Vercel
```

## Descripción de Archivos Clave

### Servicio de Autenticación (`authService.js`)
- Maneja todas las llamadas a la API relacionadas con autenticación
- Incluye métodos para:
  - Inicio de sesión
  - Registro de usuarios
  - Verificación de 2FA
  - Configuración de 2FA
  - Gestión de tokens y sesiones

### Páginas de Autenticación
- `Login.js`: Formulario de inicio de sesión y registro
- `verify-2fa.js`: Lógica para verificación de doble factor
- `setup-2fa.js`: Configuración inicial del doble factor

### Configuración de Vercel (`vercel.json`)
- Define las rutas y redirecciones
- Maneja el enrutamiento del SPA
- Configuración para el manejo de rutas con y sin extensión .html

### Variables de Entorno (`.env.example`)
- `VITE_API_BASE_URL`: URL base de la API de autenticación
- `VITE_APP_ENV`: Define el entorno actual (development/production)
- `VITE_WS_URL`: URL para conexiones WebSocket (si aplica)

## Flujo de Autenticación

1. **Inicio de Sesión**
   - Usuario ingresa credenciales
   - Si el 2FA está habilitado, redirige a verificación
   - Si no, redirige al dashboard

2. **Verificación 2FA**
   - Usuario ingresa código de 6 dígitos
   - Se valida con el servidor
   - Al éxito, se guarda el token y redirige al dashboard

3. **Configuración 2FA**
   - Para nuevos usuarios o configuración inicial
   - Muestra código QR para escanear con app autenticadora
   - Valida el primer código antes de activar 2FA
