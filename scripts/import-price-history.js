#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();

  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: node ./scripts/import-price-history.js <path-to-json>');
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

  const listDate = data.date ? new Date(data.date) : new Date();
  const products = Array.isArray(data.products) ? data.products : [];

  let created = 0;
  const createdEntries = [];
  for (const p of products) {
    if (p.unitPrice === undefined || p.unitPrice === null) continue;
    try {
      const entry = await prisma.priceHistory.create({
        data: {
          productName: p.name,
          unitPrice: Number(p.unitPrice),
          purchaseDate: listDate,
        },
      });
      created += 1;
      createdEntries.push(entry);
    } catch (err) {
      console.error('Failed to create price history for', p.name, err.message || err);
    }
  }

  console.log(`Imported ${created} price_history entries from ${filePath}`);
  await prisma.$disconnect();
  // Print created ids for convenience
  createdEntries.forEach(e => console.log(e.id, e.productName, e.unitPrice));
}

main().catch((e) => { console.error(e); process.exit(1); });
