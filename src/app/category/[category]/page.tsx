import { Suspense } from 'react';
import HeaderNavigation from '@/components/sections/header-navigation';
import Footer from '@/components/sections/footer';
import ProductGrid from '@/components/products/product-grid';
import { Loader2 } from 'lucide-react';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const decodedCategory = decodeURIComponent(params.category);
  
  return (
    <div className="min-h-screen bg-background-primary">
      <HeaderNavigation />
      
      <main className="w-full py-8">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold text-text-primary mb-6 capitalize">
            {decodedCategory}
          </h1>
          
          <Suspense fallback={
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }>
            <ProductGrid category={decodedCategory} />
          </Suspense>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
