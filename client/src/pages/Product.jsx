import ReviewComponent from "@/components/custom/ReviewComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Colors } from "@/constants/colors";
import { starsGenerator } from "@/constants/helper";
import { useToast } from "@/hooks/use-toast";
import { addToCart } from "@/redux/slices/cartSlice";
import axios from "axios";
import { Circle, Minus, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import useKhalti from "@/hooks/use-khalti";

const imagesArray = [
  {
    url: "https://images.pexels.com/photos/2609459/pexels-photo-2609459.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    id: 1,
  },
  {
    url: "https://images.pexels.com/photos/2609459/pexels-photo-2609459.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    id: 2,
  },
  {
    url: "https://images.pexels.com/photos/2609459/pexels-photo-2609459.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    id: 3,
  },
  {
    url: "https://images.pexels.com/photos/2609459/pexels-photo-2609459.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    id: 4,
  },
];
const productStock = 5;

const Product = () => {
  const { productName } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [productQuantity, setProductQuantity] = useState(1);
  const [purchaseProduct, setPurchaseProduct] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [address, setAddress] = useState(""); // Changed from boolean
  const [pincode, setPincode] = useState("");
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [product, setProduct] = useState("");
  const [productColor, setProductColor] = useState("");
  const { initializeKhalti, verifyPayment } = useKhalti();
  const [selectedImage, setSelectedImage] = useState(0);
  const calculateEmi = (price) => Math.round(price / 6);
  console.log(product);
  useEffect(() => {
    const filterProductName = async () => {
      const res = await axios.get(
        import.meta.env.VITE_API_URL + `/get-product-by-name/${productName}`
      );

      const { data } = await res.data;
      // console.log(data)
      setProduct(data);
    };
    filterProductName();
  }, [productName]);

  const checkAvailablity = async () => {
    if (pincode.trim() === "") {
      setAvailabilityMessage("Please Enter a valid code");
      return;
    }

    const res = await axios.get(
      import.meta.env.VITE_API_URL + `/get-pincode/${pincode}`
    );
    console.log(res.data.message);
    const data = await res.data;

    setAvailabilityMessage(data.message);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (productColor === "") {
      toast({
        title: "Please select a color.",
      });
      return;
    }

    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: productQuantity,
        image: product.images[0].url,
        color: productColor,
        stock: product.stock,
        blackListed: product.blackListed,
      })
    );

    setProductQuantity(1);

    toast({
      title: "Product added to cart",
    });
  };

  const handleBuyNow = async () => {
  if (!isAuthenticated) {
    navigate("/login");
    return;
  }

  if (product.quantity > product.stock) {
    toast({ title: "Product out of stock" });
    return;
  }

  if (product.blackListed) { // Fixed typo: blacklisted -> blackListed
    toast({ title: "Product is not available for purchase" });
    return;
  }

  if (address.trim() === "") {
    toast({ title: "Please enter your address" });
    return;
  }

  try {
    const checkout = await initializeKhalti({
      publicKey: import.meta.env.VITE_KHALTI_PUBLIC_KEY,
      productIdentity: product._id,
      productName: product.name,
      productUrl: window.location.href,
      eventHandler: {
        async onSuccess(payload) {
          await verifyPayment({
            token: payload.token,
            amount: product.price * productQuantity,
            productArray: [
              {
                id: product._id,
                quantity: productQuantity,
                color: productColor,
              },
            ],
            address, // Use dynamic address
          });
        },
        onError(error) {
          toast({ title: error.message, variant: "destructive" });
        },
        onClose() {
          console.log("Checkout closed");
        },
      },
    });

    checkout.show({
      amount: product.price * productQuantity * 100,
      mobile: "9800000000", // Replace with user.phone if available
    });
  } catch (error) {
    toast({ title: error.message, variant: "destructive" });
  }
};

  return (
    <>
      <div>
        <main className="w-[93vw] lg:w-[70vw] flex flex-col sm:flex-row justify-start items-start gap-10 mx-auto my-10">
          {/*Left side */}
          <div className="grid sm:w-[50%] gap-3">
            <img
              src={product?.images?.[selectedImage]?.url}
              className="w-full lg:h-[30rem] rounded-xl object-center object-cover border dark:border-none"
            ></img>
            <div className="grid grid-cols-4 gap-3">
              {product?.images?.map(({ url, id }, index) => (
                <div
                  key={id}
                  className="aspect-square overflow-hidden rounded-xl"
                >
                  <img
                    src={url}
                    onClick={() => setSelectedImage(index)}
                    className="w-full h-full object-cover hover:brightness-50 cursor-pointer transition-all duration-300 border dark:border-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/*Right side */}
          <div className="sm:w-[50%] lg:w-[30%] gap-3">
            <div className="pb-5 gap-3">
              <h2 className="font-extrabold text-2xl">{product.name}</h2>

              <p>{product.description}</p>
              <div className="flex items-center">
                {starsGenerator(product.rating, "0", 15)}
                <span className="text-md ml-1">
                  ({product?.reviews?.length})
                </span>
              </div>
            </div>

            <div className="py-5 border-t border-b">
              <h3 className="font-bold text-xl">
                Rs. {product?.price} or Rs. {calculateEmi(product.price)}/month
              </h3>
              <p className="text-sm">
                Suggested payments within 6 months special financing
              </p>
            </div>

            <div className="py-5 border-b">
              <h3 className="font-bold text-lg"> Choose color</h3>
              <div className="flex items-center my-2">
                {product?.colors?.map((color) => (
                  <Circle
                    key={color + 1}
                    fill={color}
                    strokeOpacity={0.2}
                    strokeWidth={0.2}
                    size={40}
                    className="cursor-pointer filter hover:brightness-50"
                    onClick={() => setProductColor(color)}
                  />
                ))}
              </div>
            </div>

            <div className="py-5">
              <div className="flex gap-3 items-center">
                <div className="flex items-center gap-5 bg-gray-100 rounded-full px-3 py-2 w-fit">
                  <Minus
                    stroke={Colors.customGray}
                    onClick={() =>
                      setProductQuantity((qty) => (qty > 1 ? qty - 1 : 1))
                    }
                    cursor={"pointer"}
                  />
                  <span className="text-slate-950">{productQuantity}</span>
                  <Plus
                    stroke={Colors.customGray}
                    onClick={() =>
                      setProductQuantity((qty) =>
                        qty < productStock ? qty + 1 : qty
                      )
                    }
                    cursor={"pointer"}
                  />
                </div>

                {productStock - productQuantity > 0 && (
                  <div className="grid text-sm font-semibold text-gray-600">
                    <span>
                      Only{" "}
                      <span className="text-customYellow">
                        {productStock - productQuantity} items
                      </span>{" "}
                      left!
                    </span>
                    <span>Don't miss it</span>
                  </div>
                )}
              </div>

              <div className="grid gap-3 my-5">
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter Your Pincode Here..."
                    onChange={(e) => setPincode(e.target.value)}
                  />
                  <Button onClick={checkAvailablity}>Check Availability</Button>
                </div>
                <p className="text-sm px-2">{availabilityMessage}</p>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setPurchaseProduct(true)}>
                  Buy Now
                </Button>
                <Button variant="outline" onClick={handleAddToCart}>
                  Add to Cart
                </Button>
              </div>
              {purchaseProduct && (
                <div className="flex my-2 gap-2">
                  <Input
                    placeholder="Enter Your Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                  <Button onClick={handleBuyNow} disabled={processingPayment}>
                    {processingPayment ? "Processing..." : "Confirm Payment"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>
        {/* Review Section */}
        <ReviewComponent productId={product?._id} />
      </div>
    </>
  );
};

export default Product;
