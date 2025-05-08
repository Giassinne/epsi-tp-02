import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product, EnrichmentOptions } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading: boolean = true;
  error: string | null = null;
  showDeleteConfirm: boolean = false;
  enrichmentOptions: EnrichmentOptions = {
    tone: 'professional',
    length: 'medium'
  };
  enriching: boolean = false;
  showEnrichmentForm: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.error = 'Invalid product ID';
      this.loading = false;
      return;
    }

    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load product details. Please try again later.';
        console.error('Error loading product:', err);
        this.loading = false;
      }
    });
  }

  confirmDelete(): void {
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  deleteProduct(): void {
    if (!this.product || !this.product.id) return;
    
    this.loading = true;
    this.productService.deleteProduct(this.product.id).subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.error = 'Failed to delete product. Please try again later.';
        console.error('Error deleting product:', err);
        this.loading = false;
      }
    });
  }

  toggleEnrichmentForm(): void {
    this.showEnrichmentForm = !this.showEnrichmentForm;
  }

  enrichDescription(): void {
    if (!this.product || !this.product.id) return;
    
    this.enriching = true;
    this.productService.enrichProductDescription(this.product.id, this.enrichmentOptions).subscribe({
      next: (updatedProduct) => {
        this.product = updatedProduct;
        this.enriching = false;
        this.showEnrichmentForm = false;
      },
      error: (err) => {
        this.error = 'Failed to enrich product description. Please try again later.';
        console.error('Error enriching description:', err);
        this.enriching = false;
      }
    });
  }

  keepEnrichedDescription(): void {
    if (!this.product || !this.product.id || !this.product.enrichedDescription) return;
    
    const updatedProduct = {
      ...this.product,
      description: this.product.enrichedDescription,
      enrichedDescription: undefined
    };
    
    this.loading = true;
    this.productService.updateProduct(updatedProduct).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to update product. Please try again later.';
        console.error('Error updating product:', err);
        this.loading = false;
      }
    });
  }

  discardEnrichedDescription(): void {
    if (this.product) {
      this.product = {
        ...this.product,
        enrichedDescription: undefined
      };
    }
  }
}