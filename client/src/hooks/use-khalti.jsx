import axios from "axios";
import { useToast } from "./use-toast";
import { useNavigate } from "react-router-dom";

const useKhalti = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadScript = (src) => {
    return new Promise((resolve) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
      
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  console.log("VITE_KHALTI_PUBLIC_KEY =", import.meta.env.VITE_KHALTI_PUBLIC_KEY);

  const initializeKhalti = async (config) => {
    try {
      const loaded = await loadScript(
        "https://khalti.s3.ap-south-1.amazonaws.com/KPG/dist/2020.12.17.0.0.0/khalti-checkout.iffe.js"
      );

      if (!loaded) throw new Error("Failed to load Khalti SDK");
      return new window.KhaltiCheckout(config);

    } catch (error) {
      toast({ title: error.message, variant: "destructive" });
      return null;
    }
  };

  const verifyPayment = async (payload) => {
    try {
      if (!payload?.token || !payload?.amount) {
        throw new Error("Invalid payment payload");
      }

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/verify-payment`,
        payload,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      toast({ title: data.message || "Payment successful!" });
      navigate("/orders");
      return data;

    } catch (error) {
      const errorMessage = error.response?.data?.message || 
        error.message || "Payment verification failed";
      
      toast({ title: errorMessage, variant: "destructive" });
      
      if (error.response?.status === 401) {
        navigate("/login");
      }
      return null;
    }
  };

  return { initializeKhalti, verifyPayment };
};

export default useKhalti;