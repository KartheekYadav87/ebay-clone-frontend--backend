import { db } from '@/db';
import { users } from '@/db/schema';

async function main() {
    const sampleUsers = [
        {
            name: 'John Smith',
            email: 'john.smith@email.com',
            password: 'password123',
            phone: '555-0100',
            address: '123 Main Street, Springfield, IL',
            userType: 'buyer',
            createdAt: new Date('2024-10-15').toISOString(),
        },
        {
            name: 'Sarah Johnson',
            email: 'sarah.johnson@email.com',
            password: 'password123',
            phone: '555-0101',
            address: '456 Oak Avenue, Chicago, IL',
            userType: 'buyer',
            createdAt: new Date('2024-10-20').toISOString(),
        },
        {
            name: 'Michael Brown',
            email: 'michael.brown@email.com',
            password: 'password123',
            phone: '555-0102',
            address: '789 Pine Road, Aurora, IL',
            userType: 'seller',
            createdAt: new Date('2024-11-01').toISOString(),
        },
        {
            name: 'Emma Davis',
            email: 'emma.davis@email.com',
            password: 'password123',
            phone: '555-0103',
            address: '321 Elm Street, Naperville, IL',
            userType: 'buyer',
            createdAt: new Date('2024-11-05').toISOString(),
        },
        {
            name: 'James Wilson',
            email: 'james.wilson@email.com',
            password: 'password123',
            phone: '555-0104',
            address: '654 Maple Drive, Joliet, IL',
            userType: 'seller',
            createdAt: new Date('2024-11-10').toISOString(),
        },
        {
            name: 'Olivia Martinez',
            email: 'olivia.martinez@email.com',
            password: 'password123',
            phone: '555-0105',
            address: '987 Cedar Lane, Peoria, IL',
            userType: 'buyer',
            createdAt: new Date('2024-11-15').toISOString(),
        },
        {
            name: 'David Lee',
            email: 'david.lee@email.com',
            password: 'password123',
            phone: '555-0106',
            address: '147 Birch Boulevard, Rockford, IL',
            userType: 'seller',
            createdAt: new Date('2024-11-20').toISOString(),
        },
        {
            name: 'Sophia Garcia',
            email: 'sophia.garcia@email.com',
            password: 'password123',
            phone: '555-0107',
            address: '258 Willow Way, Champaign, IL',
            userType: 'buyer',
            createdAt: new Date('2024-11-25').toISOString(),
        },
        {
            name: 'Robert Taylor',
            email: 'robert.taylor@email.com',
            password: 'password123',
            phone: '555-0108',
            address: '369 Spruce Court, Evanston, IL',
            userType: 'seller',
            createdAt: new Date('2024-12-01').toISOString(),
        },
        {
            name: 'Emily Anderson',
            email: 'emily.anderson@email.com',
            password: 'password123',
            phone: '555-0109',
            address: '741 Hickory Place, Decatur, IL',
            userType: 'admin',
            createdAt: new Date('2024-12-05').toISOString(),
        }
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});