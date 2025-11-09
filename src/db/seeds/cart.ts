import { db } from '@/db';
import { cart } from '@/db/schema';

async function main() {
    const now = new Date();
    
    const sampleCartItems = [
        {
            buyerId: 1,
            productId: 3,
            quantity: 1,
            addedDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            buyerId: 1,
            productId: 7,
            quantity: 2,
            addedDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            buyerId: 2,
            productId: 5,
            quantity: 1,
            addedDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            buyerId: 4,
            productId: 12,
            quantity: 3,
            addedDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            buyerId: 4,
            productId: 9,
            quantity: 1,
            addedDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            buyerId: 6,
            productId: 14,
            quantity: 2,
            addedDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ];

    await db.insert(cart).values(sampleCartItems);
    
    console.log('✅ Cart seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});