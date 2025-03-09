import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CloudApiService } from '../../../services/cloud-api.service';
import { AuthService } from '../../../services/auth-service.service';
import * as bootstrap from 'bootstrap'; // Use a namespace import instead
import { CartService } from '../../../services/cart-service.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {
  username: string = '';
  password: string = '';

  @ViewChild('login_modal') modalElement!: ElementRef;
  modalInstance!: bootstrap.Modal;
  @ViewChild('closebutton') closebutton: any;

  constructor(
    private cloudservice: CloudApiService,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    // Ensure this code runs in the browser
    if (typeof document !== 'undefined' && this.modalElement?.nativeElement) {
      this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
    }
  }
  

  login(): void {
    this.cloudservice.signIn(this.username, this.password).subscribe(data => {
      if (data) {
        this.cloudservice.getUser().subscribe(user => {
          this.authService.login(user); 
          console.log('User logged in:', data);
          this.authService.setLoggedIn(true);
          this.cloudservice.getCartItems().subscribe(cartItems => {
            this.cartService.setCartItems(cartItems);
          });
        }
        );

        //this.cloudservice.getCartItems();
        // Close modal only if modalInstance exists
        if (this.modalInstance) {
          console.log('Closing modal');    
          this.closebutton.nativeElement.click();          
          this.modalInstance.hide();
          this.router.navigate(['/']);

        }
      } else {
        console.log('Login failed');
      }
    });
    console.log('Logging in with', this.username, this.password);
  }

}
