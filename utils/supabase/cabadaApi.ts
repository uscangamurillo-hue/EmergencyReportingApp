import { projectId } from './info';
import type { UserProfile, EmergencyReport } from '../../src/app/context/AuthContext';

const BASE = `https://${projectId}.supabase.co/functions/v1/server/make-server-32e3528b`;

async function req(path: string, options?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok && res.status !== 404) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }
  return res;
}

export async function fetchProfile(phone: string): Promise<UserProfile | null> {
  const res = await req(`/users/${encodeURIComponent(phone)}/profile`);
  if (res.status === 404) return null;
  return res.json();
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await req(`/users/${encodeURIComponent(profile.phone)}/profile`, {
    method: 'PUT',
    body: JSON.stringify(profile),
  });
}

export async function fetchReports(phone: string): Promise<EmergencyReport[]> {
  const res = await req(`/users/${encodeURIComponent(phone)}/reports`);
  return res.json();
}

export async function pushReport(phone: string, report: EmergencyReport): Promise<void> {
  await req(`/users/${encodeURIComponent(phone)}/reports`, {
    method: 'POST',
    body: JSON.stringify(report),
  });
}

export async function syncReports(phone: string, reports: EmergencyReport[]): Promise<void> {
  await req(`/users/${encodeURIComponent(phone)}/reports`, {
    method: 'PUT',
    body: JSON.stringify(reports),
  });
}
