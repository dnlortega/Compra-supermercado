#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();

  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: node ./scripts/import-shopping-list.js <path-to-json>');
    process.exit(1);
  }

  const filePath = path.resolve(process.cwd(), arg);
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error('Invalid JSON file:', err.message);
    process.exit(1);
  }

  // Prepare shopping list payload
  const listPayload = {
    name: data.name || undefined,
    date: data.date ? new Date(data.date) : undefined,
    status: data.status || undefined,
    total: typeof data.total === 'number' ? data.total : undefined,
  };

  // Check if list with same id exists
  let createdList;
  if (data.id) {
    const existing = await prisma.shoppingList.findUnique({ where: { id: data.id } });
    if (existing) {
      console.warn('A shopping list with id already exists. Creating a new list with a new id.');
      createdList = await prisma.shoppingList.create({ data: listPayload });
    } else {
      createdList = await prisma.shoppingList.create({ data: { id: data.id, ...listPayload } });
    }
  } else {
    createdList = await prisma.shoppingList.create({ data: listPayload });
  }

  const products = Array.isArray(data.products) ? data.products : (Array.isArray(data.items) ? data.items : []);
  let createdCount = 0;
  for (const p of products) {
    try {
      const name = (p.name || p.catalogProduct?.name || '').trim();
      if (!name) continue;

      const categoryName = p.category || p.catalogProduct?.category?.name || "Outros";

      // 1. Ensure category
      const category = await prisma.category.upsert({
        where: { name: categoryName },
        update: {},
        create: { name: categoryName }
      });

      // 2. Ensure catalog product
      const catalogProduct = await prisma.catalogProduct.upsert({
        where: { name },
        update: { categoryId: category.id },
        create: { name, categoryId: category.id }
      });

      // 3. Create shopping list item
      await prisma.shoppingListItem.create({
        data: {
          quantity: Number.isInteger(p.quantity) ? p.quantity : (p.quantity ? parseInt(p.quantity) : 1),
          unitPrice: p.unitPrice !== undefined ? p.unitPrice : null,
          totalPrice: p.totalPrice !== undefined ? p.totalPrice : null,
          checked: typeof p.checked === 'boolean' ? p.checked : false,
          shoppingListId: createdList.id,
          catalogProductId: catalogProduct.id,
        },
      });
      createdCount += 1;
    } catch (err) {
      console.error('Failed to create item', p.name, err.message || err);
    }
  }

  console.log(`Imported shopping list '${createdList.name || createdList.id}' with ${createdCount} items. List id: ${createdList.id}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
