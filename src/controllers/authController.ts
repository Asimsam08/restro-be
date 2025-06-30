import db from "../config/db";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields required" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const role = req.body.role || "customer"; 

    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
      [name,email, hashedPassword, role]
    );

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    const errorMessage =
      (err as Error).message || "An unexpected error occurred";
    res.status(500).json(errorMessage);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ message: "Invalid credentials" });
      return
    }

    const token = generateToken({ id: user.id, role: user.role });

    res.json({ token, role: user.role, email: user.email, name:user.name, userId: user.id });
  } catch (err) {
    const errorMessage =
      (err as Error).message || "An unexpected error occurred";
    res.status(500).json(errorMessage);
  }
};
