// Minimal backend for Sloba Store checkout.
// Creates a Stripe Checkout Session and returns its id to the frontend.

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// The deployed frontend's base URL, used to build Stripe's redirect URLs.
// Set FRONTEND_URL in your .env (locally) or in your host's environment
// variables (e.g. Render) to your real deployed site's address, e.g.
// https://your-username.github.io/your-repo-name
// Falls back to localhost for local development if not set.
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';

const stripe = Stripe(STRIPE_SECRET_KEY);
const app = express();

app.use(cors());
app.use(express.json());

app.post('/checkout', async (req, res) => {
  try {
    const items = req.body.items || [];

    if (!items.length) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100), // Stripe expects cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${FRONTEND_URL}/cart?success=true`,
      cancel_url: `${FRONTEND_URL}/cart?canceled=true`,
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error('Stripe session creation failed:', err);
    res.status(500).json({ error: 'Could not create checkout session.' });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Checkout server running on port ${PORT}`);
});