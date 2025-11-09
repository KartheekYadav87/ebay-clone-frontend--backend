import { db } from '@/db';
import { bids } from '@/db/schema';

async function main() {
    const now = new Date();
    
    const sampleBids = [
        {
            productId: 3,
            buyerId: 1,
            bidAmount: 420.00,
            bidDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            productId: 3,
            buyerId: 2,
            bidAmount: 435.00,
            bidDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            productId: 6,
            buyerId: 4,
            bidAmount: 675.00,
            bidDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            productId: 10,
            buyerId: 6,
            bidAmount: 160.00,
            bidDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            productId: 12,
            buyerId: 8,
            bidAmount: 425.00,
            bidDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            productId: 12,
            buyerId: 1,
            bidAmount: 450.00,
            bidDate: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
        }
    ];

    await db.insert(bids).values(sampleBids);
    
    console.log('✅ Bids seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});