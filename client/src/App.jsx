import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Navbar from './components/common/Navbar.jsx'
import Footer from './components/common/Footer.jsx'
import Loader from './components/common/Loader.jsx'
import Toast from './components/common/Toast.jsx'
import ScrollToTop from './components/common/ScrollToTop.jsx'
import ProtectedRoute from './components/common/ProtectedRoute.jsx'
import AdminRoute from './components/common/AdminRoute.jsx'

const HomePage = lazy(() => import('./pages/HomePage.jsx'))
const ShopPage = lazy(() => import('./pages/ShopPage.jsx'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage.jsx'))
const CartPage = lazy(() => import('./pages/CartPage.jsx'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.jsx'))
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage.jsx'))
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage.jsx'))
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'))
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'))
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'))
const WishlistPage = lazy(() => import('./pages/WishlistPage.jsx'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders.jsx'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts.jsx'))
const AdminAddProduct = lazy(() => import('./pages/admin/AdminAddProduct.jsx'))
const AdminEditProduct = lazy(() => import('./pages/admin/AdminEditProduct.jsx'))
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers.jsx'))
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons.jsx'))
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews.jsx'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings.jsx'))
const AdminExpenses = lazy(() => import('./pages/admin/AdminExpenses.jsx'))

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/orders" element={<AdminOrders />} />
          <Route path="/products" element={<AdminProducts />} />
          <Route path="/products/add" element={<AdminAddProduct />} />
          <Route path="/products/edit/:id" element={<AdminEditProduct />} />
          <Route path="/customers" element={<AdminCustomers />} />
          <Route path="/coupons" element={<AdminCoupons />} />
          <Route path="/reviews" element={<AdminReviews />} />
          <Route path="/settings" element={<AdminSettings />} />
          <Route path="/expenses" element={<AdminExpenses />} />
        </Routes>
      </Suspense>
    </div>
  )
}

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/track-order" element={<OrderTrackingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Toast />
      <Routes>
        <Route path="/admin/*" element={<AdminRoute><AdminLayout /></AdminRoute>} />
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </>
  )
}
