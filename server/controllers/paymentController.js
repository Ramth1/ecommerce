const axios = require('axios');
const User = require("../models/User");
const Product = require("../models/Products");
const Order = require("../models/Order");

const generatePayment = async (req, res) => {
  try {
    const { products, address } = req.body;
    const user = req.user; // Assuming verifyToken middleware attaches user

    if (!products || !Array.isArray(products) || products.length === 0 || !address) {
      return res.status(400).json({ success: false, message: "Invalid order data" });
    }

    // Validate products and calculate total amount
    let totalAmount = 0;
    for (const item of products) {
      const product = await Product.findById(item.id);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.id}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      }
      totalAmount += product.price * item.quantity;
    }

    // Create new order
    const newOrder = new Order({
      amount: totalAmount,
      address,
      products,
      userId: user._id,
      status: 'pending'
    });
    await newOrder.save();

    // Prepare Khalti payload
    const payload = {
      return_url: 'http://localhost:3000/payment/success', // Update for production
      website_url: 'http://localhost:3000', // Update for production
      amount: totalAmount * 100, // Convert to paisa
      purchase_order_id: newOrder._id.toString(),
      purchase_order_name: `Order_${newOrder._id}`,
      customer_info: {
        name: user.name || "Customer",
        email: user.email || "customer@example.com",
        phone: user.phone || "9800000000",
      },
    };

    // Initiate payment with Khalti
    const response = await axios.post(
      `${process.env.KHALTI_API_URL || 'https://khalti.com/api/v2/'}epayment/initiate/`,
      payload,
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Save pidx to order
    newOrder.khaltiPaymentId = response.data.pidx;
    await newOrder.save();

    return res.status(200).json({
      success: true,
      payment_url: response.data.payment_url,
    });
  } catch (error) {
    console.error('Payment initiation error:', error.response?.data || error.message);
    return res.status(500).json({ success: false, message: 'Payment initiation failed' });
  }
};

const verifyPayment = async (req, res) => {
  const { pidx } = req.body;

  if (!pidx) {
    return res.status(400).json({ success: false, message: "Missing pidx" });
  }

  try {
    // Verify payment status with Khalti
    const response = await axios.post(
      `${process.env.KHALTI_API_URL || 'https://khalti.com/api/v2/'}epayment/verify/`,
      { pidx },
      {
        headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}` },
      }
    );

    if (response.data.status === 'Completed') {
      // Find order by pidx
      const order = await Order.findOne({ khaltiPaymentId: pidx });
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      // Update order status
      order.status = 'paid';
      await order.save();

      // Update product stock and user's purchased products
      for (const item of order.products) {
        await Product.findByIdAndUpdate(item.id, { $inc: { stock: -item.quantity } });
        await User.findByIdAndUpdate(order.userId, { $addToSet: { purchasedProducts: item.id } });
      }

      return res.status(200).json({ success: true, message: "Payment verified and order updated" });
    } else {
      return res.status(400).json({ success: false, message: "Payment not completed" });
    }
  } catch (error) {
    console.error('Payment verification error:', error.response?.data || error.message);
    return res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
};

module.exports = { generatePayment, verifyPayment };