import { db } from '@/db';
import { orderItems } from '@/db/schema';

async function main() {
    console.log('🚀 Starting order_items seeder...');
    
    const sampleOrderItems = [
        {
            orderId: 1,
            productId: 4,
            quantity: 1,
            priceAtPurchase: 1299.99,
        },
        {
            orderId: 2,
            productId: 3,
            quantity: 1,
            priceAtPurchase: 399.99,
        },
        {
            orderId: 2,
            productId: 8,
            quantity: 1,
            priceAtPurchase: 179.99,
        },
        {
            orderId: 3,
            productId: 1,
            quantity: 1,
            priceAtPurchase: 899.99,
        },
        {
            orderId: 4,
            productId: 9,
            quantity: 1,
            priceAtPurchase: 229.99,
        },
        {
            orderId: 4,
            productId: 14,
            quantity: 1,
            priceAtPurchase: 29.99,
        },
    ];

    console.log('📦 Attempting to insert order items:', JSON.stringify(sampleOrderItems, null, 2));

    try {
        for (let i = 0; i < sampleOrderItems.length; i++) {
            const item = sampleOrderItems[i];
            console.log(`\n🔄 Inserting item ${i + 1}/${sampleOrderItems.length}:`, JSON.stringify(item, null, 2));
            
            try {
                const result = await db.insert(orderItems).values(item).returning();
                console.log(`✅ Successfully inserted item ${i + 1}:`, JSON.stringify(result, null, 2));
            } catch (itemError) {
                console.error(`❌ Failed to insert item ${i + 1}:`, item);
                console.error('Error details:', itemError);
                throw itemError;
            }
        }

        const allItems = await db.select().from(orderItems);
        console.log(`\n📊 Total items in database after seeding: ${allItems.length}`);
        console.log('All order items:', JSON.stringify(allItems, null, 2));
        
        console.log('\n✅ Order items seeder completed successfully');
    } catch (error) {
        console.error('\n❌ Order items seeder failed with error:', error);
        if (error instanceof Error) {
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        throw error;
    }
}

main().catch((error) => {
    console.error('❌ Fatal error in seeder:', error);
    process.exit(1);
});