import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { emptyCart } from '@/redux/slices/cartSlice';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import CheckoutProduct from '@/components/custom/CheckoutProduct';
import axios from 'axios';

const Checkout = () => {
  const [address, setAddress] = useState("");
  const { cartItems, totalPrice } = useSelector((state) => state.cart);
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCheckout = async () => {
    if (address.trim() === "") {
      toast({ title: "Please enter your address", variant: "destructive" });
      return;
    }

    const productArray = cartItems.map((item) => ({
      id: item._id,
      quantity: item.quantity,
      color: item.color,
    }));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/generate-payment`,
        {
          products: productArray,
          address,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (response.data.success) {
        window.location.href = response.data.payment_url;
      } else {
        toast({ title: "Failed to initiate payment", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: error.message, variant: "destructive" });
    }
  };

  return (
    <div className='mx-auto w-[90vw] sm:w-[60vw] flex justify-between items-center sm:my-20'>
      <div className='flex flex-col sm:flex-row gap-5 mx-auto my-10'>
        {/* Product Details */}
        <div className='space-y-8'>
          <div className='p-4 space-y-4 '>
            <h2>Order Summary</h2>
            <div className='space-y-1 text-3xl'>
              {cartItems.length === 0 ? (
                <h2 className='text-primary text-3xl'>Nothing to show, Please add some products</h2>
              ) : (
                cartItems.map((item) => <CheckoutProduct key={item._id} {...item} />)
              )}
            </div>
            <hr />
            <div className='p-3 rounded-md'>
              <p className='flex justify-between items-center'>
                <span className='font-semibold text-customGray'>Subtotal:</span>
                <span>Rs. {totalPrice}</span>
              </p>
              <p className='flex justify-between items-center'>
                <span className='font-semibold text-customGray'>Shipping:</span>
                <span>Rs.0</span>
              </p>
              <p className='flex justify-between items-center'>
                <span className='font-semibold text-customGray'>Tax:</span>
                <span>Rs.0</span>
              </p>
            </div>
            <hr />
            <p className='flex justify-between items-center'>
              <span className='font-semibold text-customGray'>Total:</span>
              <span>Rs. {totalPrice}</span>
            </p>
          </div>
        </div>

        {/* Personal Details */}
        <div className="w-[90vw] sm:w-[20vw]">
          <Card className="p-4 shadow-md space-y-4">
            <h2 className='text-xl font-medium justify-center'>Billing Information</h2>
            <div className="space-y-2">
              <Label htmlFor="name"> Name</Label>
              <Input id="name" placeholder="John Doe" className="w-full" defaultValue={useSelector((state) => state.auth.user)?.name} />
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" placeholder="john.doe@example.com" className="w-full" defaultValue={useSelector((state) => state.auth.user)?.email} />
              <Label htmlFor="address">Shipping Address</Label>
              <Textarea rows="7" id="address" placeholder="123 Main st. city, State" className="w-full" onChange={(e) => setAddress(e.target.value)} />
            </div>
            <Button onClick={handleCheckout}>Place Order</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;