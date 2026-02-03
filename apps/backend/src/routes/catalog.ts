import { Router } from 'express';
import { CategoryController, ProductController } from '../controllers/catalog.controller';
import { ModifierController } from '../controllers/misc.controller';
import { validate } from '../middleware/validate';
import { CategorySchema, ProductSchema, ModifierSchema } from '@saj/types';
import { z } from 'zod';

// Categories
export const categoryRouter = Router();
categoryRouter.get('/', CategoryController.getAll);
categoryRouter.get('/:id', CategoryController.getById);
categoryRouter.post('/', validate(z.object({ body: CategorySchema.omit({ id: true }) })), CategoryController.create);
categoryRouter.put('/:id', validate(z.object({ body: CategorySchema.partial() })), CategoryController.update);
categoryRouter.delete('/:id', CategoryController.delete);

// Products
export const productRouter = Router();
productRouter.get('/', ProductController.getAll);
productRouter.get('/:id', ProductController.getById);
productRouter.post('/', validate(z.object({ body: ProductSchema.omit({ id: true, modifiers: true }).extend({ modifierIds: z.array(z.number()).optional() }) })), ProductController.create);
productRouter.put('/:id', validate(z.object({ body: ProductSchema.partial().extend({ modifierIds: z.array(z.number()).optional() }) })), ProductController.update);
productRouter.delete('/:id', ProductController.delete);

// Modifiers
export const modifierRouter = Router();
modifierRouter.get('/', ModifierController.getAll);
modifierRouter.get('/:id', ModifierController.getById);
modifierRouter.post('/', validate(z.object({ body: ModifierSchema.omit({ id: true }) })), ModifierController.create);
modifierRouter.put('/:id', validate(z.object({ body: ModifierSchema.partial() })), ModifierController.update);
modifierRouter.delete('/:id', ModifierController.delete);
