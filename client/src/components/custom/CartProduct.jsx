import { Colors } from '@/constants/colors';
import { useToast } from '@/hooks/use-toast';
import { addToCart, removeFromCart } from '@/redux/slices/cartSlice';
import { Minus, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Input } from '../ui/input';

const CartProduct = ({
  name,
  price,
  _id,
  image,
  quantity,
  stock,
  rating,
  blacklisted,
  color
}) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [address, setAddress] = useState("");

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (quantity > stock) {
      toast({ title: "Product out of stock" });
      return;
    }
    if (blacklisted) {
      toast({ title: "Product is not available for purchase" });
      return;
    }
    if (address.trim() === "") {
      toast({ title: "Please enter your address" });
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/generate-payment`,
        {
          products: [{ id: _id, quantity, color }],
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
    <div className='border w-fit rounded-2xl overflow-clip grid z-1 relative hover:shadow-md'>
      <img src={image} alt={name} className='w-[30rem] sm:w-[20rem] sm:h-[20rem] object-cover rounded-t-2xl'/>
      <div className='px-3 grid gap-1 py-2 absolute bg-white dark:bg-zinc-900 w-full bottom-0 rounded-xl'>
        <h2 className='text-md'>{name}</h2>
        <span className="font-semibold text-md">Rs. {price}</span>
        <div className='flex justify-between my-2 items-center'>
          <div className='flex gap-4 items-center'>
            <div className='flex items-center gap-4 bg-gray-100 rounded-lg px-3 py-2 w-fit'>
              <Minus size={15} stroke={Colors.customGray} onClick={() => { quantity > 1 ? dispatch(removeFromCart({ _id, quantity: 1, price })) : 1 }} />
              <span className='text-slate-950 text-sm sm:text-md'>{quantity}</span>
              <Plus size={15} stroke={Colors.customGray} onClick={() => { stock === quantity ? toast({ title: "Maximum product reached" }) : dispatch(addToCart({ _id, quantity: 1, price })) }} />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Enter Your Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full"
            />
            <Button onClick={handleBuyNow}>Buy Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;