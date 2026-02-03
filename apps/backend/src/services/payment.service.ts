import db from '../database/db';
import { Payment } from '@saj/types';

export class PaymentService {
  static create(data: Omit<Payment, 'id' | 'createdAt'>): number {
    const transaction = db.transaction(() => {
      // Create payment record
      const info = db.prepare(`
        INSERT INTO payments (orderId, method, cashAmount, cardAmount, total)
        VALUES (?, ?, ?, ?, ?)
      `).run(data.orderId, data.method, data.cashAmount, data.cardAmount, data.total);

      const paymentId = info.lastInsertRowid as number;

      // Update Order Status
      db.prepare(`
        UPDATE orders 
        SET status = 'completed', paidAt = CURRENT_TIMESTAMP 
        WHERE id = ?
      `).run(data.orderId);

      return paymentId;
    });

    return transaction();
  }

  static getByOrderId(orderId: number): Payment | undefined {
    return db.prepare('SELECT * FROM payments WHERE orderId = ?').get(orderId) as Payment | undefined;
  }
}
