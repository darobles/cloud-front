import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from '../shared/interfaces/product';
import { environment } from '../../enviroment/environment';
import { CartItem } from '../shared/interfaces/cart-item';
import { User } from '../shared/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class CloudApiService {

  cartModalTrigger: any;

  private baseUrl = environment.url_base;
  constructor() { }

  private http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    const token = localStorage.getItem('access_token');
    const httpOptions = token ? { headers: { 'Authorization': `Bearer ${token}` } } : undefined;
    let data = this.http.get<any>(this.baseUrl+'/api/products/test', httpOptions)
    return data;
  }

  createProduct(formData: FormData): Observable<Product> {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      
    });
    return this.http.post<any>(this.baseUrl+'/api/products',formData, { headers });
  }

  updateProduct(productId: number, formData: FormData): Observable<Product> {
    const token = localStorage.getItem('access_token');
    const httpOptions = token ? { headers: {  'Authorization': `Bearer ${token}` } } : undefined;
    return this.http.put<any>(`${this.baseUrl}/api/products/${productId}`, formData, httpOptions);
  }

  deleteProduct(id: number): Observable<Product> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      
    });
  
    return this.http.delete<any>(this.baseUrl+'/api/products/'+id, { headers });
  }

  processPayment() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      
    });
  
    return this.http.delete<any>(this.baseUrl+'/api/process', { headers });
  }

  getProductsById(params?: Params): Observable<Product> {
    const token = localStorage.getItem('access_token');
    const httpOptions = token ? { headers: { 'Authorization': `Bearer ${token}` } } : undefined;
    let data = this.http.get<any>(this.baseUrl+'/api/products/test', httpOptions)
    return data;
  }

  getCartItems(): Observable<CartItem[]> {
    const token = localStorage.getItem('access_token');
    const httpOptions = token ? { headers: { 'Authorization': `Bearer ${token}` } } : undefined;
    let items = this.http.get<CartItem[]>(this.baseUrl+'/api/cart', httpOptions)
    return items;
  }

  addToCart(product: Product) : Observable<any> {
    const body = { product_id: product.id, quantity: 1 };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    const token = localStorage.getItem('access_token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.post<any>(this.baseUrl+'/api/cart', body, { headers }); 
  }

  updateCartItem(product:Product, quantity:number): Observable<any> {
    console.log('Updating cart item', product, 'with quantity', quantity);
    const body = { quantity };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    const token = localStorage.getItem('access_token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    let req = this.http.put<any>(this.baseUrl+'/api/cart/'+product.id, body, { headers });
    req.subscribe(data => {
      console.log('Cart item updated:', data);
    });
    return req;
  }

  removeCartItem(product:Product): Observable<any> {
    console.log('Removing cart item', product);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });  
    const token = localStorage.getItem('access_token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    let req = this.http.delete<any>(this.baseUrl+'/api/cart/'+product.id, { headers })
    req.subscribe(data => {
      console.log('Cart item removed:', data);
    }
    );
    return req;
  }

  signIn(username: string, password: string): Observable<User> {
    console.log('Signing in with', username);
    let sign_ret = this.http.post<any>(this.baseUrl+'/api/login', { username, password })
    sign_ret.subscribe(data => {
      console.log('Access token:', data.access_token);
      localStorage.setItem('access_token', data.access_token);
    });
    return sign_ret;
  }

  signOut() {
    localStorage.removeItem('access_token');
  }

  getUser(): Observable<User> {
    const token = localStorage.getItem('access_token');
    const httpOptions = {
      headers: { 'Authorization': `Bearer ${token}` }
    };
    return this.http.get<User>(`${this.baseUrl}/api/users/info`, httpOptions);
  }


}
