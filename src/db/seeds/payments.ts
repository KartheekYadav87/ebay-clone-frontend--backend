import { db } from '@/db';
import { payments } from '@/db/schema';

async function main() {
    const currentDate = new Date();
    
    const samplePayments = [
        {
            orderId: 1,
            paymentType: 'Credit Card',
            amount: 1299.99,
            paymentDate: new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            orderId: 2,
            paymentType: 'PayPal',
            amount: 579.98,
            paymentDate: new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            orderId: 3,
            paymentType: 'Credit Card',
            amount: 899.99,
            paymentDate: new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            orderId: 4,
            paymentType: 'Debit Card',
            amount: 249.98,
            paymentDate: new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        }
    ];

    await db.insert(payments).values(samplePayments);
    
    console.log('✅ Payments seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});