export interface Authorization {
  id: string;
  user_id: string;
  role: 'admin' | 'user' | 'supplier';
  permissions: Record<string, boolean>;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  role: Authorization['role'] | null;
  permissions: Authorization['permissions'];
  isAdmin: boolean;
  isSupplier: boolean;
  isUser: boolean;
  can: (permission: string) => boolean;
}