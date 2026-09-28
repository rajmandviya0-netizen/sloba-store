import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { StoreService } from 'src/app/services/store.service';

const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 350 };

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  cols = 3;
  rowHeight: number = ROWS_HEIGHT[this.cols];
  products: Array<Product> | undefined;
  allProducts: Array<Product> = [];
  count = '12';
  sort = 'desc';
  category: string | undefined;
  productsSubscription: Subscription | undefined;

  constructor(
    private cartService: CartService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  onColumnsCountChange(colsNum: number): void {
    this.cols = colsNum;
    this.rowHeight = ROWS_HEIGHT[colsNum];
  }

  onItemsCountChange(count: number): void {
    this.count = count.toString();
    this.applyFilters();
  }

  onSortChange(newSort: string): void {
    this.sort = newSort;
    this.applyFilters();
  }

  onShowCategory(newCategory: string): void {
    this.category = newCategory;
    this.applyFilters();
  }

  // One network request, only on first load
  loadProducts(): void {
    this.productsSubscription = this.storeService
      .getAllProducts('100', 'asc')
      .subscribe((_products) => {
        this.allProducts = _products;
        this.applyFilters();
      });
  }

  // Instant: works on the array already in memory
  applyFilters(): void {
    const filtered = this.allProducts
      .filter((p) => !this.category || p.category === this.category)
      .sort((a, b) => (this.sort === 'desc' ? b.id - a.id : a.id - b.id));
    this.products = filtered.slice(0, Number(this.count));
  }

  trackById(index: number, product: Product): number {
    return product.id;
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id,
    });
  }

  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }
}