const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const { ensureAuthenticated } = require('../Middlewares/Auth');

// 🆕 Map of plan names to Stripe Price IDs
router.post('/create-checkout-session', async (req, res) => {
  const { email, plan } = req.body;

  const planToPriceId = {
    monthly: 'price_1RLRtP09zcpNWpFbiKyAWR36',
    yearly: 'price_1RPFyb09zcpNWpFb2au4X8xb',
    quarter_months: 'price_1RPHdh09zcpNWpFb6mWmZZOh',
  };

  const priceId = planToPriceId[plan];

  if (!priceId) {
    return res.status(400).json({ error: 'Invalid plan selected' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Update user plan after success
router.post('/update-subscription', ensureAuthenticated, async (req, res) => {
  const { plan } = req.body;

  if (!['monthly', 'yearly', 'quarter_months'].includes(plan)) {
    return res.status(400).json({ message: 'Invalid plan' });
  }

  try {
    const userId = req.user.id;
    await User.findByIdAndUpdate(userId, { plan });
    res.status(200).json({ message: `Subscription upgraded to ${plan}` });
  } catch (error) {
    console.error('Error upgrading plan:', error);
    res.status(500).json({ message: 'Failed to upgrade plan' });
  }
});

// Check Stripe session status
router.get('/check-session-status', async (req, res) => {
  const { session_id, plan } = req.query;

  if (!session_id) return res.status(400).json({ error: 'Missing session_id' });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      const user = await User.findOneAndUpdate(
        { email: session.customer_email },
        { plan },
        { new: true }
      );

      return res.status(200).json({
        message: 'Subscription successful and plan updated',
        plan,
        user,
      });
    }

    return res.status(200).json({ message: 'Payment not completed yet', session });
  } catch (error) {
    console.error('Error checking session:', error);
    res.status(500).json({ error: 'Failed to retrieve session' });
  }
});

// Manual override to premium (for dev/test)
router.post('/force-premium', async (req, res) => {
  const { email } = req.body;
  console.log('force-premium called with email:', email);

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { plan: 'premium' },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User marked as premium', user });
  } catch (error) {
    console.error('Error updating user to premium:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;