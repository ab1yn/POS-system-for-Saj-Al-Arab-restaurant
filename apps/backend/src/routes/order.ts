import { Router } from 'express';
import { OrderController, PaymentController } from '../controllers/order.controller';
import { validate } from '../middleware/validate';
import { OrderSchema, PaymentSchema } from '@saj/types';
import { z } from 'zod';

export const orderRouter = Router();
orderRouter.get('/', OrderController.getAll);
orderRouter.get('/:id', OrderController.getById);
orderRouter.post('/', validate(z.object({ body: OrderSchema.partial() })), OrderController.create);
orderRouter.put('/:id', validate(z.object({ body: OrderSchema.partial() })), OrderController.update);
orderRouter.post('/:id/send-kitchen', OrderController.sendToKitchen);
orderRouter.delete('/:id', OrderController.delete);

export const paymentRouter = Router();
paymentRouter.post('/', validate(z.object({ body: PaymentSchema.omit({ id: true, createdAt: true }) })), PaymentController.create);
paymentRouter.get('/order/:orderId', PaymentController.getByOrderId);
