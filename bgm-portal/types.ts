
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  CLIENT = 'CLIENT',
  USER = 'USER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  paypalEmail?: string;
  balance: number;
  status?: 'ACTIVE' | 'TERMINATED';
  avatarUrl?: string;
  platforms?: string[];
}

export interface TrackStats {
  platform: string;
  isrc: string;
  videoTitle: string;
  clientEmail: string;
  month: string;
  views: number;
  revenue: number;
}

export interface SongPermission {
  id: string;
  songTitle: string;
  upc?: string;
  isrc: string;
  clientEmail: string;
  status: 'AUTHORIZED' | 'REVOKED' | 'PENDING';
  grantedAt: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  paypalEmail: string;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  stats: TrackStats[];
  songPermissions: SongPermission[];
  withdrawals: WithdrawalRequest[];
}