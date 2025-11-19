# NovaLearn LMS - Guía de Despliegue con Docker

Esta guía te ayudará a desplegar NovaLearn LMS usando Docker y Docker Compose.

## 📋 Prerrequisitos

- Docker instalado (versión 20.10 o superior)
- Docker Compose instalado (versión 2.0 o superior)
- Acceso a Keycloak (keycloak.vimcashcorp.com)

## ⚙️ Arquitectura de Base de Datos

NovaLearn usa **Neon Database con WebSocket** en todos los ambientes:

- ✅ **WebSocket Support** - Conexión optimizada con `@neondatabase/serverless`
- ✅ **Funciona en Replit** - Conecta a Neon Database a través de WebSocket
- ✅ **Funciona en Docker** - Compatible con Neon Database desde contenedores
- ✅ **Alta disponibilidad** - Pooling de conexiones serverless

### 📝 Requisito Importante
Debes usar una base de datos Neon (no PostgreSQL local) con un `DATABASE_URL` válido que apunte a tu instancia de Neon.

## 🚀 Inicio Rápido con Docker Compose

### 1. Configurar Variables de Entorno

Copia el archivo de ejemplo y configura tus credenciales:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus valores reales:

```env
# Database (usa tu Neon Database URL)
DATABASE_URL=postgresql://user:password@ep-xxxx.us-east-2.aws.neon.tech/novalearn?sslmode=require

# Session Secret (genera uno seguro)
SESSION_SECRET=tu-clave-secreta-muy-segura-cambiala

# Keycloak Configuration
KEYCLOAK_URL=https://keycloak.vimcashcorp.com
KEYCLOAK_REALM=nova-learn
KEYCLOAK_CLIENT_ID=nova-backend
KEYCLOAK_CLIENT_SECRET=tu-secreto-de-keycloak
```

### 2. Iniciar con un Solo Comando

```bash
# Construir e iniciar todos los servicios
docker-compose up -d

# Las migraciones se ejecutan automáticamente ✨
# No necesitas ningún paso adicional!

# Ver los logs para confirmar
docker-compose logs -f novalearn
```

### 3. Acceder a la Aplicación

**¡Las migraciones se ejecutan automáticamente!** 🎉

Cuando el contenedor inicia, el script `docker-entrypoint.sh`:
1. ✅ Espera a que Neon Database esté listo
2. ✅ Ejecuta automáticamente las migraciones (`npm run db:push`)
3. ✅ Inicia la aplicación

No necesitas ejecutar comandos manuales.

La aplicación estará disponible en:
- **NovaLearn LMS**: http://localhost:5000

> **💡 Nota**: El primer inicio puede tomar 30-60 segundos mientras se crean las tablas en tu base de datos Neon.

> **⚠️ Importante**: No uses PostgreSQL local. La aplicación requiere una base de datos Neon con acceso WebSocket.

## 🏗️ Construcción Manual con Dockerfile

Si prefieres usar solo Docker (sin Compose):

### 1. Construir la Imagen

```bash
docker build -t novalearn-lms:latest .
```

### 2. Ejecutar el Contenedor

```bash
docker run -d \
  --name novalearn \
  -p 5000:5000 \
  -e DATABASE_URL="tu-connection-string" \
  -e SESSION_SECRET="tu-session-secret" \
  -e KEYCLOAK_CLIENT_SECRET="tu-keycloak-secret" \
  -v $(pwd)/videos:/app/videos \
  novalearn-lms:latest
```

## 🔧 Comandos Útiles

### Docker Compose

```bash
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (⚠️ ELIMINA DATOS)
docker-compose down -v

# Reconstruir las imágenes
docker-compose build --no-cache

# Ver logs de la aplicación
docker-compose logs -f novalearn

# Acceder al shell del contenedor
docker-compose exec novalearn sh

# Reiniciar la aplicación
docker-compose restart novalearn
```

### Docker

```bash
# Ver contenedores en ejecución
docker ps

# Ver logs del contenedor
docker logs -f novalearn

# Acceder al shell
docker exec -it novalearn sh

# Detener el contenedor
docker stop novalearn

# Eliminar el contenedor
docker rm novalearn

# Eliminar la imagen
docker rmi novalearn-lms:latest
```

## 📦 Estructura de Volúmenes

El docker-compose monta los siguientes volúmenes:

- `./videos`: Directorio para almacenar videos de lecciones (montado desde el host)

> **Nota**: Los datos de la base de datos se almacenan en Neon (en la nube), no en volúmenes locales.

## 🔐 Seguridad

### Variables de Entorno Sensibles

⚠️ **NUNCA** subas el archivo `.env` a control de versiones. Asegúrate de que esté en `.gitignore`.

### Generar SESSION_SECRET Seguro

```bash
# En Linux/Mac
openssl rand -base64 32

# En Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🌐 Despliegue en Producción

### Consideraciones Importantes

1. **Base de Datos**: La aplicación ya está configurada para usar Neon Database, que es apto para producción. Asegúrate de:
   - Usar un plan de Neon apropiado para producción
   - Configurar backups automáticos en Neon
   - Monitorear el uso de conexiones

2. **SSL/TLS**: Usa un proxy reverso (nginx, Traefik) para manejar HTTPS:

```nginx
# Ejemplo de configuración nginx
server {
    listen 443 ssl;
    server_name tudominio.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. **Almacenamiento de Archivos**: En producción, considera usar almacenamiento en la nube (S3, Google Cloud Storage) en lugar de volúmenes locales.

4. **Escalabilidad**: Para alta disponibilidad, considera usar:
   - Kubernetes para orquestación
   - Load balancers para distribuir tráfico
   - Neon Database con alta disponibilidad habilitada

## 🐛 Resolución de Problemas

### El contenedor no inicia

```bash
# Ver logs detallados
docker-compose logs novalearn

# Verificar configuración
docker-compose config
```

### Error de conexión a la base de datos

Verifica que:
1. Tu `DATABASE_URL` en `.env` sea correcta y apunte a tu instancia de Neon
2. La base de datos Neon esté activa y accesible
3. El `sslmode=require` esté incluido en la URL de conexión

```bash
# Ver logs de la aplicación para identificar el error
docker-compose logs novalearn
```

### Cambios en el código no se reflejan

```bash
# Reconstruir la imagen
docker-compose build --no-cache novalearn

# Reiniciar el servicio
docker-compose up -d novalearn
```

## 📊 Monitoreo y Salud

El contenedor incluye un health check que verifica cada 30 segundos que la aplicación responda correctamente:

```bash
# Ver el estado de salud
docker inspect --format='{{json .State.Health}}' novalearn | jq
```

## 🔄 Actualización de la Aplicación

```bash
# 1. Detener el servicio
docker-compose stop novalearn

# 2. Obtener últimos cambios (si usas git)
git pull

# 3. Reconstruir la imagen
docker-compose build novalearn

# 4. Iniciar el servicio actualizado
docker-compose up -d novalearn

# Las migraciones se ejecutan automáticamente al iniciar
```

## 📝 Notas Adicionales

- El puerto 5000 debe estar disponible en el host
- Los videos se almacenan en `./videos` en el host
- La aplicación se ejecuta como un usuario no privilegiado dentro del contenedor
- El health check ayuda a Docker a detectar si la aplicación está funcionando correctamente

## 💡 Soporte

Para problemas o preguntas sobre el despliegue con Docker, contacta al equipo de desarrollo de NovaLearn.
