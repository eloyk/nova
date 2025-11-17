import Keycloak from 'keycloak-connect';
import { Request, Response, NextFunction } from 'express';
import type { SessionData } from 'express-session';

interface KeycloakSession extends SessionData {
  'keycloak-token'?: string;
}

interface KeycloakRequest extends Request {
  session: KeycloakSession;
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

// Crear instancia de Keycloak
export const keycloak = new Keycloak({}, keycloakConfig as any);

// Middleware para extraer información del usuario desde Keycloak
export function extractUserFromKeycloak(req: KeycloakRequest, res: Response, next: NextFunction) {
  if (req.kauth?.grant?.access_token?.content) {
    const token = req.kauth.grant.access_token.content;
    
    (req as any).user = {
      id: token.sub || '',
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
