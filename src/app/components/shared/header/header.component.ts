import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../../services/cart-service.service';
import { CommonModule } from '@angular/common';
import { CloudApiService } from '../../../services/cloud-api.service';
import { AuthService } from '../../../services/auth-service.service';
import { AddUserComponent } from '../../admin/modals/add-user/add-user.component';
import { ToastService } from '../../../services/toast.service';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule,AddUserComponent, ToastComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  displayAdmin: boolean = false;
  cartCount: number = 0;
  private cartSubscription!: Subscription;
  userLoggedIn: boolean = false;
  private authSubscription!: Subscription;
  username: string = '';
  @ViewChild('addUserModal') addUserModal!: AddUserComponent;

  constructor(
    private cartService: CartService,
    private cloudservice: CloudApiService,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      console.log('HeaderComponent.ngOnInit() user:', user);
      if (user) {
        this.userLoggedIn = true;
        this.username = user.username;
        this.displayAdmin = user.role_id === 1;
      } else {
        this.userLoggedIn = false;
        this.username = '';
        this.displayAdmin = false;
      }
    });
    this.cloudservice.getCartItems().subscribe(cartItems => {
      this.cartService.setCartItems(cartItems);
    });
  }

  triggerCart(): void {
    console.log('triggerCart() called in HeaderComponent');
    this.cartService.openCartModal();
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  openAddUserModal() {
    this.addUserModal.open();
  }

  showToast(): void {
    this.toastService.show('success', 'User has been created successfully!');
  }
}
