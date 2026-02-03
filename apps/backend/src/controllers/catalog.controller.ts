import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';

// Categories
export class CategoryController {
  static getAll(req: Request, res: Response) {
    const activeOnly = req.query.active === 'true';
    const categories = CategoryService.getAll(activeOnly);
    res.json({ success: true, data: categories });
  }

  static getById(req: Request, res: Response) {
    const category = CategoryService.getById(Number(req.params.id));
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    res.json({ success: true, data: category });
  }

  static create(req: Request, res: Response) {
    const id = CategoryService.create(req.body);
    res.status(201).json({ success: true, data: { id } });
  }

  static update(req: Request, res: Response) {
    const success = CategoryService.update(Number(req.params.id), req.body);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Category not found or update failed' });
    }
    res.json({ success: true, data: { success } });
  }

  static delete(req: Request, res: Response) {
    const success = CategoryService.delete(Number(req.params.id));
    res.json({ success: true, data: { success } });
  }
}

// Products
export class ProductController {
  static getAll(req: Request, res: Response) {
    const activeOnly = req.query.active === 'true';
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const products = ProductService.getAll(activeOnly, categoryId);
    res.json({ success: true, data: products });
  }

  static getById(req: Request, res: Response) {
    const product = ProductService.getById(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  }

  static create(req: Request, res: Response) {
    const id = ProductService.create(req.body);
    res.status(201).json({ success: true, data: { id } });
  }

  static update(req: Request, res: Response) {
    const success = ProductService.update(Number(req.params.id), req.body);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Product not found or update failed' });
    }
    res.json({ success: true, data: { success } });
  }

  static delete(req: Request, res: Response) {
    const success = ProductService.delete(Number(req.params.id));
    res.json({ success: true, data: { success } });
  }
}
