import HeaderNavigation from '@/components/sections/header-navigation';
import RefurbishedGifts from '@/components/sections/refurbished-gifts';
import TodaysDeals from '@/components/sections/todays-deals';
import Footer from '@/components/sections/footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background-primary">
      <HeaderNavigation />
      
      <main className="w-full">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">Welcome to eBay</h1>
          <p className="text-lg text-text-secondary mb-8">Discover amazing deals on products you love</p>
        </div>
        
        <RefurbishedGifts />
        
        <TodaysDeals />
      </main>
      
      <Footer />
    </div>
  );
}