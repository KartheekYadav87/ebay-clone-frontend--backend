'use client';

import { useEffect, useState } from 'react';
import { Loader2, Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartItem {
  id: number;
  buyerId: number;
  productId: number;
  quantity: number;
  addedDate: string;
  product?: Product;
}

export default function CartItems() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<{ [key: number]: Product }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState<number | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      
      // For demo purposes, using buyerId = 1
      const cartResponse = await fetch('/api/cart?buyerId=1');
      if (!cartResponse.ok) {
        throw new Error('Failed to fetch cart');
      }
      const cartData = await cartResponse.json();
      
      // Fetch all products
      const productsResponse = await fetch('/api/products');
      if (!productsResponse.ok) {
        throw new Error('Failed to fetch products');
      }
      const productsData = await productsResponse.json();
      
      // Create a map of products by ID
      const productsMap: { [key: number]: Product } = {};
      productsData.forEach((product: Product) => {
        productsMap[product.id] = product;
      });
      
      setCartItems(cartData);
      setProducts(productsMap);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdatingItem(cartId);
      
      const response = await fetch(`/api/cart?id=${cartId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: newQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      await fetchCart();
      toast.success('Quantity updated');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    } finally {
      setUpdatingItem(null);
    }
  };

  const removeItem = async (cartId: number) => {
    try {
      setUpdatingItem(cartId);
      
      const response = await fetch(`/api/cart?id=${cartId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      await fetchCart();
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    } finally {
      setUpdatingItem(null);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products[item.productId];
      if (product) {
        return total + (product.price * item.quantity);
      }
      return total;
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-muted-foreground mb-4">Your cart is empty</p>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <a href="/">Continue Shopping</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        {cartItems.map((item) => {
          const product = products[item.productId];
          if (!product) return null;

          return (
            <div
              key={item.id}
              className="flex items-center gap-4 py-4 border-b border-border last:border-b-0"
            >
              <div className="w-24 h-24 bg-background-secondary rounded flex items-center justify-center flex-shrink-0">
                <span className="text-4xl">📦</span>
              </div>
              
              <div className="flex-grow">
                <h3 className="font-semibold text-text-primary mb-1">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-text-primary">
                  ${product.price.toFixed(2)}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={updatingItem === item.id || item.quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">
                  {item.quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={updatingItem === item.id || item.quantity >= product.quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-right min-w-[100px]">
                <p className="font-bold text-lg text-text-primary">
                  ${(product.price * item.quantity).toFixed(2)}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.id)}
                disabled={updatingItem === item.id}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          );
        })}
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-text-primary">Subtotal:</span>
          <span className="text-2xl font-bold text-text-primary">
            ${calculateTotal().toFixed(2)}
          </span>
        </div>
        <Button className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg">
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}