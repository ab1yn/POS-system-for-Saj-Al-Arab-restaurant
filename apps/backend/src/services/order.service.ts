import db from '../database/db';
import { Order, OrderItem, OrderItemModifier, OrderStatus } from '@saj/types';
import { randomUUID } from 'crypto';

export class OrderService {
  static getAll(filters: { date?: string; status?: string; type?: string } = {}): Order[] {
    let sql = 'SELECT * FROM orders WHERE 1=1';
    const params: any[] = [];

    if (filters.date) {
      sql += ' AND date(createdAt) = date(?)';
      params.push(filters.date);
    }
    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }
    if (filters.type) {
      sql += ' AND type = ?';
      params.push(filters.type);
    }

    sql += ' ORDER BY createdAt DESC';
    return db.prepare(sql).all(...params) as Order[];
  }

  static getById(id: number): Order | undefined {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as Order | undefined;
    if (!order) return undefined;

    // Get Items
    const items = db.prepare(`
      SELECT oi.*, p.name as productName, p.nameAr as productNameAr 
      FROM order_items oi
      JOIN products p ON oi.productId = p.id
      WHERE oi.orderId = ?
    `).all(id) as OrderItem[];

    // Get Item Modifiers
    const itemsWithModifiers = items.map((item) => {
      const modifiers = db.prepare(`
        SELECT oim.modifierId, oim.price, m.name, m.nameAr 
        FROM order_item_modifiers oim
        JOIN modifiers m ON oim.modifierId = m.id
        WHERE oim.orderItemId = ?
      `).all(item.id) as OrderItemModifier[];
      return { ...item, modifiers };
    });

    return { ...order, items: itemsWithModifiers };
  }

  static create(data: Partial<Order>): number {
    // Generate temp order number if not provided
    const orderNumber = data.orderNumber || `DRAFT-${Date.now()}`;

    const transaction = db.transaction(() => {
      const info = db.prepare(`
        INSERT INTO orders (orderNumber, type, status, notes, subtotal, discount, total)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        orderNumber,
        data.type || 'takeaway',
        data.status || 'draft',
        data.notes || '',
        data.subtotal || 0,
        data.discount || 0,
        data.total || 0
      );

      const orderId = info.lastInsertRowid as number;

      if (data.items) {
        OrderService.insertItems(orderId, data.items);
      }

      return orderId;
    });

    return transaction();
  }

  static update(id: number, data: Partial<Order>): boolean {
    const transaction = db.transaction(() => {
      // Update order fields
      const { items, ...fields } = data;
      if (Object.keys(fields).length > 0) {
        const sets = Object.keys(fields).map((key) => `${key} = ?`).join(', ');
        const values = Object.values(fields);
        db.prepare(`UPDATE orders SET ${sets} WHERE id = ?`).run(...values, id);
      }

      // Update items (Re-create strategy for simplicity and correctness)
      if (items) {
        db.prepare('DELETE FROM order_items WHERE orderId = ?').run(id); // Cascade delete should handle modifiers if setup, but I defined FKs.
        // Wait, better-sqlite3 doesn't enable FK cascade by default unless PRAGMA is on.
        // Manual delete of modifiers needed first.
        // Assuming standard behavior of 'DELETE FROM order_items' assumes we clean up children or use triggers.
        // I will manually clean children to be safe.
        const itemIds = db.prepare('SELECT id FROM order_items WHERE orderId = ?').all(id) as { id: number }[];
        itemIds.forEach(i => db.prepare('DELETE FROM order_item_modifiers WHERE orderItemId = ?').run(i.id));
        db.prepare('DELETE FROM order_items WHERE orderId = ?').run(id);

        OrderService.insertItems(id, items);
      }
    });

    try {
      transaction();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  static sendToKitchen(id: number): Order {
    const transaction = db.transaction(() => {
      const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as Order;
      if (!order) throw new Error('Order not found');

      let newOrderNumber = order.orderNumber;

      // Generate official number if currently a draft
      if (order.status === 'draft' || order.orderNumber.startsWith('DRAFT')) {
        const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
        // Count kitchen/completed orders for today
        const result = db.prepare(`
          SELECT count(*) as count FROM orders 
          WHERE (status = 'kitchen' OR status = 'completed') 
          AND date(sentToKitchenAt) = date('now')
        `).get() as { count: number };

        const sequence = (result.count + 1).toString().padStart(4, '0');
        newOrderNumber = `${todayStr}-${sequence}`;
      }

      const sentTime = new Date().toISOString();
      db.prepare(`
        UPDATE orders 
        SET status = 'kitchen', orderNumber = ?, sentToKitchenAt = ?
        WHERE id = ?
      `).run(newOrderNumber, sentTime, id);

      return OrderService.getById(id)!;
    });

    return transaction();
  }

  private static insertItems(orderId: number, items: OrderItem[]) {
    const insertItem = db.prepare(`
      INSERT INTO order_items (orderId, productId, quantity, price, notes)
      VALUES (?, ?, ?, ?, ?)
    `);
    const insertMod = db.prepare(`
      INSERT INTO order_item_modifiers (orderItemId, modifierId, price)
      VALUES (?, ?, ?)
    `);

    items.forEach((item) => {
      const info = insertItem.run(orderId, item.productId, item.quantity, item.price, item.notes || '');
      const orderItemId = info.lastInsertRowid as number;

      if (item.modifiers) {
        item.modifiers.forEach((mod) => {
          insertMod.run(orderItemId, mod.modifierId, mod.price);
        });
      }
    });
  }

  static delete(id: number): boolean {
    // Soft delete (cancel)
    const info = db.prepare("UPDATE orders SET status = 'cancelled' WHERE id = ?").run(id);
    return info.changes > 0;
  }
}
