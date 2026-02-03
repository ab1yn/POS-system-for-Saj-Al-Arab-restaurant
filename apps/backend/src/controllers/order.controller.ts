import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';
import { PaymentService } from '../services/payment.service';

export class OrderController {
  static getAll(req: Request, res: Response) {
    const filters = {
      date: req.query.date as string,
      status: req.query.status as string,
      type: req.query.type as string,
    };
    const orders = OrderService.getAll(filters);
    res.json({ success: true, data: orders });
  }

  static getById(req: Request, res: Response) {
    const order = OrderService.getById(Number(req.params.id));
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, data: order });
  }

  static create(req: Request, res: Response) {
    const id = OrderService.create(req.body);
    res.status(201).json({ success: true, data: { id } });
  }

  static update(req: Request, res: Response) {
    const success = OrderService.update(Number(req.params.id), req.body);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Order not found or update failed' });
    }
    res.json({ success: true, data: { success } });
  }

  static sendToKitchen(req: Request, res: Response) {
    try {
      const order = OrderService.sendToKitchen(Number(req.params.id));
      res.json({ success: true, data: order });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static delete(req: Request, res: Response) {
    const success = OrderService.delete(Number(req.params.id));
    res.json({ success: true, data: { success } });
  }
}

export class PaymentController {
  static create(req: Request, res: Response) {
    const id = PaymentService.create(req.body);
    res.status(201).json({ success: true, data: { id } });
  }

  static getByOrderId(req: Request, res: Response) {
    const payment = PaymentService.getByOrderId(Number(req.params.orderId));
    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }
    res.json({ success: true, data: payment });
  }
}
