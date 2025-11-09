import { db } from '@/db';
import { orders } from '@/db/schema';

async function main() {
    const now = new Date();
    
    const sampleOrders = [
        {
            buyerId: 1,
            totalAmount: 1299.99,
            status: 'Delivered',
            orderDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            buyerId: 2,
            totalAmount: 579.98,
            status: 'Shipped',
            orderDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            buyerId: 4,
            totalAmount: 899.99,
            status: 'Processing',
            orderDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            buyerId: 6,
            totalAmount: 249.98,
            status: 'Pending',
            orderDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ];

    await db.insert(orders).values(sampleOrders);
    
    console.log('✅ Orders seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});