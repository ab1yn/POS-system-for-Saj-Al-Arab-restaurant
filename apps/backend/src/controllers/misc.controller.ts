import { Request, Response } from 'express';
import { ModifierService } from '../services/modifier.service';
import db from '../database/db';

export class ModifierController {
  static getAll(req: Request, res: Response) {
    const modifiers = ModifierService.getAll();
    res.json({ success: true, data: modifiers });
  }

  static getById(req: Request, res: Response) {
    const modifier = ModifierService.getById(Number(req.params.id));
    res.json({ success: true, data: modifier });
  }

  static create(req: Request, res: Response) {
    const id = ModifierService.create(req.body);
    res.status(201).json({ success: true, data: { id } });
  }

  static update(req: Request, res: Response) {
    ModifierService.update(Number(req.params.id), req.body);
    res.json({ success: true, data: { success: true } });
  }

  static delete(req: Request, res: Response) {
    try {
      ModifierService.delete(Number(req.params.id));
      res.json({ success: true, data: { success: true } });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }
}

export class ReportController {
  static getDaily(req: Request, res: Response) {
    const date = (req.query.date as string) || new Date().toISOString().slice(0, 10);

    // Summary metrics
    const summary = db.prepare(`
      SELECT 
        COUNT(*) as orderCount,
        SUM(total) as totalSales,
        AVG(total) as averageOrderValue
      FROM orders 
      WHERE date(createdAt) = date(?) AND status = 'completed'
    `).get(date) as any;

    const payments = db.prepare(`
      SELECT 
        SUM(cashAmount) as totalCash,
        SUM(cardAmount) as totalCard
      FROM payments 
      WHERE date(createdAt) = date(?)
    `).get(date) as any;

    const orders = db.prepare(`
      SELECT * FROM orders 
      WHERE date(createdAt) = date(?) 
      ORDER BY createdAt DESC
    `).all(date);

    res.json({
      success: true,
      data: {
        date,
        summary: {
          ...summary,
          totalSales: summary.totalSales || 0,
          totalCash: payments.totalCash || 0,
          totalCard: payments.totalCard || 0
        },
        orders
      }
    });
  }
}
