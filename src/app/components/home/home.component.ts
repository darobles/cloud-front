import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../shared/interfaces/product';
import { CloudApiService } from '../../services/cloud-api.service';
import { CartService } from '../../services/cart-service.service'; // Added CartService import

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: string = 'all';

  constructor(
    private productService: CloudApiService,
    private cartService: CartService // Inject CartService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
      this.applyFilter();
    });
  }

  setCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.selectedCategory === 'all') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product => product.category === this.selectedCategory);
    }
  }

  addToCart(product: Product): void {
    this.productService.addToCart(product).subscribe(() => {
      console.log('Added to cart:', product); 
    });
  
    this.cartService.addCartItem(product, 1); // Add product with quantity 1
    console.log('Added to cart:', product);
  }
}