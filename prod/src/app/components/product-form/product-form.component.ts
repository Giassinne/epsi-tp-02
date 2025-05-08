import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode: boolean = false;
  productId: number | null = null;
  loading: boolean = false;
  submitting: boolean = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {
    this.productForm = this.createForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.productId = Number(id);
      this.loadProduct(this.productId);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required]
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load product details. Please try again later.';
        console.error('Error loading product:', err);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      return;
    }

    const product: Product = this.productForm.value;
    this.submitting = true;

    if (this.isEditMode && this.productId) {
      product.id = this.productId;
      this.updateProduct(product);
    } else {
      this.createProduct(product);
    }
  }

  createProduct(product: Product): void {
    this.productService.createProduct(product).subscribe({
      next: (newProduct) => {
        this.success = 'Product created successfully!';
        this.submitting = false;
        // Navigate to the new product after a short delay
        setTimeout(() => {
          this.router.navigate(['/products', newProduct.id]);
        }, 1500);
      },
      error: (err) => {
        this.error = 'Failed to create product. Please try again later.';
        console.error('Error creating product:', err);
        this.submitting = false;
      }
    });
  }

  updateProduct(product: Product): void {
    this.productService.updateProduct(product).subscribe({
      next: (updatedProduct) => {
        this.success = 'Product updated successfully!';
        this.submitting = false;
        // Navigate to the product details after a short delay
        setTimeout(() => {
          this.router.navigate(['/products', updatedProduct.id]);
        }, 1500);
      },
      error: (err) => {
        this.error = 'Failed to update product. Please try again later.';
        console.error('Error updating product:', err);
        this.submitting = false;
      }
    });
  }

  // Helper method to mark all form controls as touched
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Form validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const control = this.productForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(fieldName: string): string {
    const control = this.productForm.get(fieldName);
    if (!control) return '';

    if (control.errors?.['required']) {
      return `${this.formatFieldName(fieldName)} is required`;
    }
    
    if (control.errors?.['minlength']) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `${this.formatFieldName(fieldName)} must be at least ${minLength} characters`;
    }
    
    if (control.errors?.['min']) {
      const min = control.errors?.['min'].min;
      return `${this.formatFieldName(fieldName)} must be at least ${min}`;
    }

    return 'Invalid field';
  }

  private formatFieldName(fieldName: string): string {
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  }
}