import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';

import { Cart, CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule
  ],

  template: `
    <mat-toolbar class="justify-between max-w-7xl mx-auto border-x">

      <a routerLink="home">
        Code with Sloba store
      </a>

      <button mat-icon-button [matMenuTriggerFor]="menu">

        <mat-icon
          [matBadge]="itemsQuantity"
          [matBadgeHidden]="!itemsQuantity"
          matBadgeColor="warn">
          shopping_cart
        </mat-icon>

      </button>

      <mat-menu #menu="matMenu">

        <div class="p-3 divide-y divide-solid">

          <div class="pb-3 flex justify-between">

            <span class="mr-16">
              {{ cart.items.length }} items
            </span>

            <a routerLink="cart">
              View Cart
            </a>

          </div>

          <div *ngIf="cart.items.length" class="py-3">

            <div
              *ngFor="let item of cart.items"
              class="flex justify-between font-light mb-2">

              {{ item.name }} x {{ item.quantity }}

              <span class="font-bold not-italic">
                {{ item.price | currency }}
              </span>

            </div>

          </div>

          <div class="flex justify-between py-3 font-light">

            Total:

            <span class="font-bold not-italic">
              {{ getTotal(cart.items) | currency }}
            </span>

          </div>

          <div class="pt-3 flex justify-between">

            <button
              (click)="onClearCart()"
              class="bg-rose-600 text-white rounded-full w-9 h-9">

              <mat-icon>
                remove_shopping_cart
              </mat-icon>

            </button>

            <button
              routerLink="cart"
              class="bg-green-600 text-white rounded-full w-9 h-9">

              <mat-icon>
                shopping_cart_checkout
              </mat-icon>

            </button>

          </div>

        </div>

      </mat-menu>

    </mat-toolbar>
  `

})
export class HeaderComponent {

  cart: Cart = {
    items: []
  };

  itemsQuantity = 0;

  constructor(private cartService: CartService) {

    this.cartService.cart.subscribe((cart: Cart) => {
      this.cart = cart;
      this.itemsQuantity = this.getQuantity();
    });

  }

  getQuantity(): number {

    return this.cart.items
      .map((item: CartItem) => item.quantity)
      .reduce(
        (previous: number, current: number) => previous + current,
        0
      );

  }

  getTotal(items: CartItem[]): number {

    return this.cartService.getTotal(items);

  }

  onClearCart(): void {

    this.cartService.clearCart();

  }

}