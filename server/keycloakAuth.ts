import Keycloak from 'keycloak-connect';
import { Request, Response, NextFunction } from 'express';

interface KeycloakRequest extends Request {
  kauth?: {
    grant?: {
      access_token?: {
        content?: {
          sub?: string;
          email?: string;
          given_name?: string;
          family_name?: string;
          preferred_username?: string;
          realm_access?: {
            roles?: string[];
          };
        };
      };
    };
  };
}

// Configuración de Keycloak
const keycloakConfig = {
  realm: 'nova-learn',
  'auth-server-url': 'https://keycloak.vimcashcorp.com',
  'ssl-required': 'external',
  resource: 'nova-backend',
  'confidential-port': 0,
  credentials: {
    secret: process.env.KEYCLOAK_CLIENT_SECRET || '',
  },
  'bearer-only': false, // Permitir flujo de autenticación web
};

// Variable para almacenar la instancia de Keycloak
export let keycloak: Keycloak.Keycloak;

// Función para inicializar Keycloak con session store
export function initKeycloak(sessionStore: any) {
  keycloak = new Keycloak({ store: sessionStore }, keycloakConfig as any);
  return keycloak;
}

// Middleware para extraer información del usuario desde Keycloak
export async function extractUserFromKeycloak(req: KeycloakRequest, res: Response, next: NextFunction) {
  if (req.kauth?.grant?.access_token?.content) {
    const token = req.kauth.grant.access_token.content;
    
    // Información básica del token de Keycloak
    (req as any).user = {
      keycloakId: token.sub || '', // Guardar el ID de Keycloak por si se necesita
      id: token.sub || '', // Por defecto usar el ID de Keycloak
      email: token.email || '',
      firstName: token.given_name || '',
      lastName: token.family_name || '',
      username: token.preferred_username || '',
      roles: token.realm_access?.roles || [],
    };
  }
  next();
}

// Middleware para verificar si el usuario está autenticado
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  
  if (!user || !user.id) {
    return res.status(401).json({ message: 'No autenticado' });
  }
  
  next();
}

// Middleware para verificar si el usuario es instructor
export function isInstructor(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  
  if (!user || !user.roles) {
    return res.status(401).json({ message: 'No autenticado' });
  }
  
  // Verificar si tiene el rol de instructor
  const hasInstructorRole = user.roles.includes('instructor') || user.roles.includes('admin');
  
  if (!hasInstructorRole) {
    return res.status(403).json({ message: 'Acceso denegado: Se requiere rol de instructor' });
  }
  
  next();
}

// Función para obtener el usuario actual desde el request
export function getCurrentUser(req: Request) {
  return (req as any).user || null;
}

// Función para obtener el ID del usuario de la base de datos
export async function getDatabaseUserId(req: Request): Promise<string | null> {
  const user = (req as any).user;
  if (!user || !user.email) {
    return null;
  }
  
  // Si ya tenemos el dbUserId guardado en el request, usarlo
  if ((req as any).dbUserId) {
    return (req as any).dbUserId;
  }
  
  // Si no, buscarlo en la base de datos por email
  const { db } = await import('./db');
  const { users } = await import('@shared/schema');
  const { eq } = await import('drizzle-orm');
  
  const [dbUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, user.email));
  
  if (dbUser) {
    // Guardar en el request para no tener que buscarlo de nuevo
    (req as any).dbUserId = dbUser.id;
    return dbUser.id;
  }
  
  return null;
}
