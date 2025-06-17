import styled from 'styled-components';
import { useGlobalContext } from '../context/globalContext';

const plans = [
  {
    name: 'monthly', 
    label: 'Monthly',
    price: '$5/month', description: 'Billed monthly, cancel anytime',
    features: [
      'Track monthly income and expenses',
      'Add categories like Food, Transport, Bills',
      'View basic charts and summaries',
      'Set monthly saving goals',
      'Access on one device',
      'Limited exports available (CSV only)',
    ],
  },
  {
    name: 'quarter_months', 
    label: 'Quarter_months',
    price: '$12/3 months', description: 'Save 10% annually' ,
    features: [
      'Everything in Free Plan',
      'Multi-device access (mobile + web)',
      'Advanced category tracking',
      'Export data to PDF and Excel',
      'Budgeting tips',
      'Set multiple savings goals and auto-reminders',
    ],
  },
  {
    name: 'yearly', 
    label: 'Yearly',
    price: '$50/year', description: 'Save 17% vs monthly plan',
    features: [
    'Everything in Plus Plan',
    'AI-powered suggestions for savings & investments',
    'Smart bill detection from SMS or receipts',
    'Unlimited exports & data backups',
    '24/7 chat support',
    'Early access to new features and updates',
  ],
  }
];

const PricingPage = () => {
  const { profile } = useGlobalContext();

  const handleCheckout = async (plan) => {
    if (!profile?.email) {
      alert("Email not loaded. Please wait or try again.");
      return;
    }

    const response = await fetch("http://localhost:5000/api/subscription/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: profile.email,
        plan: plan,
      }),
    });

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Failed to start checkout");
    }
  };

  return (
    <Container>
      <h1>Select Your Plan</h1>
      <PlanGrid>
        {plans.map((p) => (
          <PlanCard key={p.name}>
            {p.name === 'plus' && <Popular>POPULAR</Popular>}
            <h2>{p.label}</h2>
            <p className="price">{p.price}</p>
            <p className="desc">{p.description}</p>
            <ul>
              {p.features.map((feature, index) => (
                <li key={index}>✅ {feature}</li>
              ))}
            </ul>
            <button onClick={() => handleCheckout(p.name)}>Choose {p.label}</button>
          </PlanCard>
        ))}
      </PlanGrid>
    </Container>
  );
};

export default PricingPage;

// Styled Components
const Container = styled.div`
  padding: 2rem;
  text-align: center;
  h1 {
  font-size: 2.5rem;
  color: black;
  margin-bottom: 1.5rem;
  font-weight: 700;
  background-color:  #ff7e5f;
  border: 3px solid black;
  border-radius: 30px;
  padding: 0.8rem 2rem;
  display: inline-block;
}
`;

const PlanGrid = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
`;

const PlanCard = styled.div`
  background: #f9f9f9;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  width: 300px;
  position: relative;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.03);
  }

  h2 {
    margin-bottom: 0.5rem;
  }

  .price {
    font-size: 1.2rem;
    color: #444;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .desc {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 1rem;
  }

  ul {
    text-align: left;
    margin: 1rem 0;
    padding-left: 1.2rem;

    li {
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }
  }

  button {
    margin-top: 1rem;
    padding: 0.6rem 1.2rem;
    background: #ff7e5f;
    border: none;
    color: white;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: #ff4e00;
    }
  }
`;

const Popular = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  background: gold;
  color: black;
  font-weight: bold;
  padding: 0.3rem 0.7rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
`;