import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/provider/theme-provider";
import { Toaster } from "./components/ui/toaster";
import Navbar from "./components/custom/Navbar";
import Footer from "./components/custom/Footer";
import ProtectedRoute from "./components/custom/ProtectedRoute";
import RootLayout from "./layouts/RootLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Product from "./pages/Product";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import PaymentSuccess from "./components/custom/PaymentSuccess";
import AdminLogin from "./pages/AdminLogin";
import CreateProducts from "./components/custom/CreateProducts";
import Orders from "./components/custom/Orders";
import AllProducts from "./components/custom/AllProducts";
import Analytics from "./components/custom/Analytics";
import Settings from "./components/custom/Settings";
import Error from "./pages/Error";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <RootLayout children={<Home />} />
        </ProtectedRoute>
      ),
    },
    {
      path: "/signup",
      element: (
        <ProtectedRoute>
          <RootLayout children={<Signup />} />
        </ProtectedRoute>
      ),
    },
    {
      path: "/login",
      element: (
        <ProtectedRoute>
          <RootLayout children={<Login />} />
        </ProtectedRoute>
      ),
    },
    {
      path: "/product/:productName",
      element: <RootLayout children={<Product />} />,
    },
    {
      path: "/checkout",
      element: (
        <ProtectedRoute>
          <RootLayout children={<Checkout />} />
        </ProtectedRoute>
      ),
    },
    {
      path: "/orders",
      element: <RootLayout children={<MyOrders />} />,
    },
    {
      path: "/payment/success",
      element: (
        <ProtectedRoute>
          <RootLayout children={<PaymentSuccess />} />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/login",
      element: (
        <ProtectedRoute>
          <RootLayout children={<AdminLogin />} />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/dashboard",
      element: (
        <ProtectedRoute>
          <AdminLayout children={<CreateProducts />} />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/orders",
      element: (
        <ProtectedRoute>
          <AdminLayout children={<Orders />} />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/products",
      element: (
        <ProtectedRoute>
          <AdminLayout children={<AllProducts />} />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/analytics",
      element: (
        <ProtectedRoute>
          <AdminLayout children={<Analytics />} />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/settings",
      element: (
        <ProtectedRoute>
          <AdminLayout children={<Settings />} />
        </ProtectedRoute>
      ),
    },
    {
      path: "/*",
      element: (
        <>
          <Navbar />
          <Error />
          <Footer />
        </>
      ),
    },
    // Removed /success route as it’s redundant for payment
  ]);

  return (
    <ThemeProvider>
      <Toaster />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}