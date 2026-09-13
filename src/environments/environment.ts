// Development environment.
// This file is used by default (`ng serve`, `ng build` without --configuration production).
export const environment = {
  production: false,

  // Fake Store API base URL.
  storeApiBaseUrl: 'https://fakestoreapi.com',

  // Backend endpoint that creates a Stripe Checkout Session.
  // Point this at your real backend once you have one running.
  checkoutApiUrl: 'http://localhost:4242/checkout',

  // Stripe PUBLISHABLE key (safe to expose in frontend code — starts with pk_).
  // Get yours at: https://dashboard.stripe.com/test/apikeys
  // NEVER put a secret key (sk_...) here — that must only ever live on your backend.
  stripePublishableKey: 'pk_test_51UFAO5CBVLdx4Ts8yK0nSqldsxVu9Xlbr3OnMorACnb5TFlDwb0ElL8j4Fk2HuKNea7EKVfMsH5UGb8K3I65K7ef00tqq7ZPTE',
};
