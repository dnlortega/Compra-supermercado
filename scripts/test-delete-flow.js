const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  const name = 'TEST_PRODUCT_DELETE';

  try {
    console.log('--- Test delete flow START ---');

    // Create or upsert catalog product
    await prisma.catalogProduct.upsert({
      where: { name },
      update: { category: 'Test' },
      create: { name, category: 'Test' },
    });

    // Create a product entry
    const product = await prisma.product.create({
      data: {
        name,
        quantity: 1,
        category: 'Test',
        // shoppingListId left null (orphan) so it won't affect lists
      },
    });

    // Create some price history entries
    await prisma.priceHistory.createMany({
      data: [
        { productName: name, unitPrice: 10.5, purchaseDate: new Date() },
        { productName: name, unitPrice: 11.0, purchaseDate: new Date(Date.now() - 86400000) },
      ],
    });

    // Print counts before
    const beforeProducts = await prisma.product.count({ where: { name: { equals: name, mode: 'insensitive' } } });
    const beforePH = await prisma.priceHistory.count({ where: { productName: { equals: name, mode: 'insensitive' } } });
    const beforeCatalog = await prisma.catalogProduct.count({ where: { name: { equals: name, mode: 'insensitive' } } });

    console.log('Before - products:', beforeProducts, 'priceHistory:', beforePH, 'catalog:', beforeCatalog);

    // Now perform deletion similar to deleteProduct
    // 1) delete price history entries
    await prisma.priceHistory.deleteMany({ where: { productName: { equals: name, mode: 'insensitive' } } });
    console.log('Deleted priceHistory entries for', name);

    // 2) delete the product
    await prisma.product.delete({ where: { id: product.id } });
    console.log('Deleted product id', product.id);

    // 3) if no other products with same name exist, delete catalog entry
    const others = await prisma.product.count({ where: { name: { equals: name, mode: 'insensitive' } } });
    console.log('Other products with same name after deletion:', others);
    if (others === 0) {
      const del = await prisma.catalogProduct.deleteMany({ where: { name: { equals: name, mode: 'insensitive' } } });
      console.log('Deleted catalogProduct count:', del.count || del);
    }

    // Print counts after
    const afterProducts = await prisma.product.count({ where: { name: { equals: name, mode: 'insensitive' } } });
    const afterPH = await prisma.priceHistory.count({ where: { productName: { equals: name, mode: 'insensitive' } } });
    const afterCatalog = await prisma.catalogProduct.count({ where: { name: { equals: name, mode: 'insensitive' } } });

    console.log('After - products:', afterProducts, 'priceHistory:', afterPH, 'catalog:', afterCatalog);

    console.log('--- Test delete flow END ---');
  } catch (err) {
    console.error('Error during test-delete-flow:', err);
  } finally {
    await prisma.$disconnect();
  }
})();
