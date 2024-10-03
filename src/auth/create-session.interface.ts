export interface CreateSessionType {
  ipAddress: string;
  deviceType: string;
  userAgent: string | null;
  os: string | null;
  browser: string | null;
  location: string | null;
}
