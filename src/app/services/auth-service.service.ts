import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CloudApiService } from './cloud-api.service';
import { CartService } from './cart-service.service';
import { User } from '../shared/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private loggedInSubject: BehaviorSubject<boolean>;
  public isLoggedIn$: Observable<boolean>;

  constructor(private cloudapiservice: CloudApiService, private cartService: CartService) {
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();

    const storedStatus = localStorage.getItem('isLoggedIn') === 'true';
    this.loggedInSubject = new BehaviorSubject<boolean>(storedStatus);
    this.isLoggedIn$ = this.loggedInSubject.asObservable();
  }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser(): Observable<User | null> {
    const token = localStorage.getItem('access_token');
    if (token) {
      this.cloudapiservice.getUser().subscribe(user => {
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      });
    }
    return this.currentUser$;
  }

  setLoggedIn(status: boolean): void {
    localStorage.setItem('isLoggedIn', status ? 'true' : 'false');
    this.loggedInSubject.next(status);
  }

 

  login(user: User): void {
    console.log('AuthService.login() user:', user);
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.setLoggedIn(true);
  }

  logout(): void {
    this.cloudapiservice.signOut();
    localStorage.setItem('isLoggedIn', 'false');
    this.loggedInSubject.next(false);
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.cloudapiservice.getCartItems().subscribe(cartItems => {
      this.cartService.setCartItems(cartItems);
    });
 }
}