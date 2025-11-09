import { db } from '@/db';
import { auctions } from '@/db/schema';

async function main() {
    console.log('🔍 Starting auction seeder with detailed logging...');
    
    const sampleAuctions = [
        {
            productId: 3,
            minPrice: 350.00,
            winningBidId: 2,
        },
        {
            productId: 6,
            minPrice: 600.00,
            winningBidId: 3,
        },
        {
            productId: 12,
            minPrice: 380.00,
            winningBidId: 6,
        }
    ];

    try {
        console.log('📝 Sample auction data to insert:', JSON.stringify(sampleAuctions, null, 2));
        
        for (let i = 0; i < sampleAuctions.length; i++) {
            const auction = sampleAuctions[i];
            console.log(`\n🔄 Attempting to insert auction ${i + 1}:`, auction);
            
            try {
                const result = await db.insert(auctions).values(auction).returning();
                console.log(`✅ Successfully inserted auction ${i + 1}:`, result);
            } catch (insertError) {
                console.error(`❌ Failed to insert auction ${i + 1}:`, insertError);
                console.error('Failed auction data:', auction);
                throw insertError;
            }
        }
        
        console.log('\n✅ All auctions seeder completed successfully');
        
        const insertedAuctions = await db.select().from(auctions);
        console.log('📊 Total auctions in database:', insertedAuctions.length);
        console.log('📋 Inserted auction records:', JSON.stringify(insertedAuctions, null, 2));
        
    } catch (error) {
        console.error('\n❌ Auction seeder failed with error:', error);
        
        if (error instanceof Error) {
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        
        throw error;
    }
}

main().catch((error) => {
    console.error('❌ Fatal error in auction seeder:', error);
    process.exit(1);
});