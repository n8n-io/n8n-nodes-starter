# S4DS Authentication Node

Este nodo permite autenticarse con las APIs de S4DS y gestionar tokens de acceso.

## Características

- **Generación de tokens**: Autenticación con usuario y contraseña
- **Validación de tokens**: Verificar si un token es válido
- **Múltiples ambientes**: Soporte para Test, UAT y Production
- **Múltiples clientes**: Configuración para diferentes clientes (Demo, Cliente 1, Cliente 2)
- **Gestión de contexto**: Almacenamiento automático de tokens para uso en otros nodos

## Configuración

### Credenciales

1. Configure las credenciales de S4DS API:
   - **Base URL**: Seleccione el ambiente y cliente correspondiente
   - **Username**: Nombre de usuario para autenticación
   - **Password**: Contraseña para autenticación
   - **Custom Base URL**: Para URLs personalizadas
   - **Timeout**: Tiempo de espera para las peticiones (ms)

### Operaciones

#### Generate Token

Genera un token de autenticación usando las credenciales configuradas.

**Parámetros opcionales:**
- **Store Token in Context**: Almacenar token en el contexto del workflow
- **Token Context Key**: Clave para almacenar el token (por defecto: `s4ds_token`)

**Parámetros opcionales:**
- **Store Token in Context**: Almacenar token en el contexto del workflow
- **Token Context Key**: Clave para almacenar el token (por defecto: `s4ds_token`)

**Respuesta:**
```json
{
  "token_type": "Bearer",
  "expires_in": 3600,
  "token": "8a6c71b3-fa62-434d-8b38-907de24c3176"
}
```

#### Validate Token

Valida si un token existente es válido.

**Parámetros requeridos:**
- **Token**: Token a validar

## Uso en Workflows

### Flujo básico de autenticación

1. Configure el nodo **S4DS Auth** con la operación "Generate Token"
2. Configure las credenciales y parámetros de autenticación
3. El token se almacenará automáticamente en el contexto del workflow
4. Use el token en otros nodos de API S4DS

### Acceso al token desde otros nodos

El token se almacena en el contexto del workflow y puede ser accedido usando:

```
{{ $context.s4ds_token }}
```

O si configuró una clave personalizada:

```
{{ $context.your_custom_key }}
```

## URLs de API

### Demo
- **Test**: `https://demotest.s4ds.com/demoapi-test`
- **UAT**: `https://demouat.s4ds.com/demoapi-uat`
- **Production**: `https://demoprod.s4ds.com/demoapi-prod`

### Cliente 1
- **Test**: `https://cliente1test.s4ds.com/cliente1api-test`
- **UAT**: `https://cliente1uat.s4ds.com/cliente1api-uat`
- **Production**: `https://cliente1prod.s4ds.com/cliente1api-prod`

### Cliente 2
- **Test**: `https://cliente2test.s4ds.com/cliente2api-test`
- **UAT**: `https://cliente2uat.s4ds.com/cliente2api-uat`
- **Production**: `https://cliente2prod.s4ds.com/cliente2api-prod`

## Manejo de Errores

El nodo maneja automáticamente:
- Errores de autenticación (credenciales inválidas)
- Errores de red y timeout
- Tokens expirados
- Errores de formato de respuesta

## Ejemplo de Workflow

```
[S4DS Auth: Generate Token] → [HTTP Request: API Call] → [Process Data]
```

En el nodo HTTP Request, configure el header de autorización:
```
Authorization: Bearer {{ $context.s4ds_token }}
``` 