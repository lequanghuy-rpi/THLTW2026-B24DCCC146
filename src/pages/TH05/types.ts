export type RegistrationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Club {
  id: string;
  avatar: string;
  name: string;
  foundedDate: string;
  description: string;
  president: string;
  isActive: boolean;
}

export interface Registration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'Nam' | 'Nữ' | 'Khác';
  address: string;
  skill: string;
  clubId: string;
  reason: string;
  status: RegistrationStatus;
  note?: string;
}

export interface HistoryRecord {
  id: string;
  action: 'Approved' | 'Rejected' | 'Created' | 'Updated' | 'Deleted' | 'Transferred';
  targetType: 'Club' | 'Registration' | 'Member';
  targetName: string;
  clubName?: string;
  actor: string;
  timestamp: string;
  note?: string;
}
