import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const pidx = params.get('pidx');

      if (!pidx) {
        toast({ title: "Invalid payment data", variant: "destructive" });
        navigate('/');
        return;
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/verify-payment`,
          { pidx },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        if (response.data.success) {
          toast({ title: "Payment successful!", variant: "success" });
          navigate('/orders');
        } else {
          toast({ title: "Payment verification failed", variant: "destructive" });
          navigate('/');
        }
      } catch (error) {
        toast({ title: error.message, variant: "destructive" });
        navigate('/');
      }
    };

    verifyPayment();
  }, [location, navigate, toast]);

  return <div>Processing payment...</div>;
};

export default PaymentSuccess;