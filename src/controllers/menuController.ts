// src/controllers/menuController.ts

import { Request, Response } from 'express';
import menu from '../data/menu';

export const getMenu = (_req: Request, res: Response): void => {
  res.json(menu);
};
