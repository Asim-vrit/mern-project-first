import { Request } from "express";

export interface AuthRequest extends Request {
  role?: string;
  user_id?: string;
}
