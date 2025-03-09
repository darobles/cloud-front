import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as bootstrap from 'bootstrap'; // Use a namespace import instead
import { Product } from '../../../../shared/interfaces/product';
import { CloudApiService } from '../../../../services/cloud-api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent {
constructor(private apiservice: CloudApiService) {}
product: Product = { 
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
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
    @ViewChild('addProductModal') modalElement!: ElementRef;
    modalInstance!: bootstrap.Modal;
    @ViewChild('closebutton') closebutton: any;

    ngAfterViewInit() {
      // Ensure this code runs in the browser
      if (typeof document !== 'undefined' && this.modalElement?.nativeElement) {
        this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
      }
    }
    open() {
      this.modalInstance.show();
    }
  
    close() {
      this.modalInstance.hide();
    }

    onFileSelected(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.selectedFile = input.files[0];
  
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
        };
        reader.readAsDataURL(this.selectedFile);
      }
    }

    createProduct() {
      const formData = new FormData();
      formData.append('name', this.product.name);
      formData.append('description', this.product.description);
      formData.append('price', this.product.price.toString());
      formData.append('category_id', this.product.category_id.toString());
      formData.append('stock', this.product.stock.toString());
      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }
      console.log('Product:', this.product);
      console.log(formData);
      this.apiservice.createProduct(formData).subscribe(data => {

        console.log('Product created:', data);
        this.product = { 
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
        this.closebutton.nativeElement.click();
      });
    }
}
