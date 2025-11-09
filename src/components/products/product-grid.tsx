'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Heart, Loader2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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

interface ProductGridProps {
  category?: string;
  limit?: number;
}

export default function ProductGrid({ category, limit }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      let url = '/api/products';
      const params = new URLSearchParams();
      
      if (category) {
        params.append('category', category);
      }
      if (limit) {
        params.append('limit', limit.toString());
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
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
      
      // For demo purposes, using buyerId = 1 (first user)
      // In production, this should come from the authenticated user session
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
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-muted-foreground">No products found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200 flex flex-col"
        >
          <div className="relative h-[225px] bg-background-secondary flex items-center justify-center border-b border-border">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
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
              <div className="flex items-center justify-between mb-3">
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
      ))}
    </div>
  );
}