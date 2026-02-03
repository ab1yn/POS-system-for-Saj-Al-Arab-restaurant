import { Router } from 'express';
import { categoryRouter, productRouter, modifierRouter } from './catalog';
import { orderRouter, paymentRouter } from './order';
import { ReportController } from '../controllers/misc.controller';

const router = Router();

router.use('/categories', categoryRouter);
router.use('/products', productRouter);
router.use('/modifiers', modifierRouter);
router.use('/orders', orderRouter);
router.use('/payments', paymentRouter);

router.get('/reports/daily', ReportController.getDaily);

export default router;
