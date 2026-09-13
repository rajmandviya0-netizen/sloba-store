// Production environment.
// Swapped in automatically by `ng build --configuration production`
// via the fileReplacements entry in angular.json.
export const environment = {
  production: true,

  // Replace with your production API URLs before deploying.
  storeApiBaseUrl: 'https://fakestoreapi.com',
  checkoutApiUrl: 'https://your-real-backend.example.com/checkout',
  stripePublishableKey: 'pk_live_REPLACE_WITH_YOUR_STRIPE_PUBLISHABLE_KEY',
};
