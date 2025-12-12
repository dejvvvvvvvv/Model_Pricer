import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import Home from './pages/home';
import ModelUpload from './pages/model-upload';
import Pricing from './pages/pricing';
import Support from './pages/support';
import AccountPage from './pages/account';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './pages/NotFound';
import Login from './pages/login';
import Register from './pages/register';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBranding from './pages/admin/AdminBranding';
import AdminPricing from './pages/admin/AdminPricing';
import AdminFees from './pages/admin/AdminFees';
import AdminParameters from './pages/admin/AdminParameters';
import AdminPresets from './pages/admin/AdminPresets';
import AdminOrders from './pages/admin/AdminOrders';
import AdminWidget from './pages/admin/AdminWidget';


export default function Routes() {
  return (
    <BrowserRouter>
      <Header />
      <main className="pt-16">
        <RouterRoutes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

          {/* veřejné */}
          <Route path="/" element={<Home />} />
          <Route path="/model-upload" element={<ModelUpload />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/support" element={<Support />} />

          {/* chráněné - DOČASNĚ VYPNUTO PRO VÝVOJ */}
          {/* <Route element={<PrivateRoute />}> */}
            <Route path="/account" element={<AccountPage />} />
          {/* </Route> */}

          {/* Admin Panel */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="branding" element={<AdminBranding />} />
            <Route path="pricing" element={<AdminPricing />} />
            <Route path="fees" element={<AdminFees />} />
            <Route path="parameters" element={<AdminParameters />} />
            <Route path="presets" element={<AdminPresets />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="widget" element={<AdminWidget />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
