import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Product } from '../models/product.model';

const API_URL = 'https://dummyjson.com';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private products$?: Observable<Array<Product>>;
  private categories$?: Observable<Array<string>>;

  constructor(private httpClient: HttpClient) {}

  // Loads the list once and reuses it, so repeat calls are instant.
  getAllProducts(
    limit = '100',
    sort = 'desc',
    category?: string
  ): Observable<Array<Product>> {
    if (!this.products$) {
      this.products$ = this.httpClient
        .get<{ products: any[] }>(
          `${API_URL}/products?limit=100&select=id,title,description,category,price,thumbnail`
        )
        .pipe(
          map((res) =>
            res.products.map(
              (p) =>
                ({
                  id: p.id,
                  title: p.title,
                  description: p.description,
                  category: p.category,
                  price: p.price,
                  image: p.thumbnail,
                } as Product)
            )
          ),
          shareReplay(1)
        );
    }
    return this.products$;
  }

  getAllCategories(): Observable<Array<string>> {
    if (!this.categories$) {
      this.categories$ = this.httpClient
        .get<any[]>(`${API_URL}/products/categories`)
        .pipe(
          map((list) =>
            list.map((c) => (typeof c === 'string' ? c : c.slug))
          ),
          shareReplay(1)
        );
    }
    return this.categories$;
  }
}