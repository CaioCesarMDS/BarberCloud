export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  phone: string;
  iat?: number;
  exp?: number;
}
