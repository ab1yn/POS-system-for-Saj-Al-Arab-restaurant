import db from '../database/db';
import { Category } from '@saj/types';

export class CategoryService {
  static getAll(activeOnly: boolean = false): Category[] {
    const query = activeOnly
      ? 'SELECT * FROM categories WHERE isActive = 1 ORDER BY displayOrder ASC'
      : 'SELECT * FROM categories ORDER BY displayOrder ASC';
    return db.prepare(query).all() as Category[];
  }

  static getById(id: number): Category | undefined {
    return db.prepare('SELECT * FROM categories WHERE id = ?').get(id) as Category | undefined;
  }

  static create(data: Omit<Category, 'id' | 'createdAt'>): number {
    const info = db.prepare(
      'INSERT INTO categories (name, nameAr, displayOrder, isActive) VALUES (?, ?, ?, ?)'
    ).run(data.name, data.nameAr, data.displayOrder, data.isActive ? 1 : 0);
    return info.lastInsertRowid as number;
  }

  static update(id: number, data: Partial<Category>): boolean {
    const sets = Object.keys(data).map((key) => `${key} = ?`).join(', ');
    const values = Object.values(data).map(val => typeof val === 'boolean' ? (val ? 1 : 0) : val);

    if (sets.length === 0) return true;

    const info = db.prepare(`UPDATE categories SET ${sets} WHERE id = ?`).run(...values, id);
    return info.changes > 0;
  }

  static delete(id: number): boolean {
    // Soft delete
    const info = db.prepare('UPDATE categories SET isActive = 0 WHERE id = ?').run(id);
    return info.changes > 0;
  }
}
