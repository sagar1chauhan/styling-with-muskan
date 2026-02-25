import { Toaster } from "@/modules/user/components/ui/toaster";
import { Toaster as Sonner } from "@/modules/user/components/ui/sonner";
import { TooltipProvider } from "@/modules/user/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GenderThemeProvider } from "@/modules/user/contexts/GenderThemeContext";
import { CartProvider } from "@/modules/user/contexts/CartContext";
import { AuthProvider } from "@/modules/user/contexts/AuthContext";
import { BookingProvider } from "@/modules/user/contexts/BookingContext";
import SplashScreen from "@/modules/user/pages/SplashScreen";
import GenderSelect from "@/modules/user/pages/GenderSelect";
import HomePage from "@/modules/user/pages/HomePage";
import ExplorePage from "@/modules/user/pages/ExplorePage";
import BookingsPage from "@/modules/user/pages/BookingsPage";
import ServiceDetail from "@/modules/user/pages/ServiceDetail";
import BookingSummary from "@/modules/user/pages/BookingSummary";
import PaymentPage from "@/modules/user/pages/PaymentPage";
import ProfilePage from "@/modules/user/pages/ProfilePage";
import EditProfilePage from "@/modules/user/pages/EditProfilePage";
import WalletPage from "@/modules/user/pages/WalletPage";
import AddressesPage from "@/modules/user/pages/AddressesPage";
import ReferralPage from "@/modules/user/pages/ReferralPage";
import CouponsPage from "@/modules/user/pages/CouponsPage";
import SupportPage from "@/modules/user/pages/SupportPage";
import NotFound from "@/modules/user/pages/NotFound";
import WishlistPage from "@/modules/user/pages/WishlistPage";
import { WishlistProvider } from "@/modules/user/contexts/WishlistContext";
import LoginModal from "@/modules/user/components/salon/LoginModal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BookingProvider>
          <GenderThemeProvider>
            <CartProvider>
              <WishlistProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<SplashScreen />} />
                    <Route path="/select-gender" element={<GenderSelect />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/explore/:categoryId" element={<ExplorePage />} />
                    <Route path="/bookings" element={<BookingsPage />} />
                    <Route path="/service/:id" element={<ServiceDetail />} />
                    <Route path="/booking/:id" element={<BookingSummary />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/edit-profile" element={<EditProfilePage />} />
                    <Route path="/wallet" element={<WalletPage />} />
                    <Route path="/addresses" element={<AddressesPage />} />
                    <Route path="/referral" element={<ReferralPage />} />
                    <Route path="/coupons" element={<CouponsPage />} />
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <LoginModal />
                </BrowserRouter>
              </WishlistProvider>
            </CartProvider>
          </GenderThemeProvider>
        </BookingProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
