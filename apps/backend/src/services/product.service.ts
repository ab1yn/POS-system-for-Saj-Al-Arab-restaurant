import db from '../database/db';
import { Product, Modifier } from '@saj/types';

export class ProductService {
  static getAll(activeOnly: boolean = false, categoryId?: number): Product[] {
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];

    if (activeOnly) {
      sql += ' AND isActive = 1';
    }
    if (categoryId) {
      sql += ' AND categoryId = ?';
      params.push(categoryId);
    }

    sql += ' ORDER BY displayOrder ASC';
    const products = db.prepare(sql).all(...params) as Product[];

    // Attach modifiers to each product
    const getModifiers = db.prepare(`
      SELECT m.* FROM modifiers m
      JOIN product_modifiers pm ON m.id = pm.modifierId
      WHERE pm.productId = ?
    `);

    return products.map(p => ({
      ...p,
      modifiers: getModifiers.all(p.id) as Modifier[]
    }));
  }

  static getById(id: number): Product | undefined {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as Product | undefined;
    if (!product) return undefined;

    const modifiers = db.prepare(`
      SELECT m.* FROM modifiers m
      JOIN product_modifiers pm ON m.id = pm.modifierId
      WHERE pm.productId = ?
    `).all(id) as Modifier[];

    return { ...product, modifiers };
  }

  static create(data: Omit<Product, 'id' | 'createdAt' | 'modifiers'> & { modifierIds?: number[] }): number {
    const transaction = db.transaction(() => {
      const info = db.prepare(
        'INSERT INTO products (categoryId, name, nameAr, price, displayOrder, isActive) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(data.categoryId, data.name, data.nameAr, data.price, data.displayOrder, data.isActive ? 1 : 0);

      const productId = info.lastInsertRowid as number;

      if (data.modifierIds && data.modifierIds.length > 0) {
        const insertMod = db.prepare('INSERT INTO product_modifiers (productId, modifierId) VALUES (?, ?)');
        data.modifierIds.forEach(modId => insertMod.run(productId, modId));
      }

      return productId;
    });

    return transaction();
  }

  static update(id: number, data: Partial<Product> & { modifierIds?: number[] }): boolean {
    const transaction = db.transaction(() => {
      // Update fields
      const { modifierIds, ...fields } = data;
      if (Object.keys(fields).length > 0) {
        const sets = Object.keys(fields).map((key) => `${key} = ?`).join(', ');
        const values = Object.values(fields).map(val => typeof val === 'boolean' ? (val ? 1 : 0) : val);
        db.prepare(`UPDATE products SET ${sets} WHERE id = ?`).run(...values, id);
      }

      // Update modifiers
      if (modifierIds) {
        db.prepare('DELETE FROM product_modifiers WHERE productId = ?').run(id);
        const insertMod = db.prepare('INSERT INTO product_modifiers (productId, modifierId) VALUES (?, ?)');
        modifierIds.forEach(modId => insertMod.run(id, modId));
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

  static delete(id: number): boolean {
    const info = db.prepare('UPDATE products SET isActive = 0 WHERE id = ?').run(id);
    return info.changes > 0;
  }
}
