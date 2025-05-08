import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule here



@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule,HttpClientModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  sortOption: string = 'name';
  loading: boolean = true;
  error: string | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products. Please try again later.';
        console.error('Error loading products:', err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    // First apply search filter
    let filtered = this.products;
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(search) || 
        product.description.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search)
      );
    }

    // Then sort
    this.filteredProducts = this.sortProducts(filtered, this.sortOption);
  }

  sortProducts(products: Product[], sortBy: string): Product[] {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortOption = select.value;
    this.applyFilters();
  }
}