import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../context/globalContext';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import successAnimation from '../assests/success-checkmark.json'; // Download from LottieFiles

const SuccessPage = () => {
  const { profile, getProfile } = useGlobalContext();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [width, height] = useWindowSize();
  const navigate = useNavigate();

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    const verifySession = async () => {
      const sessionId = new URLSearchParams(window.location.search).get('session_id');

      if (!profile?.email) {
        setErrorMessage('Email is missing from the profile');
        return;
      }

      if (!sessionId) {
        setErrorMessage('Missing session ID');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/subscription/check-session-status?session_id=${sessionId}`);
        const data = await response.json();

        if (profile.plan !== 'premium') {
          await fetch('http://localhost:5000/api/subscription/update-subscription', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          });

          const premiumResponse = await fetch('http://localhost:5000/api/subscription/force-premium', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: profile.email }),
          });

          const premiumData = await premiumResponse.json();
          if (premiumData.message === 'User marked as premium') {
            setIsSuccess(true);
            setTimeout(() => {
              navigate('/dashboard');
            }, 4000);
          } else {
            setErrorMessage('Error upgrading to premium');
          }
        } else {
          setErrorMessage('Payment not completed yet');
        }
      } catch (error) {
        console.error('Error verifying session:', error);
        setErrorMessage('Error verifying session');
      }
    };

    if (profile?.email) {
      verifySession();
    }
  }, [profile, navigate]);

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      {isSuccess && <Confetti width={width} height={height} />}

      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Lottie
            animationData={successAnimation}
            loop={false}
            style={{ width: 200, margin: '0 auto' }}
          />
          <motion.h2
            initial={{ scale: 0.9 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            style={{ color: '#4BB543', marginTop: 20 }}
          >
            Subscription Confirmed!
          </motion.h2>
          <p style={{ fontSize: '18px', marginTop: 10 }}>
            You're now a Premium user 🎉<br /> Redirecting to dashboard...
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2>{errorMessage || 'Please wait while we process your subscription...'}</h2>
        </motion.div>
      )}
    </div>
  );
};

export default SuccessPage;