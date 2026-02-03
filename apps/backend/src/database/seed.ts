import db from './db';

const seed = () => {
  console.log('Seeding database...');

  // Clear existing data
  db.prepare('DELETE FROM product_modifiers').run();
  db.prepare('DELETE FROM order_item_modifiers').run();
  db.prepare('DELETE FROM order_items').run();
  db.prepare('DELETE FROM payments').run();
  db.prepare('DELETE FROM orders').run();
  db.prepare('DELETE FROM modifiers').run();
  db.prepare('DELETE FROM products').run();
  db.prepare('DELETE FROM categories').run();

  // Reset IDs
  db.prepare('DELETE FROM sqlite_sequence').run();

  // 1. Categories
  const categories = [
    { name: 'Shawarma', nameAr: 'شاورما', displayOrder: 1 },
    { name: 'Manakeesh', nameAr: 'مناقيش', displayOrder: 2 },
    { name: 'Falafel', nameAr: 'فلافل', displayOrder: 3 },
    { name: 'Appetizers', nameAr: 'مقبلات', displayOrder: 4 },
    { name: 'Beverages', nameAr: 'مشروبات', displayOrder: 5 },
  ];

  const insertCategory = db.prepare(
    'INSERT INTO categories (name, nameAr, displayOrder) VALUES (?, ?, ?)'
  );

  categories.forEach((cat) => insertCategory.run(cat.name, cat.nameAr, cat.displayOrder));
  console.log('Categories inserted.');

  // 2. Modifiers
  const modifiers = [
    { name: 'Garlic', nameAr: 'ثوم', price: 0.25, type: 'addon' },
    { name: 'Pickles', nameAr: 'مخلل', price: 0.10, type: 'addon' },
    { name: 'Extra Meat', nameAr: 'زيادة لحم', price: 1.00, type: 'addon' },
    { name: 'Cheese', nameAr: 'جبنة', price: 0.50, type: 'addon' },
    { name: 'Shatta', nameAr: 'شطة', price: 0.00, type: 'addon' },
    { name: 'Extra Sauce', nameAr: 'زيادة صوص', price: 0.15, type: 'addon' },
    { name: 'Saj Bread', nameAr: 'خبز صاج', price: 0.00, type: 'option' },
    { name: 'Regular Bread', nameAr: 'خبز عادي', price: 0.00, type: 'option' },
    { name: 'No Onion', nameAr: 'بدون بصل', price: 0.00, type: 'option' },
    { name: 'No Sauce', nameAr: 'بدون صوص', price: 0.00, type: 'option' },
  ];

  const insertModifier = db.prepare(
    'INSERT INTO modifiers (name, nameAr, price, type) VALUES (?, ?, ?, ?)'
  );

  modifiers.forEach((mod) => insertModifier.run(mod.name, mod.nameAr, mod.price, mod.type));
  console.log('Modifiers inserted.');

  // Helper to get ID
  const getCatId = (name: string) => db.prepare('SELECT id FROM categories WHERE name = ?').get(name) as { id: number };
  const getModId = (name: string) => db.prepare('SELECT id FROM modifiers WHERE name = ?').get(name) as { id: number };

  // 3. Products
  const products = [
    // Shawarma
    { category: 'Shawarma', name: 'Arabic Shawarma', nameAr: 'شاورما عربي', price: 2.75 },
    { category: 'Shawarma', name: 'Saj Shawarma', nameAr: 'شاورما صاج', price: 2.25 },
    { category: 'Shawarma', name: 'Chicken Shawarma', nameAr: 'شاورما دجاج', price: 2.00 },
    // Falafel
    { category: 'Falafel', name: 'Falafel Plate', nameAr: 'فلافل صحن', price: 1.75 },
    { category: 'Falafel', name: 'Falafel Sandwich', nameAr: 'فلافل ساندويش', price: 0.85 },
    // Manakeesh
    { category: 'Manakeesh', name: 'Zaatar', nameAr: 'منقوشة زعتر', price: 0.60 },
    { category: 'Manakeesh', name: 'Cheese', nameAr: 'منقوشة جبنة', price: 0.85 },
    { category: 'Manakeesh', name: 'Meat', nameAr: 'منقوشة لحمة', price: 1.35 },
    // Appetizers
    { category: 'Appetizers', name: 'Hummus', nameAr: 'حمص', price: 1.75 },
    { category: 'Appetizers', name: 'Fries', nameAr: 'بطاطا مقلية', price: 1.10 },
    { category: 'Appetizers', name: 'Tabbouleh', nameAr: 'تبولة', price: 1.75 },
    { category: 'Appetizers', name: 'Fattoush', nameAr: 'فتوش', price: 1.75 },
    { category: 'Appetizers', name: 'Mutabal', nameAr: 'متبل', price: 1.75 },
    { category: 'Appetizers', name: 'Kibbeh (Kg)', nameAr: 'كبة', price: 12.00 },
    // Beverages
    { category: 'Beverages', name: 'Pepsi', nameAr: 'بيبسي', price: 0.55 },
    { category: 'Beverages', name: 'Coca Cola', nameAr: 'كوكا كولا', price: 0.55 },
    { category: 'Beverages', name: 'Water', nameAr: 'ماء', price: 0.30 },
    { category: 'Beverages', name: 'Ayran', nameAr: 'عيران', price: 0.60 },
    { category: 'Beverages', name: 'Orange Juice', nameAr: 'عصير برتقال', price: 1.00 },
    { category: 'Beverages', name: 'Arabic Coffee', nameAr: 'قهوة عربية', price: 0.75 },
    { category: 'Beverages', name: 'Tea', nameAr: 'شاي', price: 0.50 },
  ];

  const insertProduct = db.prepare(
    'INSERT INTO products (categoryId, name, nameAr, price, displayOrder) VALUES (?, ?, ?, ?, ?)'
  );

  const insertProductModifier = db.prepare(
    'INSERT INTO product_modifiers (productId, modifierId) VALUES (?, ?)'
  );

  let displayOrder = 1;
  products.forEach((prod) => {
    const catId = getCatId(prod.category).id;
    const info = insertProduct.run(catId, prod.name, prod.nameAr, prod.price, displayOrder++);
    const prodId = info.lastInsertRowid as number;

    // Link Modifiers
    if (prod.category === 'Shawarma') {
      const mods = ['Garlic', 'Pickles', 'Extra Meat', 'Shatta', 'Saj Bread', 'Regular Bread', 'No Onion', 'No Sauce', 'Extra Sauce'];
      mods.forEach((m) => insertProductModifier.run(prodId, getModId(m).id));
    } else if (prod.category === 'Falafel') {
      const mods = ['Garlic', 'Pickles', 'Shatta', 'No Sauce', 'Extra Sauce'];
      mods.forEach((m) => insertProductModifier.run(prodId, getModId(m).id));
    } else if (prod.category === 'Manakeesh') {
      if (prod.name !== 'Cheese') { // Add cheese modifier to non-cheese manakeesh
        insertProductModifier.run(prodId, getModId('Cheese').id);
      }
      insertProductModifier.run(prodId, getModId('Extra Sauce').id);
    }
  });

  console.log('Products and ProductModifiers inserted.');
  console.log('Seeding complete!');
};

try {
  seed();
} catch (error) {
  console.error('Seeding failed:', error);
  process.exit(1);
}
