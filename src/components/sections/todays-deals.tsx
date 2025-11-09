'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Heart, Loader2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { FC } from 'react';

interface Product {
  id: number;
  sellerId: number;
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  isAuction: string;
  expirationDate: string | null;
  rating: number | null;
  imageUrl: string | null;
  createdAt: string;
}

const TodaysDeals: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/products?limit=6');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      setAddingToCart(productId);
      
      // For demo purposes, using buyerId = 1
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buyerId: 1,
          productId: productId,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      toast.success('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  if (isLoading) {
    return (
      <section className="bg-background-secondary py-8 sm:py-12">
        <div className="container">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background-secondary py-8 sm:py-12">
      <div className="container">
        <div className="flex items-baseline mb-4">
          <h2 className="font-display text-3xl font-bold text-text-primary tracking-tight">Today's Deals</h2>
          <p className="ml-4 text-sm text-muted-foreground">All With Free Shipping</p>
        </div>
        <div className="overflow-hidden">
          <ul className="flex gap-4 overflow-x-auto pb-4 -mb-4 snap-x snap-mandatory">
            {products.map((product) => (
              <li key={product.id} className="w-[225px] flex-shrink-0 snap-start">
                <div className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200 group h-full flex flex-col">
                  <div className="relative h-[225px] bg-background-secondary flex items-center justify-center border-b border-border">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="225px"
                      />
                    ) : (
                      <div className="text-6xl">📦</div>
                    )}
                    
                    <button
                      type="button"
                      aria-label="Add to watchlist"
                      className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow text-text-secondary hover:text-destructive transition-colors"
                    >
                      <Heart size={18} />
                    </button>

                    {product.isAuction === 'Y' && (
                      <div className="absolute top-2 left-2 bg-gold-yellow text-text-primary text-xs font-bold px-2 py-1 rounded">
                        AUCTION
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-grow">
                    <p className="font-sans text-sm text-text-primary h-10 overflow-hidden leading-tight mb-2">
                      {product.name}
                    </p>
                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-sans font-bold text-lg text-text-primary">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.rating && (
                          <span className="text-xs text-muted-foreground">
                            ⭐ {product.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <Button
                        onClick={() => handleAddToCart(product.id)}
                        disabled={addingToCart === product.id || product.quantity === 0}
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                        size="sm"
                      >
                        {addingToCart === product.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : product.quantity === 0 ? (
                          'Out of Stock'
                        ) : (
                          <>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TodaysDeals;