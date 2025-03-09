import { Component, OnInit } from '@angular/core';
import { Product } from '../../shared/interfaces/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CloudApiService } from '../../services/cloud-api.service';
import { EditProductComponent } from './modals/edit-product/edit-product.component';
import { AddProductComponent } from "./modals/add-product/add-product.component";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, EditProductComponent, AddProductComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product = { 
    id: 0,
    name: '', 
    price: 0, 
    description: '', 
    category: '', 
    category_id: 0,
    stock: 0,
    image: '',
    created_at: '',
    updated_at: ''
  };
  newProduct: Product = { 
    id: 0,
    name: '', 
    price: 0, 
    description: '', 
    category: '', 
    category_id: 0,
    stock: 0,
    image: '',
    created_at: '',
    updated_at: ''
  };
  constructor(private apiservice: CloudApiService) { }
  ngOnInit(): void {
    this.apiservice.getProducts().subscribe((data: Product[]) => {
      this.products = data;
    } );
  } 

  

  addProduct() {
    if (this.newProduct.name && this.newProduct.price) {
      // Add a copy of newProduct and reset the form.
      this.products.push({ ...this.newProduct });
      this.newProduct = { 
        id: 0,
        name: '', 
        price: 0, 
        description: '', 
        category: '', 
        category_id: 0,
        stock: 0,
        image: '',
        created_at: '',
        updated_at: ''
      };
    }
  }

  editProduct(product: Product) {
    // Enable editing mode on the selected product.
    console.log(product);
    (product as any).editing = true;
    this.selectedProduct = { ...product };

  }

  saveProduct(product: Product) {
    // Save changes and disable editing mode.
    (product as any).editing = false;
  }

  deleteProduct(product: Product) {
    // Remove the product from the list.
    this.products = this.products.filter(p => p !== product);
    this.apiservice.deleteProduct(product.id).subscribe(data => {
      console.log('Product deleted:', data);
    } );
  }
}