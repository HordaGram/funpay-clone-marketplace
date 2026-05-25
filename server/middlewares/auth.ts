import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_for_dev';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ error: 'Доступ запрещен. Отсутствует токен.' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: 'Недействительный токен.' });
      return;
    }
    
    req.user = decoded as { userId: string; role: string };
    next();
  });
};
