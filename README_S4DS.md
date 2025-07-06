# S4DS Nodes para n8n

Este paquete de nodos personalizados para n8n proporciona integración completa con las APIs de S4DS, incluyendo autenticación y operaciones de ejemplo.

## Nodos Incluidos

### 1. S4DS Authentication
Nodo principal para autenticación con las APIs de S4DS.

**Características:**
- Generación de tokens Bearer
- Validación de tokens existentes
- Soporte para múltiples ambientes (Test, UAT, Production)
- Soporte para múltiples clientes (Demo, Cliente 1, Cliente 2)
- Almacenamiento automático de tokens en contexto del workflow
- Gestión de expiración de tokens

**Operaciones:**
- **Generate Token**: Genera un nuevo token de autenticación
- **Validate Token**: Valida un token existente

### 2. S4DS Example
Nodo de ejemplo que demuestra cómo usar el token de autenticación.

**Características:**
- Consume tokens del contexto del workflow
- Soporte para tokens personalizados
- Verificación automática de expiración
- Operaciones de ejemplo con la API

**Operaciones:**
- **Get Product Count**: Obtiene la cantidad total de productos

## Instalación

1. Clone este repositorio
2. Instale las dependencias:
   ```bash
   npm install
   ```
3. Compile el proyecto:
   ```bash
   npm run build
   ```
4. Instale el paquete en n8n:
   ```bash
   npm install -g .
   ```

## Configuración

### Credenciales S4DS API

Configure las credenciales de S4DS API en n8n:

1. Vaya a **Settings** → **Credentials**
2. Haga clic en **Add Credential**
3. Seleccione **S4DS API**
4. Configure:
   - **Base URL**: Seleccione el ambiente y cliente
   - **Custom Base URL**: Para URLs personalizadas
   - **Timeout**: Tiempo de espera para peticiones

### URLs Disponibles

#### Demo
- **Test**: `https://demotest.s4ds.com/demoapi-test`
- **UAT**: `https://demouat.s4ds.com/demoapi-uat`
- **Production**: `https://demoprod.s4ds.com/demoapi-prod`

#### Cliente 1
- **Test**: `https://cliente1test.s4ds.com/cliente1api-test`
- **UAT**: `https://cliente1uat.s4ds.com/cliente1api-uat`
- **Production**: `https://cliente1prod.s4ds.com/cliente1api-prod`

#### Cliente 2
- **Test**: `https://cliente2test.s4ds.com/cliente2api-test`
- **UAT**: `https://cliente2uat.s4ds.com/cliente2api-uat`
- **Production**: `https://cliente2prod.s4ds.com/cliente2api-prod`

## Uso

### Workflow Básico

1. **Configurar Credenciales**:
   - Configure las credenciales de S4DS API con usuario, contraseña y ambiente
   - Agregue el nodo **S4DS Authentication**
   - Configure la operación "Generate Token"

2. **Usar el Token**:
   - Agregue el nodo **S4DS Example** o **HTTP Request**
   - Configure para usar el token del contexto
   - Ejecute las operaciones deseadas

### Ejemplo de Workflow

```
[S4DS Auth: Generate Token] → [S4DS Example: Get User Profile] → [Process Data]
```

### Acceso al Token

El token se almacena automáticamente en el contexto del workflow y puede ser accedido usando:

```javascript
{{ $context.s4ds_token }}
```

O con clave personalizada:

```javascript
{{ $context.your_custom_key }}
```

## Estructura del Token

El token se almacena con la siguiente estructura:

```json
{
  "token": "8a6c71b3-fa62-434d-8b38-907de24c3176",
  "token_type": "Bearer",
  "expires_in": 3600,
  "expires_at": "2024-01-01T12:00:00.000Z"
}
```

## Manejo de Errores

Los nodos manejan automáticamente:
- Errores de autenticación
- Tokens expirados
- Errores de red
- Timeouts
- Respuestas malformadas

## Desarrollo

### Estructura del Proyecto

```
n8n-nodes-starter-s4ds/
├── nodes/
│   ├── S4DSAuth/           # Nodo de autenticación
│   ├── S4DSExample/        # Nodo de ejemplo
│   └── ...
├── credentials/
│   └── S4DSApi.credentials.ts
├── package.json
└── index.js
```

### Comandos de Desarrollo

```bash
# Compilar
npm run build

# Desarrollo con watch
npm run dev

# Linting
npm run lint

# Formatear código
npm run format
```

## Contribución

1. Fork el repositorio
2. Cree una rama para su feature
3. Haga commit de sus cambios
4. Push a la rama
5. Abra un Pull Request

## Licencia

MIT License - vea el archivo LICENSE para más detalles. 