# NovaLearn LMS - Guía de Despliegue con Docker

Esta guía te ayudará a desplegar NovaLearn LMS usando Docker y Docker Compose.

## 📋 Prerrequisitos

- Docker instalado (versión 20.10 o superior)
- Docker Compose instalado (versión 2.0 o superior)
- Acceso a Keycloak (keycloak.vimcashcorp.com)

## 🚀 Inicio Rápido con Docker Compose

### 1. Configurar Variables de Entorno

Copia el archivo de ejemplo y configura tus credenciales:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus valores reales:

```env
# Database (se configurará automáticamente con PostgreSQL local)
DATABASE_URL=postgresql://novalearn:novalearn123@postgres:5432/novalearn
PGHOST=postgres
PGPORT=5432
PGUSER=novalearn
PGPASSWORD=novalearn123
PGDATABASE=novalearn

# Session Secret (genera uno seguro)
SESSION_SECRET=tu-clave-secreta-muy-segura-cambiala

# Keycloak Configuration
KEYCLOAK_URL=https://keycloak.vimcashcorp.com
KEYCLOAK_REALM=nova-learn
KEYCLOAK_CLIENT_ID=nova-backend
KEYCLOAK_CLIENT_SECRET=tu-secreto-de-keycloak
```

### 2. Construir y Ejecutar

```bash
# Construir e iniciar todos los servicios
docker-compose up -d

# Ver los logs
docker-compose logs -f

# Verificar el estado
docker-compose ps
```

### 3. Ejecutar Migraciones de Base de Datos

```bash
# Una vez que los contenedores estén ejecutándose
docker-compose exec novalearn npm run db:push
```

### 4. Acceder a la Aplicación

La aplicación estará disponible en:
- **NovaLearn LMS**: http://localhost:5000
- **PostgreSQL**: localhost:5432

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

# Ver logs de un servicio específico
docker-compose logs -f novalearn
docker-compose logs -f postgres

# Acceder al shell del contenedor
docker-compose exec novalearn sh

# Reiniciar un servicio
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

El docker-compose crea los siguientes volúmenes:

- `postgres_data`: Datos persistentes de PostgreSQL
- `./videos`: Directorio para almacenar videos de lecciones (montado desde el host)

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

1. **Base de Datos Externa**: En producción, usa una base de datos externa (como Neon) en lugar del PostgreSQL del docker-compose:

```yaml
# docker-compose.yml (modificado para producción)
services:
  novalearn:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://user:pass@neon.tech/dbname
      # ... otras variables
    # Eliminar la sección depends_on y el servicio postgres
```

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
   - Base de datos replicada

## 🐛 Resolución de Problemas

### El contenedor no inicia

```bash
# Ver logs detallados
docker-compose logs novalearn

# Verificar configuración
docker-compose config
```

### Error de conexión a la base de datos

```bash
# Verificar que PostgreSQL esté ejecutándose
docker-compose ps postgres

# Ver logs de PostgreSQL
docker-compose logs postgres

# Reiniciar el servicio de base de datos
docker-compose restart postgres
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

# 5. Ejecutar migraciones si hay cambios en la BD
docker-compose exec novalearn npm run db:push
```

## 📝 Notas Adicionales

- El puerto 5000 debe estar disponible en el host
- Los videos se almacenan en `./videos` en el host
- La aplicación se ejecuta como un usuario no privilegiado dentro del contenedor
- El health check ayuda a Docker a detectar si la aplicación está funcionando correctamente

## 💡 Soporte

Para problemas o preguntas sobre el despliegue con Docker, contacta al equipo de desarrollo de NovaLearn.
