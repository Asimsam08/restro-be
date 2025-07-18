import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
   res.status(401).json({ message: 'No token provided' });
   return
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded;
    next();
  } catch {
     res.status(401).json({ message: 'Invalid token' });
     return;
  }
};
