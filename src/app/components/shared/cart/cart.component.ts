import { Component, OnInit, ViewChild } from '@angular/core';
import { CartItem } from '../../../shared/interfaces/cart-item';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CartService } from '../../../services/cart-service.service';
import { CloudApiService } from '../../../services/cloud-api.service';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent  implements OnInit {
  cartItems: CartItem[] = [];
  totalSum: number = 0;
  isVisible: boolean = false;
  subscription: Subscription | undefined;
  @ViewChild('closebutton') closebutton: any;

    
  constructor(private cartService: CartService, private apiservice: CloudApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.subscription = this.cartService.cartModalTrigger.subscribe(() => {
      console.log('Cart modal trigger received in CartComponent');
      this.openCart();
    });
  }


  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  loadCartItems(): void {
    console.log('Loading cart items');
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotal();
  }

  openCart(): void {
    console.log('Opening cart modal');
    this.loadCartItems();
    this.isVisible = true;
  }

  closeCart(): void {
    this.isVisible = false;
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity < 1) {
      return;
    }
    item.quantity = newQuantity;
    if (item.product) {
      this.apiservice.updateCartItem(item.product, newQuantity);
      this.cartService.updateCartItem(item.product, newQuantity);
    }
    this.calculateTotal();
  }

  removeItem(item: CartItem): void {
    if (item.product) {
      this.apiservice.removeCartItem(item.product);
      this.cartService.removeCartItem(item.product);
    }
    this.loadCartItems();
  }

  calculateTotal(): void {
    this.totalSum = this.cartItems.reduce((acc, item) => item.product ? acc + (item.product.price * item.quantity) : acc, 0);
    this.totalSum = parseFloat(this.totalSum.toFixed(2));
  }

  goToCheckout() {
    this.closebutton.nativeElement.click();
    this.router.navigate(['/checkout'], { state: { cartItems: this.cartItems } });
  }
}