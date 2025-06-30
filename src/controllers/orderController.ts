import { Request, Response } from "express";
import db from "../config/db";
import { emitOrderStatusUpdate,emitNewOrderToRestaurants } from "../services/socket";

export const placeOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as any).user;
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      res.status(400).json({ message: "Items must be an array" });
      return;
    }

    const totalAmount = items.reduce((sum: number, item: any) => {
      return sum + item.price * item.quantity;
    }, 0);

    const result = await db.query(
      "INSERT INTO orders (user_id, items, total_amount) VALUES ($1, $2, $3) RETURNING *",
      [user.id, JSON.stringify(items), totalAmount]
    );

    const newOrder = result.rows[0];

    emitNewOrderToRestaurants(newOrder);

    res.status(201).json(newOrder);

  } catch (err) {
    const errorMessage =
      (err as Error).message || "An unexpected error occurred";
    res.status(500).json(errorMessage);
  }
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;

    // const result =
    //   user.role === "restaurant"
    //     ? await db.query("SELECT * FROM orders ORDER BY created_at DESC")
    //     : await db.query(
    //         "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
    //         [user.id]
    //       );

    const result =
      user.role === "restaurant"
        ? await db.query(`
        SELECT orders.*, users.name AS customer_name
        FROM orders
        JOIN users ON orders.user_id = users.id
        ORDER BY orders.created_at DESC
      `)
        : await db.query(
            "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
            [user.id]
          );

    res.json(result.rows);
  } catch (err) {
    const errorMessage =
      (err as Error).message || "An unexpected error occurred";
    res.status(500).json(errorMessage);
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "delivered",
    ];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    const result = await db.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    const updatedOrder = result.rows[0];
    emitOrderStatusUpdate(updatedOrder);
    res.json(updatedOrder);

    // res.json(result.rows[0]);
  } catch (err) {
    const errorMessage =
      (err as Error).message || "An unexpected error occurred";
    res.status(500).json(errorMessage);
  }
};
