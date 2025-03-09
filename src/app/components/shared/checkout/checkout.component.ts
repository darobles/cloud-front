import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart-service.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  cartItems: any[] = history.state.cartItems || [];
  //contact details
  email: string = '';
  name: string = '';
  phone: string = '';

  // Address details
  address: string = '';
  city: string = '';
  state: string = '';
  zip: string = '';
  country: string = '';

  // Payment details
  paymentMethod: string = 'card';
  cardNumber: string = '';
  cardName: string = '';
  cardExpiry: string = '';
  cardCVC: string = '';

  constructor(private cartService: CartService) {}
  
  checkout() {
    console.log(
      'Checking out with',
      this.paymentMethod,
      this.cardNumber,
      this.cardName,
      this.cardExpiry,
      this.cardCVC,
      this.address,
      this.city,
      this.state,
      this.zip,
      this.country
    );
    // Add payment processing and order submission logic here.
  }

  processPayment() {
    this.cartItems = [];
    console.log('Processing payment with', this.paymentMethod);
    // Add payment processing logic here
    this.cartService.processPayment();
  }
}
