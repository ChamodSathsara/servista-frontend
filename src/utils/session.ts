export interface CurrentUser {
  userId: number;
  userName: string;
  email: string;
  role: string;
}

export function getCurrentUser(): CurrentUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('currentUser') ?? sessionStorage.getItem('currentUser');
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<CurrentUser>;
    if (!Number(value.userId) || !value.role) return null;
    return {
      userId: Number(value.userId),
      userName: String(value.userName ?? ''),
      email: String(value.email ?? ''),
      role: String(value.role).toUpperCase(),
    };
  } catch {
    return null;
  }
}

export const isTechnician = (user: CurrentUser | null) => user?.role === 'TECHNICIAN';

export function technicianIdForUser(
  technicians: Array<{ technicianId: number; user: { userId: number } }>,
  user: CurrentUser | null = getCurrentUser(),
): number | null {
  if (!isTechnician(user)) return null;
  return technicians.find((technician) => technician.user.userId === user?.userId)?.technicianId ?? null;
}
