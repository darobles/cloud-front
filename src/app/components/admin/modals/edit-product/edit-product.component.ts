import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as bootstrap from 'bootstrap'; // Use a namespace import instead
import { Product } from '../../../../shared/interfaces/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CloudApiService } from '../../../../services/cloud-api.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent implements AfterViewInit {
  constructor(private apiservice: CloudApiService) {}

  @Input() product!: Product; // Bind product information here.
  @ViewChild('editProductModal') modalElement!: ElementRef;
  modalInstance!: bootstrap.Modal;
  @ViewChild('closebutton') closebutton: any;

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

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

  updateProduct() {
    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('description', this.product.description);
    formData.append('price', this.product.price.toString());
    formData.append('category_id', this.product.category_id.toString());
    formData.append('stock', this.product.stock.toString());
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }
    console.log('Form data:', formData);
    this.apiservice.updateProduct(this.product.id, formData).subscribe(data => {
      console.log('Product updated:', data);
      this.closebutton.nativeElement.click();
    });
  }
}
