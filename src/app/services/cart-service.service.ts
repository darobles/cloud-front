import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from '../shared/interfaces/product';
import { CartItem } from '../shared/interfaces/cart-item';
import { CloudApiService } from './cloud-api.service';
import { Router, RouterLink } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItems: CartItem[] = [];
  cartModalTrigger: Subject<void> = new Subject();
  private cartCountSubject: Subject<number> = new Subject<number>();
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private apiservice: CloudApiService, private router: Router) { }

  private updateCartCount(): void {    
    const totalCount = this.cartItems.reduce((count, item) => count + item.quantity, 0);
    this.cartCountSubject.next(totalCount);
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  setCartItems(items: CartItem[]): void {
    this.cartItems = items; 
    this.updateCartCount();
  }

  updateCartItem(product: Product, quantity: number): void {
    const index = this.cartItems.findIndex(item => item.product === product);
    if (index > -1) {
      this.cartItems[index].quantity = quantity;
      this.updateCartCount();
    }
  }

  removeCartItem(product: Product): void {
    this.cartItems = this.cartItems.filter(item => item.product !== product);
    this.updateCartCount();
  }

  // Call this method to notify subscribers that the cart modal should open.
  openCartModal(): void {
    console.log('openCartModal() called2');
    this.cartModalTrigger.next();
  }

  // For adding an item to the cart (if needed)
  addCartItem(product: Product, quantity: number = 1): void {
    const existingItem = this.cartItems.find(item => item.product === product);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ product, quantity });
    }
    this.updateCartCount();
  }

  processPayment() {
    this.cartItems = [];
    this.updateCartCount();
    this.apiservice.processPayment().subscribe(data => {
      console.log('Payment processed:', data);
      this.router.navigate(['/complete'], { state: { cartItems: this.cartItems } });

    }); 
    
  }
  
}