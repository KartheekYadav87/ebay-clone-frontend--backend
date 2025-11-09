import { Suspense } from 'react';
import HeaderNavigation from '@/components/sections/header-navigation';
import Footer from '@/components/sections/footer';
import CartItems from '@/components/cart/cart-items';
import { Loader2 } from 'lucide-react';

export default function CartPage() {
  return (
    <div className="min-h-screen bg-background-primary">
      <HeaderNavigation />
      
      <main className="w-full py-8">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold text-text-primary mb-6">
            Shopping Cart
          </h1>
          
          <Suspense fallback={
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }>
            <CartItems />
          </Suspense>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
