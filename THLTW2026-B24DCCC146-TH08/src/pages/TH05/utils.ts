import type { Club, HistoryRecord } from './types';

export const currentClubName = (clubs: Club[], clubId: string) =>
  clubs.find((club) => club.id === clubId)?.name || 'Chưa cập nhật';

export const createHistoryRecord = (entry: Omit<HistoryRecord, 'id' | 'timestamp'>): HistoryRecord => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  timestamp: new Date().toLocaleString('vi-VN', { hour12: false }),
  ...entry,
});
