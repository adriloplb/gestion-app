export type UserRole = 'ADMIN' | 'STANDARD';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  token?: string;
  avatar?: string;
  lastLogin?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface HardwareItem {
  id: number;
  sku: string;
  producto: string;
  categoria: 'Servidores' | 'Redes' | 'Almacenamiento' | 'Seguridad';
  stock: number;
  precio: number;
  responsableEmail: string;
  estado: 'Disponible' | 'Agotado' | 'Bajo Stock';
  fechaAlta: string;
}

export interface AuditLog {
  id: string;
  usuario: string;
  accion: 'LOGIN' | 'LOGOUT' | 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT_PDF' | 'EXPORT_CSV';
  detalles: string;
  timestamp: string;
}
