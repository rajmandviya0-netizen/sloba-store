import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly STORAGE_KEY = 'sloba-store-cart';

  cart = new BehaviorSubject<Cart>(
    this.loadCartFromStorage()
  );

  constructor(private _snackBar: MatSnackBar) {
    this.cart.subscribe((cart) => {
      this.saveCartToStorage(cart);
    });
  }

  private loadCartFromStorage(): Cart {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) {
        return { items: [] };
      }
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.items)) {
        return parsed as Cart;
      }
      return { items: [] };
    } catch {
      return { items: [] };
    }
  }

  private saveCartToStorage(cart: Cart): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // localStorage unavailable (e.g. private browsing / quota exceeded) — fail silently
    }
  }

  addToCart(item: CartItem): void {
    const items = [...this.cart.value.items];

    const itemInCart = items.find(
      (_item) => _item.id === item.id
    );

    if (itemInCart) {
      itemInCart.quantity += 1;
    } else {
      items.push(item);
    }

    this.cart.next({
      items
    });

    this._snackBar.open(
      '1 item added to cart.',
      'Ok',
      { duration: 3000 }
    );
  }

  removeFromCart(
    item: CartItem,
    updateCart = true
  ): CartItem[] {

    const filteredItems = this.cart.value.items.filter(
      (_item) => _item.id !== item.id
    );

    if (updateCart) {
      this.cart.next({
        items: filteredItems
      });

      this._snackBar.open(
        '1 item removed from cart.',
        'Ok',
        { duration: 3000 }
      );
    }

    return filteredItems;
  }

  removeQuantity(item: CartItem): void {

    let itemForRemoval!: CartItem;

    let filteredItems = this.cart.value.items.map((_item) => {

      if (_item.id === item.id) {

        _item.quantity--;

        if (_item.quantity === 0) {
          itemForRemoval = _item;
        }
      }

      return _item;
    });

    if (itemForRemoval) {
      filteredItems = this.removeFromCart(
        itemForRemoval,
        false
      );
    }

    this.cart.next({
      items: filteredItems
    });

    this._snackBar.open(
      '1 item removed from cart.',
      'Ok',
      { duration: 3000 }
    );
  }

  clearCart(): void {

    this.cart.next({
      items: []
    });

    this._snackBar.open(
      'Cart is cleared.',
      'Ok',
      { duration: 3000 }
    );
  }

  getTotal(items: CartItem[]): number {

    return items
      .map((item) => item.price * item.quantity)
      .reduce(
        (prev, current) => prev + current,
        0
      );
  }
}