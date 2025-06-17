// src/components/SubscribeButton.js

const SubscribeButton = ({ email }) => {
  const handleSubscribe = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/subscription/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          priceId: 'price_1RLRtP09zcpNWpFbiKyAWR36', // Replace with actual priceId
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe checkout
      } else {
        alert('Failed to initiate checkout.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  return (
    <button onClick={handleSubscribe}>
      Subscribe Now
    </button>
  );
};

export default SubscribeButton;