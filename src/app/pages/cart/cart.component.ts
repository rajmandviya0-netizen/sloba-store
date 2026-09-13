import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { loadStripe } from '@stripe/stripe-js';
import { Subscription, catchError, finalize, of } from 'rxjs';
import { environment } from 'src/environments/environment';

interface CheckoutSessionResponse {
  id: string;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart = { items: [] };
  displayedColumns: string[] = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action',
  ];
  dataSource: CartItem[] = [];
  cartSubscription: Subscription | undefined;

  // True while a checkout request is in flight — used to disable the button
  // and prevent duplicate submissions on double-click.
  isCheckingOut = false;

  constructor(
    private cartService: CartService,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = _cart.items;
    });
  }

  getTotal(items: CartItem[]): number {
    return this.cartService.getTotal(items);
  }

  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onCheckout(): void {
    if (this.cart.items.length === 0 || this.isCheckingOut) {
      return;
    }

    this.isCheckingOut = true;

    this.http
      .post<CheckoutSessionResponse>(environment.checkoutApiUrl, {
        items: this.cart.items,
      })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.error('Checkout session request failed:', err);
          this.snackBar.open(
            'Could not start checkout. Please try again in a moment.',
            'Ok',
            { duration: 4000 }
          );
          return of(null);
        }),
        finalize(() => {
          this.isCheckingOut = false;
        })
      )
      .subscribe(async (res) => {
        if (!res) {
          // The request failed and was already reported above.
          return;
        }

        try {
          const stripe = await loadStripe(environment.stripePublishableKey);

          if (!stripe) {
            this.snackBar.open(
              'Payment provider failed to load. Please try again.',
              'Ok',
              { duration: 4000 }
            );
            return;
          }

          const { error } = await stripe.redirectToCheckout({
            sessionId: res.id,
          });

          if (error) {
            this.snackBar.open(
              error.message ?? 'Could not redirect to checkout.',
              'Ok',
              { duration: 4000 }
            );
          }
        } catch (err) {
          console.error('Stripe redirect failed:', err);
          this.snackBar.open(
            'Something went wrong starting checkout.',
            'Ok',
            { duration: 4000 }
          );
        }
      });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
