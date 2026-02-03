import db from '../database/db';
import { Modifier } from '@saj/types';

export class ModifierService {
  static getAll(): Modifier[] {
    return db.prepare('SELECT * FROM modifiers').all() as Modifier[];
  }

  static getById(id: number): Modifier | undefined {
    return db.prepare('SELECT * FROM modifiers WHERE id = ?').get(id) as Modifier | undefined;
  }

  static create(data: Omit<Modifier, 'id' | 'createdAt'>): number {
    const info = db.prepare(
      'INSERT INTO modifiers (name, nameAr, price, type) VALUES (?, ?, ?, ?)'
    ).run(data.name, data.nameAr, data.price, data.type);
    return info.lastInsertRowid as number;
  }

  static update(id: number, data: Partial<Modifier>): boolean {
    const sets = Object.keys(data).map((key) => `${key} = ?`).join(', ');
    const values = Object.values(data);

    if (sets.length === 0) return true;

    const info = db.prepare(`UPDATE modifiers SET ${sets} WHERE id = ?`).run(...values, id);
    return info.changes > 0;
  }

  static delete(id: number): boolean {
    // Check usage
    const usage = db.prepare('SELECT count(*) as count FROM product_modifiers WHERE modifierId = ?').get(id) as { count: number };
    if (usage.count > 0) {
      throw new Error('Cannot delete modifier currently assigned to products.');
    }
    const info = db.prepare('DELETE FROM modifiers WHERE id = ?').run(id);
    return info.changes > 0;
  }
}
